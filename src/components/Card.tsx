import { ThumbsUp, Trash2 } from "lucide-react";
import { Button } from "./Button";
import { useState } from "react";
import type { Idea } from "../types/types";
import { useAuth } from "../context/AuthContext";
import { useIdeas } from "../context/IdeasContext";

interface CardProps extends Idea {
  onVote: () => void;
}

export const Card = ({
  id,
  title,
  votes,
  voters = [],
  author,
  authorId,
  onVote,
}: CardProps) => {
  const { user } = useAuth();
  const { deleteIdea } = useIdeas();
  const isUserIdea = user?.uid === authorId;
  const hasVoted = user ? voters.includes(user.uid) : false;

  const [translateX, setTranslateX] = useState(0);
  const [startX, setStartX] = useState(0);

  const handleVote = () => {
    if (hasVoted) return;
    onVote();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const deltaX = e.touches[0].clientX - startX;
    if (deltaX < 0) setTranslateX(deltaX);
  };

  const handleTouchEnd = () => {
    if (translateX < -50) setTranslateX(-60);
    else setTranslateX(0);
  };

  return (
    <div className="relative w-full overflow-hidden">
      {isUserIdea && (
        <div
          className="absolute right-0 top-0 h-full w-16 flex items-center justify-center text-red-500 cursor-pointer"
          onClick={() => deleteIdea(id)}
        >
          <Trash2 size={18} />
        </div>
      )}

      <article
        className="w-full bg-gradient-to-r from-indigo-50 via-slate-50 to-indigo-50 p-4 backdrop-blur-3xl rounded-lg border border-indigo-100 flex justify-between items-center"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: translateX === 0 ? "transform 0.2s" : "none",
        }}
      >
        <div className="flex flex-col">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-gray-400">
            Sugerida por <span>{isUserIdea ? "ti" : `@${author}`}</span>
          </p>
        </div>
        <div className="flex gap-6">
          <p className="text-center flex flex-col text-sm">
            <span className="text-2xl -mb-2 font-semibold">{votes}</span>
            {votes === 1 ? "voto" : "votos"}
          </p>
          <Button onClick={handleVote} disabled={hasVoted}>
            <ThumbsUp
              size={16}
              className={`transition-all duration-300 ${
                hasVoted ? "opacity-20 cursor-default" : "group-hover:-rotate-3"
              }`}
            />
            {hasVoted ? "Votado" : "Votar"}
          </Button>
        </div>
      </article>
    </div>
  );
};
