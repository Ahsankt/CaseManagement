import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { caseAPI } from '../../services/api';
import { FileText, Clock, CheckCircle, AlertCircle, Users, Calendar } from 'lucide-react';
import LoadingSpinner from '../Common/LoadingSpinner';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '../../utils/constants';
import { format } from 'date-fns';

const LawyerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentCases, setRecentCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, casesResponse] = await Promise.all([
        caseAPI.getDashboardStats(),
        caseAPI.getCases({ page: 1, limit: 5, sortBy: 'createdAt', sortOrder: 'desc' })
      ]);
      
      setStats(statsResponse.data.stats);
      setRecentCases(casesResponse.data.cases);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  const statCards = [
    {
      name: 'Total Cases',
      value: stats?.total || 0,
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      name: 'Pending Cases',
      value: stats?.pending || 0,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      name: 'In Progress',
      value: stats?.inProgress || 0,
      icon: AlertCircle,
      color: 'bg-orange-500',
    },
    {
      name: 'Closed Cases',
      value: stats?.closed || 0,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
  ];

  const getStatusBadge = (status) => {
    const statusConfig = STATUS_OPTIONS.find(s => s.value === status);
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig?.color || 'text-gray-600 bg-gray-100'}`}>
        {statusConfig?.label || status}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = PRIORITY_OPTIONS.find(p => p.value === priority);
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig?.color || 'text-gray-600 bg-gray-100'}`}>
        {priorityConfig?.label || priority}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lawyer Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage your cases and client communications
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                to="/clients"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Users className="h-4 w-4 mr-2" />
                Clients
              </Link>
              <Link
                to="/calendar"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Calendar
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 ${stat.color} rounded-md flex items-center justify-center`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Cases */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Cases
            </h3>
            <Link
              to="/cases"
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              View all cases
            </Link>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {recentCases.length > 0 ? (
            recentCases.map((caseItem) => (
              <div key={caseItem._id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/cases/${caseItem._id}`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500 truncate"
                    >
                      {caseItem.title}
                    </Link>
                    <p className="mt-1 text-sm text-gray-500">
                      Case #{caseItem.caseNumber}
                    </p>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span>Filed: {caseItem.registrationDate ? format(new Date(caseItem.registrationDate), 'MMM dd, yyyy') : 'N/A'}</span>
                      {caseItem.client && (
                        <span>
                          Client: {caseItem.client.firstName} {caseItem.client.lastName}
                        </span>
                      )}
                      {caseItem.nextHearing?.date && (
                        <span>
                          Hearing: {format(new Date(caseItem.nextHearing.date), 'MMM dd, yyyy')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {getStatusBadge(caseItem.status)}
                    {getPriorityBadge(caseItem.priority)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No cases assigned</h3>
              <p className="mt-1 text-sm text-gray-500">
                Cases will appear here when they are assigned to you.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Quick Actions
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/cases/all"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <FileText className="h-8 w-8 text-indigo-600 mb-2" />
              <h4 className="text-sm font-medium text-gray-900">View All Cases</h4>
              <p className="text-sm text-gray-500">Access all your assigned cases</p>
            </Link>
            <Link
              to="/clients"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <Users className="h-8 w-8 text-green-600 mb-2" />
              <h4 className="text-sm font-medium text-gray-900">Manage Clients</h4>
              <p className="text-sm text-gray-500">View and communicate with clients</p>
            </Link>
            <Link
              to="/calendar"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <Calendar className="h-8 w-8 text-blue-600 mb-2" />
              <h4 className="text-sm font-medium text-gray-900">Schedule</h4>
              <p className="text-sm text-gray-500">Manage hearings and appointments</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerDashboard;
