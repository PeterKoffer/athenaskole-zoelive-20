
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

const AuthModal = ({ onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login
    onLogin({
      name: formData.name || "Emil",
      email: formData.email,
      subscription: "free"
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-gray-900 border-2 border-gray-700">
        <CardHeader className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2 text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
          <CardTitle className="text-center text-white">
            {isLogin ? "Log ind på Læreleg" : "Opret konto"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <Label htmlFor="name" className="text-gray-300">Fulde navn</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="f.eks. Emil Nielsen"
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-green-400"
                  />
                </div>
                <div>
                  <Label htmlFor="age" className="text-gray-300">Alder</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    placeholder="8-16 år"
                    min="6"
                    max="18"
                    className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-green-400"
                  />
                </div>
              </>
            )}
            
            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="din@email.dk"
                required
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-green-400"
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-gray-300">Adgangskode</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Mindst 6 tegn"
                required
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-green-400"
              />
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white">
              {isLogin ? "Log ind" : "Opret konto"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button 
              variant="link" 
              onClick={() => setIsLogin(!isLogin)}
              className="text-green-400 hover:text-green-300"
            >
              {isLogin ? "Har du ikke en konto? Opret en" : "Har du allerede en konto? Log ind"}
            </Button>
          </div>

          {!isLogin && (
            <div className="mt-4 p-3 bg-blue-900/50 border border-blue-700 rounded-lg text-sm text-blue-300">
              <p className="font-semibold">GDPR & Privatliv:</p>
              <p>Vi respekterer dansk lovgivning og gemmer kun nødvendige data i EU.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthModal;
