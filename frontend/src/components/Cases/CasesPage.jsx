import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { USER_ROLES } from '../../utils/constants';
import { format } from 'date-fns';

const CasesPage = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await api.get('/cases', {
        params: {
          page: 1,
          limit: 10,
          sortBy: 'registrationDate',
          sortOrder: 'desc'
        }
      });
      setCases(response.data.cases);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching cases:', error);
      toast.error('Failed to load cases');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'registered': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-green-100 text-green-800';
      case 'disposed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPageTitle = () => {
    switch (user?.role) {
      case USER_ROLES.REGISTRAR: return 'All Cases';
      case USER_ROLES.JUDGE: return 'My Assigned Cases';
      case USER_ROLES.LAWYER: return 'My Cases';
      case USER_ROLES.USER: return 'My Cases';
      default: return 'Cases';
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
        <div className="text-sm text-gray-500">
          Total: {pagination.totalCases || 0} cases
        </div>
      </div>

      {cases.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No cases found.</p>
          {user?.role === USER_ROLES.REGISTRAR && (      
            <p className="text-sm text-gray-400 mt-2">
              Start by registering a new case using the "Register Case" option.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {cases.map((caseItem) => (
            <div key={caseItem._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      {caseItem.title}
                    </h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(caseItem.status)}`}>
                      {caseItem.status?.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="mt-1 text-sm text-gray-600">
                    Case #{caseItem.caseNumber} • {caseItem.caseType?.replace('_', ' ')}
                  </p>
                  
                  <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                    {caseItem.description}
                  </p>
                  
                  <div className="mt-3 flex items-center space-x-6 text-sm text-gray-500">
                    <span>
                      Filed: {caseItem.registrationDate ? format(new Date(caseItem.registrationDate), 'MMM dd, yyyy') : 'N/A'}
                    </span>
                    
                    {caseItem.assignedJudge && (
                      <span>
                        Judge: {caseItem.assignedJudge.firstName} {caseItem.assignedJudge.lastName}
                      </span>
                    )}
                    
                    {caseItem.nextHearing?.date && (
                      <span>
                        Next Hearing: {format(new Date(caseItem.nextHearing.date), 'MMM dd, yyyy')}
                      </span>
                    )}
                  </div>

                  {/* Show parties info for registrar */}
                  {user?.role === USER_ROLES.REGISTRAR && caseItem.parties && (
                    <div className="mt-3 text-sm text-gray-600">
                      <span className="font-medium">Parties: </span>
                      {caseItem.parties.map((party, index) => (
                        <span key={index}>
                          {party.user?.firstName} {party.user?.lastName} ({party.role})
                          {party.assignedLawyer && ` - Lawyer: ${party.assignedLawyer.firstName} ${party.assignedLawyer.lastName}`}
                          {index < caseItem.parties.length - 1 && ' | '}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="ml-4 flex flex-col items-end space-y-2">
                  {caseItem.priority && caseItem.priority !== 'normal' && (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      caseItem.priority === 'urgent' ? 'bg-red-100 text-red-800' : 
                      caseItem.priority === 'high' ? 'bg-orange-100 text-orange-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {caseItem.priority.toUpperCase()}
                    </span>
                  )}
                  
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CasesPage;
