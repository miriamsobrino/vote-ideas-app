import { ThumbsUp } from "lucide-react";
import { Button } from "./Button";
import { useState } from "react";
import type { Idea } from "../types/types";
interface CardProps extends Idea {
  onVote: () => void;
}

export const Card = ({ title, votes, onVote }: CardProps) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleVote = () => {
    if (hasVoted) return;
    onVote();
    setHasVoted(true);
  };
  return (
    <article className=" bg-gradient-to-r  from-indigo-50 via-slate-50 to-indigo-50  p-4 backdrop-blur-3xl rounded-lg border-1 border-indigo-100 flex justify-between items-center">
      <div className="flex flex-col  ">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-400">
          Sugerido por <span>@miri.code</span>
        </p>
      </div>
      <div className="flex gap-6  ">
        <p className="text-center flex flex-col text-sm ">
          <span className="text-2xl -mb-2 font-semibold">{votes}</span>
          votos
        </p>
        <div
          className="relative flex items-center"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <Button onClick={handleVote} disabled={hasVoted}>
            <ThumbsUp
              size={16}
              className={`transition-all duration-300 ${
                hasVoted
                  ? "opacity-20 cursor-default group-hover:rotate-0"
                  : "group-hover:-rotate-3"
              }`}
            />
            {hasVoted ? "Votado" : "Votar"}
          </Button>
          {hasVoted && isHovering && (
            <div className="bg-slate-50/70 text-center w-36 rounded-md -top-8 left-10 border-1 border-indigo-200  px-3 py-1 absolute z-50 ">
              <p>¡Ya has votado!</p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
