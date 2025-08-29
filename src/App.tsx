import { ChevronLeft, ChevronRight, SquarePlay } from "lucide-react";
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
import { toast, Toaster } from "sonner";
import { useMobile } from "./hooks/useMobile";
import "./App.css";

function App() {
  const [idea, setIdea] = useState("");
  const { ideas, setIdeas, voteIdea, addIdea, deleteIdea } = useIdeas();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ideasPerPage = 5;
  const indexOfLastIdea = currentPage * ideasPerPage;
  const indexOfFirstIdea = indexOfLastIdea - ideasPerPage;
  const currentIdeas = ideas.slice(indexOfFirstIdea, indexOfLastIdea);
  const { user } = useAuth();
  const username = user?.displayName ?? "Anónimo";
  const isMobile = useMobile();

  useEffect(() => {
    const ideasRef = ref(db, "ideas/");
    const unsubscribe = onValue(ideasRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ideasArray = Object.values(data) as Idea[];

        setIdeas(
          ideasArray.sort((a, b) => {
            if (b.votes === a.votes && b.votes === 0) {
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
    if (!user) {
      toast.error("Debes iniciar sesión para poder agregar una idea");
      return;
    }
    addIdea(idea, username, user!.uid);
    setIdea("");
  };

  const openDialog = (type: "login" | "register") => {
    setMode(type);
    setIsOpen(true);
  };

  const closeDialog = () => setIsOpen(false);

  return (
    <>
      <Header openDialog={openDialog} />
      <Toaster position="top-center" className="text-center" />

      <main className="px-4 lg:px-0 py-4 lg:py-0 flex flex-col justify-center items-center min-h-screen gap-8 flex-1">
        {isOpen && (
          <>
            <div
              onClick={closeDialog}
              className="fixed inset-0 bg-indigo-950/20 backdrop-blur-sm z-10"
            />
            <Dialog closeDialog={closeDialog} mode={mode} setMode={setMode} />
          </>
        )}

        <div className="flex flex-col gap-2 items-center text-center">
          <SquarePlay size={40} />
          <h1 className="text-xl lg:text-3xl font-semibold flex items-center justify-center text-center">
            ¿Qué quieres ver en los próximos vídeos de miricode?
          </h1>
          <h2 className="text-lg lg:text-xl">
            Comparte tus ideas y vota por las que más te interesen.
          </h2>
        </div>

        <form
          className="w-full sm:w-3/4 md:w-2/4 xl:w-2/4  2xl:w-1/4 flex gap-2"
          onSubmit={handleAddIdea}
        >
          <Input
            placeholder="Escribe una idea..."
            maxLength={40}
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />
          <Button>Agregar</Button>
        </form>

        <section className="w-full sm:w-3/4 md:w-2/4 xl:w-2/4 2xl:w-1/4 gap-2 flex flex-col">
          {currentIdeas.length > 0 ? (
            currentIdeas.map((i) => {
              const isUserIdea = user?.uid === i.authorId;

              return (
                <div key={i.id} className="flex gap-2 items-start">
                  <Card
                    id={i.id}
                    title={i.title}
                    votes={i.votes}
                    voters={i.voters || []}
                    author={i.author}
                    authorId={i.authorId}
                    createdAt={i.createdAt}
                    onVote={() => voteIdea(i.id, user!.uid)}
                    isMobile={isMobile}
                    isUserIdea={isUserIdea}
                    deleteIdea={deleteIdea}
                  />
                </div>
              );
            })
          ) : (
            <p className="text-center justify-center bg-gradient-to-r from-indigo-50 via-slate-50 to-indigo-50 p-4 backdrop-blur-3xl rounded-lg border border-indigo-100 flex items-center">
              No hay ideas todavía. ¡Empieza agregando una!
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
              <span>{currentPage}</span>
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
