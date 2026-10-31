import { atom } from 'recoil';

export const chatState = atom({
  key: 'chatState',
  default: {
    threadId: `research-${Date.now()}`,
    messages: [
      {
        id: 'welcome',
        role: 'assistant',
        text: 'Hello! I’m your AI Research Assistant. What would you like to explore?',
      },
    ],
    isLoading: false,
    error: '',
  },
});
