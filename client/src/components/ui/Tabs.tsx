import { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface TabItem {
  id: string
  label: string
  content: ReactNode
}

interface TabsProps {
  tabs: TabItem[]
  defaultTab?: string
  onChange?: (tabId: string) => void
}

export default function Tabs({ tabs, defaultTab, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(
    defaultTab || tabs[0]?.id || ''
  )

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onChange?.(tabId)
  }

  return (
    <div className="w-full">
      {/* Tab List */}
      <div className="flex border-b border-primary-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              'px-4 py-3 text-sm font-medium transition-colors border-b-2',
              activeTab === tab.id
                ? 'text-accent-500 border-accent-500'
                : 'text-gray-400 border-transparent hover:text-gray-200'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="py-4">
        {tabs.find((t) => t.id === activeTab)?.content}
      </div>
    </div>
  )
}

// Need React import for useState
import React from 'react'
