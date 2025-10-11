'use client';

import { ReactNode } from 'react';

export interface Tab {
  id: string;
  name: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: ReactNode;
}

export default function Tabs({ tabs, activeTab, onTabChange, children }: TabsProps) {
  return (
    <div className="bg-stripe-surface rounded-lg shadow-stripe-sm border border-stripe-border">
      {/* Tab Navigation */}
      <div className="border-b border-stripe-border">
        <nav className="-mb-px flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-stripe-primary text-stripe-primary'
                  : 'border-transparent text-stripe-text-secondary hover:text-stripe-text hover:border-stripe-border'
              }`}
            >
              {tab.icon && <tab.icon className="w-5 h-5" />}
              <span>{tab.name}</span>
              {tab.count !== undefined && (
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  activeTab === tab.id
                    ? 'bg-stripe-primary text-white'
                    : 'bg-stripe-background text-stripe-text-muted'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

interface TabPanelProps {
  children: ReactNode;
  activeTab: string;
  tabId: string;
}

export function TabPanel({ children, activeTab, tabId }: TabPanelProps) {
  if (activeTab !== tabId) return null;
  return <div className="space-y-6">{children}</div>;
}
