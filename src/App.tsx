import { SquarePlay } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "./components/Button";
import { Card } from "./components/Card";
import { useIdeas } from "./context/IdeasContext";
import { useAuth } from "./context/AuthContext";
import { Header } from "./components/Header";

import "./App.css";

function App() {
  const [idea, setIdea] = useState("");
  const { ideas, voteIdea, addIdea } = useIdeas();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, signup, isUsernameTaken } = useAuth();
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleAddIdea = (event: React.FormEvent) => {
    event.preventDefault();
    addIdea(idea);
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
            <dialog
              ref={dialogRef}
              className="p-6 rounded-lg flex flex-col gap-4 z-50 bg-slate-50/100    backdrop-blur-xl border-1 border-indigo-100 w-full max-w-lg h-[350px] justify-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <h2 className="text-xl font-semibold">
                {mode === "login" ? "Iniciar sesión" : "Registrarse"}
              </h2>

              <form
                className="flex flex-col gap-3"
                onSubmit={async (event: React.FormEvent) => {
                  event.preventDefault();
                  setUsernameError("");
                  setEmailError("");
                  setPasswordError("");
                  setErrorMessage("");
                  if (mode === "login") {
                    try {
                      await login(email, password);
                      closeDialog();
                    } catch (error: unknown) {
                      if (error instanceof Error) {
                        const e = error as { code?: string; message: string };

                        switch (e.code) {
                          case "auth/user-not-found":
                            setEmailError(
                              "No existe una cuenta con este correo."
                            );
                            break;
                          case "auth/wrong-password":
                            setPasswordError("Contraseña incorrecta.");
                            break;
                          case "auth/invalid-email":
                            setEmailError("Correo electrónico no válido.");
                            break;
                          default:
                            setErrorMessage(e.message);
                        }
                      }
                    }
                  } else {
                    try {
                      const formattedUsername = username
                        .trim()
                        .replace(/\s+/g, "_")
                        .toLowerCase();

                      const taken = await isUsernameTaken(formattedUsername);
                      if (taken) {
                        setUsernameError(
                          "El nombre de usuario ya está en uso."
                        );
                        return;
                      }
                      if (password.length < 6) {
                        setPasswordError(
                          "La contraseña debe tener al menos 6 caracteres."
                        );
                        return;
                      }
                      await signup(formattedUsername, email, password);
                      closeDialog();
                    } catch (error: unknown) {
                      if (error instanceof Error) {
                        const e = error as { code?: string; message: string };
                        switch (e.code) {
                          case "auth/email-already-in-use":
                            setEmailError(
                              "Este correo electrónico ya está en uso."
                            );
                            break;
                          case "auth/invalid-email":
                            setEmailError("Correo electrónico no válido.");
                            break;
                          case "auth/weak-password":
                            setPasswordError(
                              "La contraseña es demasiado débil."
                            );
                            break;
                          default:
                            setErrorMessage(e.message);
                        }
                      } else {
                        setErrorMessage("Ocurrió un error desconocido.");
                      }
                    }
                  }
                }}
              >
                {mode === "register" && (
                  <>
                    <input
                      placeholder="Nombre de usuario"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="flex-1 focus:outline-0 border-1 focus:border-indigo-200 border-indigo-100 rounded-md px-4 py-2 bg-slate-50/40 "
                    />
                    {usernameError && (
                      <p className="text-sm text-red-500 px-4">
                        {usernameError}
                      </p>
                    )}
                  </>
                )}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Correo electrónico"
                  className="flex-1 focus:outline-0 border-1 focus:border-indigo-200 border-indigo-100 rounded-md px-4 py-2 bg-slate-50/40 "
                />
                {emailError && (
                  <p className="text-sm text-red-500 px-4">{emailError}</p>
                )}
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  className="flex-1 focus:outline-0 border-1 focus:border-indigo-200 border-indigo-100 rounded-md px-4 py-2 bg-slate-50/40 "
                />{" "}
                {passwordError && (
                  <p className="text-sm text-red-500 px-4">{passwordError}</p>
                )}
                {errorMessage && (
                  <p className="text-sm text-red-500 px-4">{errorMessage}</p>
                )}
                <Button type="submit" className="w-full hover:rotate-0">
                  {mode === "login" ? "Entrar" : "Registrarse"}
                </Button>
              </form>
              <p className="mt-4 text-sm text-center flex gap-2 justify-center items-center">
                {mode === "login" ? (
                  <>
                    ¿No tienes cuenta?{" "}
                    <Button
                      variant="link"
                      onClick={() => setMode("register")}
                      className=" font-semibold cursor-pointer "
                    >
                      Regístrate
                    </Button>
                  </>
                ) : (
                  <>
                    ¿Ya tienes cuenta?{" "}
                    <Button
                      variant="link"
                      onClick={() => setMode("login")}
                      className=" font-semibold cursor-pointer "
                    >
                      Iniciar sesión
                    </Button>
                  </>
                )}
              </p>

              <button
                type="button"
                onClick={closeDialog}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 cursor-pointer z-20"
              >
                ✕
              </button>
            </dialog>
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
          <input
            placeholder="Escribe una idea..."
            className="flex-1 focus:outline-0 border-1 focus:border-indigo-200 border-indigo-100 rounded-md px-4 py-2 bg-slate-50/70 "
            maxLength={40}
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />
          <Button>Agregar</Button>
        </form>

        <section className="w-1/4 gap-2 flex flex-col">
          {ideas.length > 0 ? (
            ideas
              .slice()
              .sort((a, b) => b.votes - a.votes)
              .map((i) => (
                <Card
                  key={i.id}
                  id={i.id}
                  title={i.title}
                  votes={i.votes}
                  onVote={() => voteIdea(i.id)}
                />
              ))
          ) : (
            <p className=" text-center  justify-center bg-gradient-to-r  from-indigo-50 via-slate-50 to-indigo-50  p-4 backdrop-blur-3xl rounded-lg border-1 border-indigo-100 flex items-center">
              No hay ideas todavía. ¡Sé el primero en agregar una!
            </p>
          )}
        </section>
      </main>
    </>
  );
}

export default App;
