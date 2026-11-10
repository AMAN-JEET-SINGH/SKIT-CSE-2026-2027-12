
"use client";

import React, { useMemo, useState } from "react";

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string;
  unread?: number;
}

interface ChatSessionListProps {
  sessions: ChatSession[];
  activeSessionId?: string;
  onSelect: (session: ChatSession) => void;
  onCreate: () => void;
  onDelete?: (sessionId: string) => void;
}

export default function ChatSessionList({
  sessions,
  activeSessionId,
  onSelect,
  onCreate,
  onDelete,
}: ChatSessionListProps) {
  const [search, setSearch] = useState("");
  const [menuSession, setMenuSession] = useState<string | null>(null);

  const filteredSessions = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return sessions;

    return sessions.filter(
      (session) =>
        session.title.toLowerCase().includes(query) ||
        session.lastMessage.toLowerCase().includes(query)
    );
  }, [sessions, search]);

  const handleDelete = (sessionId: string) => {
    if (!onDelete) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this conversation?"
    );

    if (confirmed) {
      onDelete(sessionId);
      setMenuSession(null);
    }
  };

  return (
    <aside className="flex h-full w-full flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Conversations
          </h2>
          <p className="text-xs text-gray-500">
            Your chat history
          </p>
        </div>

        <button
          onClick={onCreate}
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          + New Chat
        </button>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 dark:border-gray-700 dark:bg-gray-900">
          <span className="text-gray-400">⌕</span>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-transparent py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-sm text-gray-400 hover:text-gray-700"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Session Count */}
      <div className="px-4 pb-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Recent chats ({filteredSessions.length})
        </p>
      </div>

      {/* Conversation List */}
      <div className="flex-1 space-y-1 overflow-y-auto px-2 pb-3">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => {
            const isActive = session.id === activeSessionId;

            return (
              <div
                key={session.id}
                className={`group relative flex items-start gap-3 rounded-xl p-3 transition ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-950/40"
                    : "hover:bg-gray-100 dark:hover:bg-gray-900"
                }`}
              >
                <button
                  onClick={() => onSelect(session)}
                  className="flex min-w-0 flex-1 items-start gap-3 text-left"
                >
                  {/* Avatar */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                    {session.title.charAt(0).toUpperCase()}
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        {session.title}
                      </p>

                      {session.unread ? (
                        <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                          {session.unread}
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-1 truncate text-xs text-gray-500">
                      {session.lastMessage}
                    </p>

                    <p className="mt-1 text-[11px] text-gray-400">
                      {session.updatedAt}
                    </p>
                  </div>
                </button>

                {/* More Options */}
                {onDelete && (
                  <div className="relative">
                    <button
                      onClick={() =>
                        setMenuSession(
                          menuSession === session.id ? null : session.id
                        )
                      }
                      className="rounded-md px-2 py-1 text-gray-400 opacity-100 transition hover:bg-gray-200 hover:text-gray-700 sm:opacity-0 sm:group-hover:opacity-100 dark:hover:bg-gray-700"
                      aria-label="Conversation options"
                    >
                      ⋯
                    </button>

                    {menuSession === session.id && (
                      <div className="absolute right-0 top-8 z-20 w-32 rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                        <button
                          onClick={() => handleDelete(session.id)}
                          className="w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          Delete chat
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl dark:bg-gray-800">
              💬
            </div>

            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              No conversations found
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Try another search or start a new chat.
            </p>

            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-3 text-xs font-medium text-blue-600 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-3 dark:border-gray-800">
        <p className="text-center text-xs text-gray-400">
          SentiCare · Your wellness conversations
        </p>
      </div>
    </aside>
  );
}
