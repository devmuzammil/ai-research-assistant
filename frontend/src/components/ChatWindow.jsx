import { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { sendChatMessage } from '../services/chatApi';
import { chatState } from '../state/chatState';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';

function createMessageId() {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function ChatWindow() {
  const [chat, setChat] = useRecoilState(chatState);
  const [draft, setDraft] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages, chat.isLoading]);

  async function handleSubmit(event) {
    event.preventDefault();
    const message = draft.trim();

    if (!message || chat.isLoading) {
      return;
    }

    const userMessage = {
      id: createMessageId(),
      role: 'user',
      text: message,
    };

    setChat((currentChat) => ({
      ...currentChat,
      messages: [...currentChat.messages, userMessage],
      isLoading: true,
      error: '',
    }));
    setDraft('');

    try {
      const answer = await sendChatMessage(message, chat.threadId);
      setChat((currentChat) => ({
        ...currentChat,
        messages: [
          ...currentChat.messages,
          {
            id: createMessageId(),
            role: 'assistant',
            text: answer,
          },
        ],
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while sending your message.';

      setChat((currentChat) => ({
        ...currentChat,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }

  return (
    <section
      aria-label="AI Research Assistant chat"
      className="flex h-[min(517px,calc(100vh-2rem))] w-full max-w-[572px] flex-col overflow-hidden rounded-[26px] border border-white/70 bg-white shadow-[0_18px_55px_rgba(34,28,92,0.14)]"
    >
      <header className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#7B61FF] text-white shadow-sm">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-6 w-6"
          >
            <path
              d="M12 3.5 13.8 9l5.5 1.8-5.5 1.8-1.8 5.5-1.8-5.5-5.5-1.8L10.2 9 12 3.5Z"
              fill="currentColor"
            />
            <path
              d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z"
              fill="currentColor"
              opacity=".8"
            />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-bold text-slate-900">
            AI Research Assistant
          </h1>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Ready to explore with you
          </p>
        </div>
      </header>

      <div
        aria-live="polite"
        className="flex-1 space-y-5 overflow-y-auto px-5 py-5"
      >
        {chat.messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {chat.isLoading && (
          <div className="flex items-end gap-3">
            <div
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7B61FF] text-xs font-bold text-white"
            >
              AI
            </div>
            <p className="rounded-2xl rounded-bl-md bg-[#F3F0FF] px-4 py-3 text-sm text-[#292344]">
              Thinking...
            </p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {chat.error && (
        <p
          role="alert"
          className="mx-5 mb-3 rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-700"
        >
          {chat.error}
        </p>
      )}

      <div className="border-t border-slate-100 p-4">
        <ChatInput
          value={draft}
          onChange={setDraft}
          onSubmit={handleSubmit}
          disabled={chat.isLoading}
        />
      </div>
    </section>
  );
}

export default ChatWindow;
