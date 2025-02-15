import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Mail, Lock, Building2, Phone, MapPin, Factory, Receipt } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/axios';

interface RegisterFormData {
  company_name: string;
  company_email: string;
  password: string;
  confirm_password: string;
  gst_number: string;
  phone_no: string;
  location: string;
  industry_type: string;
}

const RegisterForm = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    company_name: '',
    company_email: '',
    password: '',
    confirm_password: '',
    gst_number: '',
    phone_no: '',
    location: '',
    industry_type: ''
  });

  const registerMutation = useMutation({
    mutationFn: async (data: Omit<RegisterFormData, 'confirm_password'>) => {
      const response = await api.post('/companies/register', data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Registration successful!');
      // Handle successful registration (e.g., redirect to dashboard)
      console.log('Registration successful:', data);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      toast.error('Passwords do not match!');
      return;
    }

    const { ...registrationData } = formData;
    registerMutation.mutate(registrationData);
  };

  const industries = [
    'Manufacturing',
    'Retail',
    'Technology',
    'Healthcare',
    'Logistics',
    'Agriculture',
    'Construction',
    'Other'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
          Company Name
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Building2 className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="company_name"
            id="company_name"
            value={formData.company_name}
            onChange={handleChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter company name"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="company_email" className="block text-sm font-medium text-gray-700">
          Company Email
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            name="company_email"
            id="company_email"
            value={formData.company_email}
            onChange={handleChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter company email"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter password"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="password"
            name="confirm_password"
            id="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Confirm password"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="gst_number" className="block text-sm font-medium text-gray-700">
          GST Number
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Receipt className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="gst_number"
            id="gst_number"
            value={formData.gst_number}
            onChange={handleChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter GST number"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone_no" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="tel"
            name="phone_no"
            id="phone_no"
            value={formData.phone_no}
            onChange={handleChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter phone number"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="location"
            id="location"
            value={formData.location}
            onChange={handleChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter location"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="industry_type" className="block text-sm font-medium text-gray-700">
          Industry Type
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Factory className="h-5 w-5 text-gray-400" />
          </div>
          <select
            name="industry_type"
            id="industry_type"
            value={formData.industry_type}
            onChange={handleChange}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select industry type</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={registerMutation.isPending}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {registerMutation.isPending ? 'Registering...' : 'Register Company'}
      </button>
    </form>
  );
};

export default RegisterForm;