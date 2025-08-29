import Avatar from "boring-avatars";
import { useAuth } from "../context/AuthContext";
import { Button } from "./Button";
import { useState } from "react";
import { LogOut, Smile } from "lucide-react";

interface HeaderProps {
  openDialog: (type: "login" | "register") => void;
}

export const Header = ({ openDialog }: HeaderProps) => {
  const { user, logout } = useAuth();
  const [isOpenProfile, setIsOpenProfile] = useState(false);

  const openProfileDialog = () => {
    setIsOpenProfile(!isOpenProfile);
  };
  const handleLogout = () => {
    logout();
    setIsOpenProfile(false);
  };
  return (
    <header className="w-full p-4 absolute top-0">
      <nav
        className={`flex ${
          user ? "justify-end" : "justify-center"
        } md:justify-end md:mr-4`}
      >
        {user ? (
          <div className="flex items-center gap-2">
            <Avatar
              size={36}
              name={user.displayName || "user"}
              variant="beam"
              colors={["#92A1C6", "#0735A6", "#F0AB3D", "#C271B4", "#C20D90"]}
              onClick={() => openProfileDialog()}
              className="cursor-pointer"
            />

            {isOpenProfile && (
              <div className="absolute top-16 right-8 bg-slate-50/30 backdrop-blur-2xl border-1 border-indigo-100 px-4 py-2 rounded-md flex flex-col gap-2 items-center">
                <span>@{user.displayName}</span>
                <Button
                  onClick={handleLogout}
                  className="text-sm flex items-center gap-2 w-full "
                >
                  <LogOut size={16} />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <ul className="flex gap-4 items-center">
            <li>
              <Button variant="link" onClick={() => openDialog("login")}>
                Iniciar sesión
              </Button>
            </li>
            <li>
              <Button className="w-full" onClick={() => openDialog("register")}>
                Únete a la comunidad <Smile size={16} />
              </Button>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
};
