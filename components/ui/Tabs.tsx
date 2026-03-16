'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills';
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onTabChange,
  onChange,
  variant = 'default',
  className,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab || tabs[0]?.id);
  const isControlled = controlledActiveTab !== undefined;
  const activeTab = isControlled ? controlledActiveTab : internalActiveTab;

  const handleTabChange = (tabId: string) => {
    if (!isControlled) setInternalActiveTab(tabId);
    onTabChange?.(tabId);
    onChange?.(tabId);
  };

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className={cn('w-full', className)}>
      {/* Tab Headers */}
      <div
        className={cn(
          'flex gap-1 overflow-x-auto whitespace-nowrap no-scrollbar',
          variant === 'default' && 'border-b border-border-light'
        )}
        role="tablist"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-disabled={tab.disabled}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && handleTabChange(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors focus-ring',
              variant === 'default' && [
                'border-b-2 -mb-px',
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300',
              ],
              variant === 'pills' && [
                'rounded-stripe',
                activeTab === tab.id
                  ? 'bg-primary-500 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100',
              ],
              tab.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4" role="tabpanel">
        {activeTabContent}
      </div>
    </div>
  );
};

Tabs.displayName = 'Tabs';

export default Tabs;
