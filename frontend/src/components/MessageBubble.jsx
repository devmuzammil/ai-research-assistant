function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const senderName = isUser ? 'You' : 'AI Research Assistant';

  return (
    <div className={`flex items-end gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        aria-hidden="true"
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
          isUser ? 'bg-[#F4A62A]' : 'bg-[#7B61FF]'
        }`}
      >
        {isUser ? 'Y' : 'AI'}
      </div>

      <div className="max-w-[78%]">
        <p
          className={`whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-6 text-white shadow-sm ${
            isUser
              ? 'rounded-br-md bg-[#D500D8]'
              : 'rounded-bl-md bg-[#3D3AEF]'
          }`}
        >
          {message.text}
        </p>
        <p
          className={`mt-1 px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400 ${
            isUser ? 'text-right' : 'text-left'
          }`}
        >
          {senderName}
        </p>
      </div>
    </div>
  );
}

export default MessageBubble;
