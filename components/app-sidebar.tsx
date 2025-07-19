"use client"

import { Home, Calendar, Music, StickyNote, ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Events",
    url: "/events",
    icon: Calendar,
  },
  {
    title: "My Playlists",
    url: "/playlists",
    icon: Music,
  },
  {
    title: "Notes",
    url: "/notes",
    icon: StickyNote,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-gray-800 bg-gray-900/95 backdrop-blur-sm">
      <SidebarHeader className="border-b border-gray-800 p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg neon-gradient flex items-center justify-center">
            <Music className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg glow-text">NeonBeats</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="hover:bg-gray-800/50 hover:glow-border transition-all duration-300"
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                      {pathname === item.url && <ChevronRight className="w-4 h-4 ml-auto text-cyan-400" />}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
