function ChatInput({ value, onChange, onSubmit, disabled }) {
  return (
    <form onSubmit={onSubmit} className="flex items-center gap-3">
      <label className="sr-only" htmlFor="chat-message">
        Your message
      </label>
      <input
        id="chat-message"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Ask a research question..."
        disabled={disabled}
        className="h-12 min-w-0 flex-1 rounded-full border border-slate-200 bg-white px-5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#7B61FF] focus:ring-4 focus:ring-[#7B61FF]/10 disabled:bg-slate-50"
      />
      <button
        type="submit"
        aria-label="Send message"
        disabled={disabled || !value.trim()}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#3D3AEF] text-white transition hover:bg-[#302ddb] focus:outline-none focus:ring-4 focus:ring-[#3D3AEF]/20 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5"
        >
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  );
}

export default ChatInput;
