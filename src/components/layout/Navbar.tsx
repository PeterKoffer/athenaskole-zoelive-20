import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Monitor, Gamepad2, BookOpenCheck, BrainCircuit, Settings, LogOut } from "lucide-react";
interface NavbarProps {
  onGetStarted: () => void;
  onShowProgress: () => void;
  onShowGames: () => void;
  onShowAITutor: () => void;
}
const Navbar = ({
  onGetStarted,
  onShowProgress,
  onShowGames,
  onShowAITutor
}: NavbarProps) => {
  const {
    user,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  return <nav className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <a href="/" className="flex items-center space-x-2">
          <BrainCircuit className="w-6 h-6 text-blue-500" />
          <span className="font-bold text-lg">Athena</span>
        </a>
        <div className="space-x-4">
          {user ? <>
              <Button variant="ghost" onClick={onShowProgress}>
                <Monitor className="w-4 h-4 mr-2" />
                Fremskridt
              </Button>
              <Button variant="ghost" onClick={onShowGames}>
                <Gamepad2 className="w-4 h-4 mr-2" />
                Spil
              </Button>
              <Button variant="ghost" onClick={onShowAITutor}>
                <BookOpenCheck className="w-4 h-4 mr-2" />
                AI Lærer
              </Button>
              <Button variant="outline" onClick={() => navigate('/profile')}>
                <Settings className="w-4 h-4 mr-2" />
                Profil
              </Button>
              <Button variant="outline" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Log ud
              </Button>
            </> : <>
              <Button variant="ghost" onClick={onGetStarted}>
                Log ind
              </Button>
              <Button variant="outline" onClick={onGetStarted} className="text-slate-950">
                Start Gratis
              </Button>
            </>}
        </div>
      </div>
    </nav>;
};
export default Navbar;