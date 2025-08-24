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
  const [startX, setStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX === null) return;
    const delta = e.touches[0].clientX - startX;

    if (!isUserIdea) return;

    if (delta < -100) setTranslateX(-100);
    else if (delta > 0) setTranslateX(0);
    else setTranslateX(delta);
  };

  const handleTouchEnd = () => {
    if (translateX > -50) setTranslateX(0);
    else setTranslateX(-100);
    setStartX(null);
  };

  const handleVote = () => {
    if (hasVoted) return;
    onVote();
  };

  return (
    <div className="relative w-full overflow-hidden">
      {isUserIdea && (
        <Button
          className="absolute right-0 top-0 h-full bg-red-500/60 text-white "
          onClick={() => deleteIdea(id)}
        >
          <Trash2 size={18} />
        </Button>
      )}

      <article
        className="w-full bg-gradient-to-r  from-indigo-50 via-slate-50 to-indigo-50 p-4 backdrop-blur-3xl rounded-lg border border-indigo-100 flex justify-between items-center transition-transform duration-300 ease-in-out"
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
    </div>
  );
};
