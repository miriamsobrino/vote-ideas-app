import { ChevronLeft, ChevronRight, SquarePlay, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./components/Button";
import { Card } from "./components/Card";
import { useIdeas } from "./context/IdeasContext";
import { Header } from "./components/Header";
import { Input } from "./components/Input";
import { Dialog } from "./components/Dialog";
import { onValue, ref } from "firebase/database";
import { db } from "./config/firebase";
import { useAuth } from "./context/AuthContext";
import type { Idea } from "./types/types";
import "./App.css";

function App() {
  const [idea, setIdea] = useState("");
  const { ideas, setIdeas, voteIdea, addIdea } = useIdeas();
  const [_mode, setMode] = useState<"login" | "register">("login");
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ideasPerPage = 5;
  const indexOfLastIdea = currentPage * ideasPerPage;
  const indexOfFirstIdea = indexOfLastIdea - ideasPerPage;
  const currentIdeas = ideas.slice(indexOfFirstIdea, indexOfLastIdea);
  const { user } = useAuth();
  const username = user?.displayName ?? "Anónimo";

  useEffect(() => {
    const ideasRef = ref(db, "ideas/");
    const unsubscribe = onValue(ideasRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ideasArray = Object.values(data) as Idea[];

        setIdeas(
          ideasArray.sort((a, b) => {
            if (a.votes === 0 && b.votes === 0) {
              return Date.parse(b.createdAt) - Date.parse(a.createdAt);
            }

            return b.votes - a.votes;
          })
        );
      } else {
        setIdeas([]);
      }
    });
    return () => unsubscribe();
  }, [setIdeas]);

  const handleAddIdea = async (event: React.FormEvent) => {
    event.preventDefault();

    addIdea(idea, username, user!.uid);

    setIdea("");
  };

  const openDialog = (type: "login" | "register") => {
    setMode(type);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Header openDialog={openDialog} />
      <main className="px-4 lg:px-0 flex flex-col justify-center items-center h-screen gap-8">
        {isOpen && (
          <>
            <div
              onClick={closeDialog}
              className="fixed inset-0 bg-indigo-950/20 backdrop-blur-sm z-10"
            />
            <Dialog closeDialog={closeDialog} />
          </>
        )}
        <div className="flex flex-col gap-2 items-center text-center">
          <SquarePlay size={40} />
          <h1 className=" text-3xl font-semibold  text-center flex items-center">
            ¿Qué quieres ver en los próximos vídeos de miricode?
          </h1>
          <h2 className="text-xl  ">
            Comparte tus ideas y vota por las que más te interesen.
          </h2>
        </div>

        <form className="w-full lg:w-1/4 flex gap-2" onSubmit={handleAddIdea}>
          <Input
            placeholder="Escribe una idea..."
            maxLength={40}
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />
          <Button>Agregar</Button>
        </form>

        <section className="w-full lg:w-1/4 gap-2 flex flex-col">
          {currentIdeas.length > 0 ? (
            currentIdeas.map((i) => (
              <div className="flex gap-2 w-full items-center ">
                <Card
                  key={i.id}
                  id={i.id}
                  title={i.title}
                  votes={i.votes}
                  voters={i.voters || []}
                  author={i.author}
                  authorId={i.authorId}
                  createdAt={i.createdAt}
                  onVote={() => voteIdea(i.id, user!.uid)}
                />
                {user?.uid === i.authorId && (
                  <Button className="text-red-500 !w-10 !h-10  !px-1 hover:transform-none">
                    <Trash2 size={18} />
                  </Button>
                )}
              </div>
            ))
          ) : (
            <p className=" text-center  justify-center bg-gradient-to-r from-indigo-50 via-slate-50 to-indigo-50  p-4 backdrop-blur-3xl rounded-lg border-1 border-indigo-100 flex items-center">
              No hay ideas todavía. ¡Sé el primero en agregar una!
            </p>
          )}
          {ideas.length > 0 && (
            <div className="flex gap-2 mt-4 items-center justify-center">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </Button>
              <span> {currentPage}</span>
              <Button
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev * ideasPerPage < ideas.length ? prev + 1 : prev
                  )
                }
                disabled={currentPage * ideasPerPage >= ideas.length}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default App;
