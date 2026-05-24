"use client"

import { Bell, History } from "lucide-react"
import Image from "next/image"

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="flex justify-between items-center px-6 h-16 w-full bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-30">
      <div className="flex items-center gap-6 flex-1">
        <h1 className="text-xl font-semibold text-on-surface">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-surface-container-high rounded-full transition-all active:scale-90 duration-150">
          <Bell className="w-5 h-5 text-on-surface-variant" />
        </button>
        <button className="p-2 hover:bg-surface-container-high rounded-full transition-all active:scale-90 duration-150">
          <History className="w-5 h-5 text-on-surface-variant" />
        </button>
        <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCm8H-GnZE81Qo-Ixgf76kpX1JIFtA3bDvByWZe3kbJsGUeeHTXUhJ4fbcML8Q8H6_V6n9WycCWApLklWGeDv-X6dAVayJcmMXjfzx-4UiuX_dKgn9RqRZfkUpMQQh6UG3Msvshi12VxBJ17VNhHQ1O-Wxu4P6-Ng3CCVM5wC5L-DeUocLJec3v-_uxcPJaNkEmJZ4sGar8bRJLNq1Lrs1HgSEAX-Wjh2JEe24GPY_6i_6YdWGKiGIBBj6AUK5KZsRHhzhNzciElQh"
            alt="User Profile"
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  )
}
