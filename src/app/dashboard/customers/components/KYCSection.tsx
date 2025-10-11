'use client';

import { useState } from 'react';
import { 
  ShieldCheckIcon, 
  DocumentTextIcon, 
  PhotoIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  ClockIcon,
  EyeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { CustomerKYCDetailed } from '@/types/customer';

interface KYCSectionProps {
  kycDetails: CustomerKYCDetailed | null;
  onVerify?: (field: string) => void;
  onReject?: (field: string, reason: string) => void;
  className?: string;
}

export default function KYCSection({ kycDetails, onVerify, onReject, className = '' }: KYCSectionProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  if (!kycDetails) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <ShieldCheckIcon className="w-12 h-12 text-stripe-text-muted mx-auto mb-4" />
        <h3 className="text-lg font-medium text-stripe-text mb-2">KYC Details Not Available</h3>
        <p className="text-stripe-text-secondary">KYC information is not available for this customer.</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Verified
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XMarkIcon className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <ClockIcon className="w-3 h-3 mr-1" />
            Unknown
          </span>
        );
    }
  };

  const maskAadhaar = (aadhaar: string) => {
    return aadhaar.replace(/(\d{4})\d{4}(\d{4})/, '$1-XXXX-$2');
  };

  const maskPAN = (pan: string) => {
    return pan.replace(/(\w{5})\w{4}(\w)/, '$1XXXX$2');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Aadhaar KYC Section */}
      <div className="card">
        <div className="card-content">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg mr-3">
                <DocumentTextIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-stripe-text">Aadhaar KYC</h3>
                <p className="text-sm text-stripe-text-secondary">Identity verification through Aadhaar</p>
              </div>
            </div>
            {getStatusBadge(kycDetails.aadhaarVerified ? 'Verified' : 'Pending')}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-stripe-text-secondary">Aadhaar Number</label>
              <p className="text-sm text-stripe-text font-mono">
                {kycDetails.aadhaarNumber ? maskAadhaar(kycDetails.aadhaarNumber) : 'Not provided'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-stripe-text-secondary">Verification Date</label>
              <p className="text-sm text-stripe-text">
                {kycDetails.aadhaarVerificationDate 
                  ? new Date(kycDetails.aadhaarVerificationDate).toLocaleDateString()
                  : 'Not verified'
                }
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-stripe-text-secondary">eKYC Status</label>
              <p className="text-sm text-stripe-text">
                {kycDetails.aadhaarEkycStatus || 'Not completed'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-stripe-text-secondary">Verified By</label>
              <p className="text-sm text-stripe-text">
                {kycDetails.verifiedBy || 'Not verified'}
              </p>
            </div>
          </div>

          {kycDetails.aadhaarDocumentUrl && (
            <div className="mt-4 pt-4 border-t border-stripe-border">
              <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-stripe-primary hover:text-stripe-primary-dark">
                <EyeIcon className="w-4 h-4 mr-2" />
                View Aadhaar Document
              </button>
            </div>
          )}

          {!kycDetails.aadhaarVerified && onVerify && (
            <div className="mt-4 pt-4 border-t border-stripe-border flex gap-2">
              <button
                onClick={() => onVerify('aadhaar')}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
              >
                Verify Aadhaar
              </button>
              <button
                onClick={() => onReject && onReject('aadhaar', rejectReason)}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PAN KYC Section */}
      <div className="card">
        <div className="card-content">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg mr-3">
                <DocumentTextIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-stripe-text">PAN KYC</h3>
                <p className="text-sm text-stripe-text-secondary">Tax identification verification</p>
              </div>
            </div>
            {getStatusBadge(kycDetails.panVerified ? 'Verified' : 'Pending')}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-stripe-text-secondary">PAN Number</label>
              <p className="text-sm text-stripe-text font-mono">
                {kycDetails.panNumber ? maskPAN(kycDetails.panNumber) : 'Not provided'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-stripe-text-secondary">Verification Date</label>
              <p className="text-sm text-stripe-text">
                {kycDetails.panVerificationDate 
                  ? new Date(kycDetails.panVerificationDate).toLocaleDateString()
                  : 'Not verified'
                }
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-stripe-text-secondary">Name Match</label>
              <p className="text-sm text-stripe-text">
                {kycDetails.panNameMatch === true ? 'Matches' : kycDetails.panNameMatch === false ? 'Does not match' : 'Not checked'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-stripe-text-secondary">Verified By</label>
              <p className="text-sm text-stripe-text">
                {kycDetails.verifiedBy || 'Not verified'}
              </p>
            </div>
          </div>

          {kycDetails.panDocumentUrl && (
            <div className="mt-4 pt-4 border-t border-stripe-border">
              <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-stripe-primary hover:text-stripe-primary-dark">
                <EyeIcon className="w-4 h-4 mr-2" />
                View PAN Document
              </button>
            </div>
          )}

          {!kycDetails.panVerified && onVerify && (
            <div className="mt-4 pt-4 border-t border-stripe-border flex gap-2">
              <button
                onClick={() => onVerify('pan')}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
              >
                Verify PAN
              </button>
              <button
                onClick={() => onReject && onReject('pan', rejectReason)}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Photo KYC Section */}
      <div className="card">
        <div className="card-content">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-50 rounded-lg mr-3">
                <PhotoIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-stripe-text">Photo KYC</h3>
                <p className="text-sm text-stripe-text-secondary">Customer photograph verification</p>
              </div>
            </div>
            {getStatusBadge(kycDetails.videoKycCompleted ? 'Verified' : 'Pending')}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-stripe-text-secondary">Photo Status</label>
              <p className="text-sm text-stripe-text">
                {kycDetails.photoUrl ? 'Uploaded' : 'Not uploaded'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-stripe-text-secondary">Video KYC</label>
              <p className="text-sm text-stripe-text">
                {kycDetails.videoKycCompleted ? 'Completed' : 'Not completed'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-stripe-text-secondary">Video KYC Date</label>
              <p className="text-sm text-stripe-text">
                {kycDetails.videoKycDate 
                  ? new Date(kycDetails.videoKycDate).toLocaleDateString()
                  : 'Not completed'
                }
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-stripe-text-secondary">Agent ID</label>
              <p className="text-sm text-stripe-text">
                {kycDetails.videoKycAgentId || 'Not assigned'}
              </p>
            </div>
          </div>

          {kycDetails.photoUrl && (
            <div className="mt-4 pt-4 border-t border-stripe-border">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                  <PhotoIcon className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-stripe-text">Customer Photo</p>
                  <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-stripe-primary hover:text-stripe-primary-dark">
                    <EyeIcon className="w-4 h-4 mr-2" />
                    View Photo
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Compliance */}
      <div className="card">
        <div className="card-content">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-orange-50 rounded-lg mr-3">
              <ShieldCheckIcon className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-stripe-text">Compliance Status</h3>
              <p className="text-sm text-stripe-text-secondary">Regulatory compliance checks</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-stripe-text-secondary">CKYC Number</label>
              <p className="text-sm text-stripe-text">
                {kycDetails.ckycNumber || 'Not available'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-stripe-text-secondary">CKYC Status</label>
              <p className="text-sm text-stripe-text">
                {kycDetails.ckycVerified ? 'Verified' : 'Not verified'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-stripe-text-secondary">IPV Status</label>
              <p className="text-sm text-stripe-text">
                {kycDetails.ipvCompleted ? 'Completed' : 'Pending'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-stripe-text-secondary">FATCA Applicable</label>
              <p className="text-sm text-stripe-text">
                {kycDetails.fatcaApplicable ? 'Yes' : 'No'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-stripe-text-secondary">CRS Applicable</label>
              <p className="text-sm text-stripe-text">
                {kycDetails.crsApplicable ? 'Yes' : 'No'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-stripe-text-secondary">AML Screening</label>
              <p className="text-sm text-stripe-text">
                {kycDetails.amlScreeningStatus || 'Not completed'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
