import { SquarePlay } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./components/Button";
import { Card } from "./components/Card";
import { useIdeas } from "./context/IdeasContext";
import { Header } from "./components/Header";
import { Input } from "./components/Input";
import { Dialog } from "./components/Dialog";
import { onValue, ref, set } from "firebase/database";
import { db } from "./config/firebase";
import { useAuth } from "./context/AuthContext";
import "./App.css";
import type { Idea } from "./types/types";

function App() {
  const [idea, setIdea] = useState("");
  const { ideas, setIdeas, voteIdea, addIdea } = useIdeas();
  const [_mode, setMode] = useState<"login" | "register">("login");
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const currentUser = user?.displayName ?? "Anónimo";

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

    addIdea(idea, currentUser);

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
      <main className="flex flex-col justify-center items-center h-screen gap-8">
        {isOpen && (
          <>
            <div
              onClick={closeDialog}
              className="fixed inset-0 bg-indigo-950/20 backdrop-blur-sm z-10"
            />
            <Dialog closeDialog={closeDialog} />
          </>
        )}
        <div className="flex flex-col gap-2 items-center ">
          <SquarePlay size={40} />
          <h1 className=" text-3xl font-semibold  text-center flex items-center">
            ¿Qué quieres ver en el próximo vídeo?
          </h1>
          <h2 className="text-xl ">
            Comparte tus ideas para próximos videos y vota por las que más te
            interesen.
          </h2>
        </div>

        <form className="w-1/4 flex gap-2" onSubmit={handleAddIdea}>
          <Input
            placeholder="Escribe una idea..."
            maxLength={40}
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />
          <Button>Agregar</Button>
        </form>

        <section className="w-1/4 gap-2 flex flex-col">
          {ideas.length > 0 ? (
            ideas.map((i) => (
              <Card
                key={i.id}
                id={i.id}
                title={i.title}
                votes={i.votes}
                voters={i.voters || []}
                author={i.author}
                createdAt={i.createdAt}
                onVote={() => voteIdea(i.id, user!.uid)}
              />
            ))
          ) : (
            <p className=" text-center  justify-center bg-gradient-to-r from-indigo-50 via-slate-50 to-indigo-50  p-4 backdrop-blur-3xl rounded-lg border-1 border-indigo-100 flex items-center">
              No hay ideas todavía. ¡Sé el primero en agregar una!
            </p>
          )}
        </section>
      </main>
    </>
  );
}

export default App;
