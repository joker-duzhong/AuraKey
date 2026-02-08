import { create } from 'zustand';

interface PromptStore {
  prompt: string;
  setPrompt: (prompt: string) => void;
  appendPrompt: (tag: string) => void;
}

export const usePromptStore = create<PromptStore>((set) => ({
  prompt: '',
  setPrompt: (prompt) => set({ prompt }),
  appendPrompt: (tag) => set((state) => {
    const currentPrompt = state.prompt.trim();
    if (!currentPrompt) return { prompt: tag };
    // Simple check to avoid duplicate tags if they are exact matches
    const tags = currentPrompt.split(',').map(t => t.trim());
    if (tags.includes(tag)) return { prompt: currentPrompt };
    return { prompt: `${currentPrompt}, ${tag}` };
  }),
}));
