'use client';

import { useSettings } from '../context/SettingsContext';
import { 
  BellIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

export default function NotificationSettings() {
  const { state, updateNotifications } = useSettings();
  const settings = state.settings;

  const handleToggle = (key: string, value: boolean) => {
    updateNotifications({ [key]: value });
  };

  const notificationOptions = [
    {
      key: 'email' as const,
      icon: EnvelopeIcon,
      title: 'Email Notifications',
      description: 'Receive notifications via email',
      enabled: settings?.notifications.email || false
    },
    {
      key: 'push' as const,
      icon: BellIcon,
      title: 'Push Notifications',
      description: 'Browser and mobile push notifications',
      enabled: settings?.notifications.push || false
    },
    {
      key: 'sms' as const,
      icon: DevicePhoneMobileIcon,
      title: 'SMS Notifications',
      description: 'Text message notifications for critical alerts',
      enabled: settings?.notifications.sms || false
    },
    {
      key: 'transactionAlerts' as const,
      icon: ExclamationTriangleIcon,
      title: 'Transaction Alerts',
      description: 'Notifications for all transaction activities',
      enabled: settings?.notifications.transactionAlerts || false
    },
    {
      key: 'systemUpdates' as const,
      icon: InformationCircleIcon,
      title: 'System Updates',
      description: 'Software updates and maintenance notifications',
      enabled: settings?.notifications.systemUpdates || false
    },
    {
      key: 'marketingEmails' as const,
      icon: ChatBubbleLeftRightIcon,
      title: 'Marketing Communications',
      description: 'Product updates and promotional emails',
      enabled: settings?.notifications.marketingEmails || false
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <BellIcon className="h-6 w-6 text-blue-600" />
          <span>Notification Settings</span>
        </h2>
        <p className="text-gray-600 mt-2">
          Control how and when you receive notifications
        </p>
      </div>

      <div className="space-y-4">
        {notificationOptions.map((option) => {
          const Icon = option.icon;
          return (
            <div
              key={option.key}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-start space-x-3">
                <Icon className="h-6 w-6 text-gray-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900">{option.title}</h3>
                  <p className="text-sm text-gray-500">{option.description}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={option.enabled}
                  onChange={(e) => handleToggle(option.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}