
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md border-2 border-red-200">
        <CardHeader className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
          <CardTitle className="text-center text-red-800">
            {isLogin ? "Log ind på Læreleg" : "Opret konto"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <Label htmlFor="name">Fulde navn</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="f.eks. Emil Nielsen"
                  />
                </div>
                <div>
                  <Label htmlFor="age">Alder</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    placeholder="8-16 år"
                    min="6"
                    max="18"
                  />
                </div>
              </>
            )}
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="din@email.dk"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Adgangskode</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Mindst 6 tegn"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
              {isLogin ? "Log ind" : "Opret konto"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button 
              variant="link" 
              onClick={() => setIsLogin(!isLogin)}
              className="text-red-600 hover:text-red-700"
            >
              {isLogin ? "Har du ikke en konto? Opret en" : "Har du allerede en konto? Log ind"}
            </Button>
          </div>

          {!isLogin && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
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
