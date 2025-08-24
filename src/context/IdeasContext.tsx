import { createContext, useContext, useEffect, useState } from "react";
import type { Idea } from "../types/types";
import { onValue, ref, remove, set, update } from "firebase/database";
import { db } from "../config/firebase";

interface IdeasContextType {
  ideas: Idea[];
  setIdeas: React.Dispatch<React.SetStateAction<Idea[]>>;
  addIdea: (title: string, author: string, authorId: string) => void;
  deleteIdea: (id: string) => void;
  voteIdea: (id: string, userId: string) => void;
}

const IdeasContext = createContext<IdeasContextType | undefined>(undefined);

export const IdeasProvider = ({ children }: { children: React.ReactNode }) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  useEffect(() => {
    const ideasRef = ref(db, "ideas/");
    const unsubscribe = onValue(ideasRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ideasArray = Object.values(data) as Idea[];
        setIdeas(ideasArray.sort((a, b) => b.votes - a.votes));
      } else {
        setIdeas([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const addIdea = (title: string, author: string, authorId: string) => {
    if (!title.trim()) return;

    const newIdea: Idea = {
      id: crypto.randomUUID(),
      title,
      author,
      authorId,
      votes: 0,
      voters: [],
      createdAt: new Date().toISOString(),
    };

    setIdeas((prev) => [newIdea, ...prev]);
    set(ref(db, "ideas/" + newIdea.id), newIdea);
  };
  const deleteIdea = (id: string) => {
    const ideasToDelete = ideas.filter((i) => i.id !== id);
    setIdeas(ideasToDelete);
    const ideaRef = ref(db, "ideas/" + id);
    remove(ideaRef);
  };
  const voteIdea = (id: string, userId: string) => {
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id === id && !idea.voters?.includes(userId)) {
          const updatedIdea = {
            ...idea,
            votes: idea.votes + 1,
            voters: [...(idea.voters || []), userId],
          };

          const ideaRef = ref(db, "ideas/" + id);
          update(ideaRef, {
            votes: updatedIdea.votes,
            voters: updatedIdea.voters,
          });

          return updatedIdea;
        }
        return idea;
      })
    );
  };
  return (
    <IdeasContext.Provider
      value={{ ideas, setIdeas, addIdea, deleteIdea, voteIdea }}
    >
      {children}
    </IdeasContext.Provider>
  );
};

export const useIdeas = () => {
  const context = useContext(IdeasContext);
  if (!context) throw new Error("useIdeas must be used within IdeasProvider");
  return context;
};
