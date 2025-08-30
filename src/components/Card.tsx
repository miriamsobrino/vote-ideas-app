import { ThumbsUp, Trash2 } from "lucide-react";
import { Button } from "./Button";
import { useState } from "react";
import type { Idea } from "../types/types";

interface CardProps extends Idea {
  onVote: () => void;
  isMobile: boolean;
  isUserIdea: boolean;
  deleteIdea: (id: string) => void;
  currentUserId: string;
}

export const Card = ({
  id,
  title,
  votes,
  voters = [],
  author,
  currentUserId,
  onVote,
  isMobile,
  isUserIdea,
  deleteIdea,
}: CardProps) => {
  const [translateX, setTranslateX] = useState(0);
  const [startX, setStartX] = useState<number | null>(null);

  const hasVoted = voters ? voters.includes(currentUserId) : false;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || startX === null || !isUserIdea) return;
    const delta = e.touches[0].clientX - startX;

    if (delta < -100) setTranslateX(-100);
    else if (delta > 0) setTranslateX(0);
    else setTranslateX(delta);
  };

  const handleTouchEnd = () => {
    if (!isMobile) return;
    if (translateX > -50) setTranslateX(0);
    else setTranslateX(-100);
    setStartX(null);
  };

  const handleVote = () => {
    if (hasVoted) return;
    onVote();
  };

  return (
    <div className="relative w-full items-center flex">
      {isUserIdea && isMobile && (
        <Button
          className="absolute right-0 top-0 h-full bg-red-500/60 text-white"
          onClick={() => deleteIdea(id)}
        >
          <Trash2 size={18} />
        </Button>
      )}

      <article
        className="w-full bg-gradient-to-r from-indigo-50 via-slate-50 to-indigo-50 p-4 backdrop-blur-3xl rounded-lg border border-indigo-100 flex justify-between items-center transition-transform duration-300 ease-in-out"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${translateX}px)`,
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
      {isUserIdea && !isMobile && (
        <Button
          className="text-red-500 p-2 flex items-center !w-12 !h-12 justify-center rounded absolute -right-16 hover:bg-red-500/60 transition-all duration-300  hover:text-white !rotate-0"
          onClick={() => deleteIdea(id)}
        >
          <Trash2 size={18} />
        </Button>
      )}
    </div>
  );
};
