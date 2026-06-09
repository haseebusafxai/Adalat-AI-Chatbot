import type { SavedChat } from '../types/chat'

interface ChatSidebarProps {
  chats: SavedChat[]
  activeChatId: string | null
  onSelect: (chatId: string) => void
  onDelete: (chatId: string) => void
  onNewChat: () => void
  collapsed?: boolean
  onToggle?: () => void
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(timestamp).toLocaleDateString()
}

export function ChatSidebar({
  chats,
  activeChatId,
  onSelect,
  onDelete,
  onNewChat,
  collapsed,
  onToggle,
}: ChatSidebarProps) {
  return (
    <aside
      className={`chat-sidebar ${collapsed ? 'chat-sidebar--collapsed' : ''}`}
      aria-label="Recent chats"
    >
      <div className="chat-sidebar-head">
        <h2 className="chat-sidebar-title">Recent chats</h2>
        {onToggle && (
          <button
            type="button"
            className="chat-sidebar-toggle"
            onClick={onToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? '→' : '←'}
          </button>
        )}
      </div>

      <button type="button" className="chat-sidebar-new" onClick={onNewChat}>
        <span aria-hidden>+</span> New conversation
      </button>

      <ul className="chat-sidebar-list">
        {chats.length === 0 && (
          <li className="chat-sidebar-empty">
            No saved chats yet. Your history is stored on this device only.
          </li>
        )}
        {chats.map((chat) => {
          const isActive = chat.id === activeChatId
          return (
            <li key={chat.id} className="chat-sidebar-item">
              <button
                type="button"
                className={`chat-sidebar-link ${isActive ? 'chat-sidebar-link--active' : ''}`}
                onClick={() => onSelect(chat.id)}
              >
                <span className="chat-sidebar-link-title">{chat.title}</span>
                <span className="chat-sidebar-link-time">
                  {formatRelativeTime(chat.updatedAt)}
                </span>
              </button>
              <button
                type="button"
                className="chat-sidebar-delete"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(chat.id)
                }}
                aria-label={`Delete chat: ${chat.title}`}
                title="Delete chat"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path d="M3 6h18M8 6V4h8v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
                  <path d="M10 11v6M14 11v6" />
                </svg>
              </button>
            </li>
          )
        })}
      </ul>

      <p className="chat-sidebar-note">Stored locally in your browser — no database.</p>
    </aside>
  )
}
