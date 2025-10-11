'use client';

import { useState } from 'react';
import { 
  UserCircleIcon,
  BanknotesIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { CustomerActivity } from '@/types/customer';

interface TimelineItemProps {
  activity: CustomerActivity;
  className?: string;
}

export default function TimelineItem({ activity, className = '' }: TimelineItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'Account':
        return <UserCircleIcon className="w-5 h-5 text-blue-600" />;
      case 'Loan':
        return <BanknotesIcon className="w-5 h-5 text-green-600" />;
      case 'Deposit':
        return <CurrencyDollarIcon className="w-5 h-5 text-yellow-600" />;
      case 'Communication':
        return <PhoneIcon className="w-5 h-5 text-purple-600" />;
      case 'Team':
        return <ChatBubbleLeftRightIcon className="w-5 h-5 text-indigo-600" />;
      case 'Request':
        return <DocumentTextIcon className="w-5 h-5 text-orange-600" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActivityColor = (activityType: string) => {
    switch (activityType) {
      case 'Account':
        return 'bg-blue-50 border-blue-200';
      case 'Loan':
        return 'bg-green-50 border-green-200';
      case 'Deposit':
        return 'bg-yellow-50 border-yellow-200';
      case 'Communication':
        return 'bg-purple-50 border-purple-200';
      case 'Team':
        return 'bg-indigo-50 border-indigo-200';
      case 'Request':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const formatFullDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMetadataDisplay = () => {
    if (!activity.metadata) return null;

    const metadata = activity.metadata;
    const items = [];

    if (metadata.amount) {
      items.push(`Amount: ₹${metadata.amount.toLocaleString()}`);
    }
    if (metadata.referenceNumber) {
      items.push(`Ref: ${metadata.referenceNumber}`);
    }
    if (metadata.channel) {
      items.push(`Channel: ${metadata.channel}`);
    }
    if (metadata.duration) {
      items.push(`Duration: ${metadata.duration} min`);
    }
    if (metadata.status) {
      items.push(`Status: ${metadata.status}`);
    }

    return items.length > 0 ? items.join(' • ') : null;
  };

  const metadataDisplay = getMetadataDisplay();

  return (
    <div className={`relative ${className}`}>
      {/* Timeline line */}
      <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-stripe-border"></div>
      
      {/* Activity item */}
      <div className={`relative flex items-start p-4 rounded-lg border ${getActivityColor(activity.activityType)}`}>
        {/* Icon */}
        <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full border-2 border-white shadow-sm flex items-center justify-center">
          {getActivityIcon(activity.activityType)}
        </div>

        {/* Content */}
        <div className="ml-4 flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h3 className="text-sm font-medium text-stripe-text">{activity.title}</h3>
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white text-stripe-text-secondary">
                {activity.activityType}
              </span>
            </div>
            <div className="flex items-center text-xs text-stripe-text-secondary">
              <ClockIcon className="w-3 h-3 mr-1" />
              <span title={formatFullDate(activity.timestamp)}>
                {formatTimestamp(activity.timestamp)}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="mt-1 text-sm text-stripe-text-secondary">{activity.description}</p>

          {/* Metadata */}
          {metadataDisplay && (
            <div className="mt-2 text-xs text-stripe-text-muted bg-white/50 px-2 py-1 rounded">
              {metadataDisplay}
            </div>
          )}

          {/* Performed by */}
          <div className="mt-2 flex items-center text-xs text-stripe-text-muted">
            <UserCircleIcon className="w-3 h-3 mr-1" />
            <span>Performed by: {activity.performedBy}</span>
          </div>

          {/* Expandable details */}
          {activity.isExpandable && activity.expandedDetails && (
            <div className="mt-3">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center text-xs text-stripe-primary hover:text-stripe-primary-dark font-medium"
              >
                {isExpanded ? (
                  <ChevronDownIcon className="w-3 h-3 mr-1" />
                ) : (
                  <ChevronRightIcon className="w-3 h-3 mr-1" />
                )}
                {isExpanded ? 'Hide Details' : 'View Details'}
              </button>

              {isExpanded && (
                <div className="mt-2 p-3 bg-white/70 rounded border text-xs text-stripe-text">
                  {activity.expandedDetails}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
