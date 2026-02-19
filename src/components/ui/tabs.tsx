'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

// If radix-ui/react-tabs is not installed, we might need to install it or use a custom content.
// Checking if I can simple export a custom one without radix for now to be safe, 
// but the user likely has radix if this is a shadcn setup.
// Let's assume standard shadcn for now, but if it fails I'll revert to simple state.
// Actually, to be safe and avoid "module not found" for radix, I will implement a custom simple one.

import { createContext, useContext, useState } from 'react'

type TabsContextType = {
    activeTab: string
    setActiveTab: (value: string) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

export function Tabs({ defaultValue, className, onValueChange, children }: { defaultValue: string, className?: string, onValueChange?: (val: string) => void, children: React.ReactNode }) {
    const [activeTab, setActiveTab] = useState(defaultValue)

    const handleTabChange = (value: string) => {
        setActiveTab(value)
        onValueChange?.(value)
    }

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
            <div className={className}>{children}</div>
        </TabsContext.Provider>
    )
}

export function TabsList({ className, children }: { className?: string, children: React.ReactNode }) {
    return <div className={className}>{children}</div>
}

export function TabsTrigger({ value, className, children }: { value: string, className?: string, children: React.ReactNode }) {
    const context = useContext(TabsContext)
    if (!context) throw new Error('TabsTrigger must be used within Tabs')

    const isActive = context.activeTab === value

    return (
        <button
            className={cn(
                className,
                isActive ? "data-[state=active]" : ""
            )}
            onClick={() => context.setActiveTab(value)}
            data-state={isActive ? 'active' : 'inactive'}
        >
            {children}
        </button>
    )
}

export function TabsContent({ value, className, children }: { value: string, className?: string, children: React.ReactNode }) {
    const context = useContext(TabsContext)
    if (!context) throw new Error('TabsContent must be used within Tabs')

    if (context.activeTab !== value) return null

    return <div className={className}>{children}</div>
}
