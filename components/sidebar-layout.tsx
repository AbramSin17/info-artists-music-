"use client"

import type React from "react"
import { useState } from "react"
import { Home, Calendar, StickyNote, Heart, X, Users } from "lucide-react"
import { Tooltip } from "@/components/tooltip"

interface SidebarLayoutProps {
  children: React.ReactNode
}

const navigationItems = [
  {
    id: "artists",
    label: "Artists",
    icon: Home,
    href: "/",
  },
  {
    id: "events",
    label: "Events",
    icon: Calendar,
    href: "/events",
  },
  {
    id: "notes",
    label: "Notes",
    icon: StickyNote,
    href: "/notes",
  },
  {
    id: "likes",
    label: "Likes",
    icon: Heart,
    href: "/likes",
  },
]

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded)
  }

  const expandSidebar = () => {
    setIsExpanded(true)
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div
        className={`
          ${isExpanded ? "w-64" : "w-16"} 
          transition-all duration-300 ease-in-out
          bg-gray-900 border-r border-gray-800
          flex flex-col
          relative
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
          {/* Logo */}
          <button
            onClick={expandSidebar}
            className={`
              flex items-center gap-3 transition-all duration-300
              ${isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}
            `}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-400/25">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              ArtistHub
            </span>
          </button>

          {/* Collapse/Expand Button */}
          <button
            onClick={toggleSidebar}
            className={`
              p-2 rounded-lg transition-all duration-300 hover:bg-gray-800
              ${isExpanded ? "hover:shadow-lg hover:shadow-cyan-400/25" : "mx-auto"}
            `}
          >
            {isExpanded ? (
              <X className="w-5 h-5 text-gray-400 hover:text-cyan-400 transition-colors" />
            ) : (
              <div
                onClick={expandSidebar}
                className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-400/25 cursor-pointer"
              >
                <Users className="w-4 h-4 text-white" />
              </div>
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6">
          <ul className="space-y-2 px-3">
            {navigationItems.map((item) => {
              const IconComponent = item.icon

              return (
                <li key={item.id}>
                  {isExpanded ? (
                    <a
                      href={item.href}
                      className="
                        flex items-center gap-3 px-3 py-3 rounded-lg
                        text-gray-300 hover:text-white hover:bg-gray-800
                        transition-all duration-200
                        hover:shadow-lg hover:shadow-cyan-400/10
                        hover:border-l-2 hover:border-cyan-400
                        group
                      "
                    >
                      <IconComponent className="w-5 h-5 group-hover:text-cyan-400 transition-colors" />
                      <span className="font-medium">{item.label}</span>
                    </a>
                  ) : (
                    <Tooltip content={item.label} side="right">
                      <a
                        href={item.href}
                        className="
                          flex items-center justify-center w-10 h-10 mx-auto rounded-lg
                          text-gray-300 hover:text-white hover:bg-gray-800
                          transition-all duration-200
                          hover:shadow-lg hover:shadow-cyan-400/25
                          hover:scale-110
                          group
                        "
                      >
                        <IconComponent className="w-5 h-5 group-hover:text-cyan-400 transition-colors" />
                      </a>
                    </Tooltip>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          {isExpanded ? (
            <div className="text-xs text-gray-500 text-center">
              <p>© 2024 ArtistHub</p>
              <p className="mt-1">Artist Discovery Platform</p>
            </div>
          ) : (
            <div className="w-8 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mx-auto"></div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 flex items-center px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Artist Discovery
            </h1>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-gray-900">{children}</main>
      </div>
    </div>
  )
}
