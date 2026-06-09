import { useState, type ReactNode } from 'react'
import { AdalatBackdrop } from './AdalatBackdrop'
import { ChatSidebar } from './ChatSidebar'
import { Logo } from './Logo'
import type { SavedChat } from '../types/chat'

interface AppShellProps {
  children: ReactNode
  chats: SavedChat[]
  activeChatId: string | null
  onSelectChat: (chatId: string) => void
  onDeleteChat: (chatId: string) => void
  onNewChat: () => void
  showSidebar: boolean
  showAppHeader?: boolean
  headerAction?: ReactNode
  footer?: ReactNode
}

export function AppShell({
  children,
  chats,
  activeChatId,
  onSelectChat,
  onDeleteChat,
  onNewChat,
  showSidebar,
  showAppHeader = true,
  headerAction,
  footer,
}: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="app-shell legal-pattern">
      <AdalatBackdrop />

      <div className="app-shell-body">
        {showSidebar && (
          <ChatSidebar
            chats={chats}
            activeChatId={activeChatId}
            onSelect={onSelectChat}
            onDelete={onDeleteChat}
            onNewChat={onNewChat}
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed((v) => !v)}
          />
        )}

        <div className="app-shell-main">
          {showAppHeader && (
            <header className="app-header legal-chrome">
              <Logo size="sm" showTagline={false} />
              <div className="app-header-actions">{headerAction}</div>
            </header>
          )}

          <div className="app-shell-content">{children}</div>

          {footer && <footer className="app-footer legal-chrome">{footer}</footer>}
        </div>
      </div>
    </div>
  )
}
