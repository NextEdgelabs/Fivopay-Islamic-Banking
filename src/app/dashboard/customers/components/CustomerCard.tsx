'use client';

import React from 'react';
import { Customer } from '@/app/context/AppContext';

interface CustomerCardProps {
  customer: Customer;
  isSelected?: boolean;
  onSelect?: (customer: Customer) => void;
  onEdit?: (customer: Customer) => void;
  onView?: (customer: Customer) => void;
  showActions?: boolean;
  compact?: boolean;
}

export default function CustomerCard({ 
  customer, 
  isSelected = false, 
  onSelect, 
  onEdit, 
  onView,
  showActions = true,
  compact = false
}: CustomerCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'dormant': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'savings': return '💰';
      case 'current': return '🏛️';
      case 'investment': return '📈';
      case 'business': return '🏢';
      default: return '👤';
    }
  };

  return (
    <div className={`
      bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200
      ${isSelected ? 'ring-2 ring-blue-500 border-blue-300' : ''}
      ${compact ? 'p-3' : 'p-4'}
    `}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {onSelect && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelect(customer)}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          )}
          
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg">
              {getAccountTypeIcon(customer.accountType)}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {customer.name}
              </h3>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                {customer.status}
              </span>
            </div>
            
            <p className="text-sm text-gray-500 mb-1">
              ID: {customer.id} • {customer.accountType.charAt(0).toUpperCase() + customer.accountType.slice(1)}
            </p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>📧 {customer.email}</span>
              {!compact && customer.phone && (
                <span>📱 {customer.phone}</span>
              )}
            </div>
            
            {!compact && (
              <div className="mt-2 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Balance:</span>
                  <span className="ml-1 text-green-600 font-semibold">
                    {customer.accountBalance}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Joined: {new Date(customer.joinDate).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {showActions && (
          <div className="flex items-center space-x-2 ml-3">
            {onView && (
              <button
                onClick={() => onView(customer)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="View Details"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            )}
            
            {onEdit && (
              <button
                onClick={() => onEdit(customer)}
                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Edit Customer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            
            <div className="relative">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {compact && customer.accountBalance && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Balance:</span>
            <span className="text-sm font-semibold text-green-600">
              {customer.accountBalance}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}