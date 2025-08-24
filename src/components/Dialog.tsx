import { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Input } from "./Input";
import { Button } from "./Button";
import { X } from "lucide-react";

interface DialogProps {
  mode: "login" | "register";
  setMode: (mode: "login" | "register") => void;
  closeDialog: () => void;
}
export const Dialog = ({ mode, setMode, closeDialog }: DialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login, signup, isUsernameTaken } = useAuth();

  return (
    <dialog
      ref={dialogRef}
      className="p-6 rounded-lg flex flex-col gap-4 z-50 bg-slate-50/100    backdrop-blur-xl border-1 border-indigo-100 w-11/12 lg:w-full max-w-lg h-[350px] justify-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
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
                    setEmailError("No existe una cuenta con este correo.");
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
                setUsernameError("El nombre de usuario ya está en uso.");
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
                    setEmailError("Este correo electrónico ya está en uso.");
                    break;
                  case "auth/invalid-email":
                    setEmailError("Correo electrónico no válido.");
                    break;
                  case "auth/weak-password":
                    setPasswordError("La contraseña es demasiado débil.");
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
            <Input
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {usernameError && (
              <p className="text-sm text-red-500 px-4">{usernameError}</p>
            )}
          </>
        )}
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
        />
        {emailError && (
          <p className="text-sm text-red-500 px-4">{emailError}</p>
        )}
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
        />
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
        <X size={20} />
      </button>
    </dialog>
  );
};
