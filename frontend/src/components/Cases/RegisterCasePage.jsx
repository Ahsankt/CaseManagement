import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { USER_ROLES, CASE_TYPES } from '../../utils/constants';

const RegisterCasePage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [judges, setJudges] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  // Only allow registrars to access this page
  if (user?.role !== USER_ROLES.REGISTRAR) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-600">Only registrars can register new cases.</p>
      </div>
    );
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      const allUsers = response.data.users || response.data;
      
      setUsers(allUsers.filter(u => u.role === USER_ROLES.USER));
      setLawyers(allUsers.filter(u => u.role === USER_ROLES.LAWYER));
      setJudges(allUsers.filter(u => u.role === USER_ROLES.JUDGE));
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const caseData = {
        title: data.title,
        description: data.description,
        caseType: data.caseType,
        courtType: data.courtType || 'district_court',
        parties: [
          {
            user: data.petitioner,
            role: 'petitioner',
            assignedLawyer: data.petitionerLawyer || null
          },
          {
            user: data.respondent,
            role: 'respondent',
            assignedLawyer: data.respondentLawyer || null
          }
        ],
        assignedJudge: data.assignedJudge,
        courtNumber: data.courtNumber,
        priority: data.priority || 'normal'
      };

      await api.post('/cases', caseData);
      toast.success('Case registered successfully!');
      reset();
    } catch (error) {
      console.error('Error registering case:', error);
      toast.error(error.response?.data?.message || 'Failed to register case');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Register New Case</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Case Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Case Title *
            </label>
            <input
              {...register('title', { required: 'Case title is required' })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter case title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Case Type *
            </label>
            <select
              {...register('caseType', { required: 'Case type is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select case type</option>
              {CASE_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            {errors.caseType && (
              <p className="mt-1 text-sm text-red-600">{errors.caseType.message}</p>
            )}
          </div>
        </div>

        {/* Case Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Case Description *
          </label>
          <textarea
            {...register('description', { required: 'Case description is required' })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter detailed case description"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Parties */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Petitioner (User) *
            </label>
            <select
              {...register('petitioner', { required: 'Petitioner is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select petitioner</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.firstName} {user.lastName} ({user.email})
                </option>
              ))}
            </select>
            {errors.petitioner && (
              <p className="mt-1 text-sm text-red-600">{errors.petitioner.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Petitioner's Lawyer
            </label>
            <select
              {...register('petitionerLawyer')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select lawyer (optional)</option>
              {lawyers.map(lawyer => (
                <option key={lawyer._id} value={lawyer._id}>
                  {lawyer.firstName} {lawyer.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Respondent (User) *
            </label>
            <select
              {...register('respondent', { required: 'Respondent is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select respondent</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.firstName} {user.lastName} ({user.email})
                </option>
              ))}
            </select>
            {errors.respondent && (
              <p className="mt-1 text-sm text-red-600">{errors.respondent.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Respondent's Lawyer
            </label>
            <select
              {...register('respondentLawyer')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select lawyer (optional)</option>
              {lawyers.map(lawyer => (
                <option key={lawyer._id} value={lawyer._id}>
                  {lawyer.firstName} {lawyer.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Court Assignment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assigned Judge *
            </label>
            <select
              {...register('assignedJudge', { required: 'Judge assignment is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select judge</option>
              {judges.map(judge => (
                <option key={judge._id} value={judge._id}>
                  {judge.firstName} {judge.lastName}
                </option>
              ))}
            </select>
            {errors.assignedJudge && (
              <p className="mt-1 text-sm text-red-600">{errors.assignedJudge.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Court Number
            </label>
            <input
              {...register('courtNumber')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Court Room 101"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register Case'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterCasePage;
