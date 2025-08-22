import { createContext, useContext, useState } from "react";
import type { Idea } from "../types/types";
/* eslint-disable react-refresh/only-export-components */

interface IdeasContextType {
  ideas: Idea[];
  addIdea: (title: string) => void;
  voteIdea: (id: string) => void;
}

const IdeasContext = createContext<IdeasContextType | undefined>(undefined);

export const IdeasProvider = ({ children }: { children: React.ReactNode }) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);

  const addIdea = (title: string) => {
    if (!title.trim()) return;
    const newIdea: Idea = { id: crypto.randomUUID(), title, votes: 0 };
    setIdeas((prev) => [newIdea, ...prev]);
  };

  const voteIdea = (id: string) => {
    setIdeas((prev) =>
      prev.map((idea) =>
        idea.id === id ? { ...idea, votes: idea.votes + 1 } : idea
      )
    );
  };
  return (
    <IdeasContext.Provider value={{ ideas, addIdea, voteIdea }}>
      {children}
    </IdeasContext.Provider>
  );
};

export const useIdeas = () => {
  const context = useContext(IdeasContext);
  if (!context) throw new Error("useIdeas must be used within IdeasProvider");
  return context;
};
