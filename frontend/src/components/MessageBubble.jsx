import ReactMarkdown from 'react-markdown';
import cpp from 'highlight.js/lib/languages/cpp';
import hljs from 'highlight.js/lib/core';
import remarkGfm from 'remark-gfm';

hljs.registerLanguage('cpp', cpp);

function remarkHtmlBreaks() {
  return (tree) => {
    function replaceBreaks(node) {
      if (!node.children) {
        return;
      }

      node.children = node.children.map((child) => {
        if (child.type === 'html' && /^<br\s*\/?>$/i.test(child.value.trim())) {
          return { type: 'break' };
        }

        replaceBreaks(child);
        return child;
      });
    }

    replaceBreaks(tree);
  };
}

function MarkdownTable({ children }) {
  return (
    <div className="markdown-table-wrapper">
      <table>{children}</table>
    </div>
  );
}

function MarkdownCodeBlock({ children }) {
  const codeElement = Array.isArray(children) ? children[0] : children;
  const languageClass = codeElement?.props?.className || '';
  const language =
    languageClass
      .split(/\s+/)
      .find((className) => className.startsWith('language-'))
      ?.replace('language-', '') || 'code';
  const code = codeElement?.props?.children || '';

  if (language === 'cpp') {
    const highlightedCode = hljs.highlight(code, { language: 'cpp' }).value;

    return (
      <div className="markdown-code-block">
        <div className="markdown-code-header">
          <span aria-hidden="true" className="markdown-code-dot" />
          <span>{language}</span>
        </div>
        <pre>
          <code
            className="hljs language-cpp"
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </pre>
      </div>
    );
  }

  return (
    <div className="markdown-code-block">
      <div className="markdown-code-header">
        <span aria-hidden="true" className="markdown-code-dot" />
        <span>{language}</span>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

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

      <div className={`min-w-0 ${isUser ? 'max-w-[78%]' : 'flex-1'}`}>
        {isUser ? (
          <p className="whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-[#D500D8] px-4 py-3 text-sm leading-6 text-white shadow-sm">
            {message.text}
          </p>
        ) : (
          <div className="markdown-content rounded-2xl rounded-bl-md bg-[#F3F0FF] px-4 py-3 text-sm leading-6 text-[#292344] shadow-sm">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkHtmlBreaks]}
              components={{
                pre: MarkdownCodeBlock,
                table: MarkdownTable,
              }}
            >
              {message.text}
            </ReactMarkdown>
          </div>
        )}
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
