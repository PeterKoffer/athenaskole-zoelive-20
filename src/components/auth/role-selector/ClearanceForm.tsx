import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock } from "lucide-react";
import { UserRole, ROLE_CONFIGS } from "@/types/auth";
import { roleIcons, roleColors, clearanceCode1111 } from "./roleConstants";
interface ClearanceFormProps {
  selectedRole: UserRole;
  onSuccess: (role: UserRole) => void;
  onCancel: () => void;
}
const ClearanceForm = ({
  selectedRole,
  onSuccess,
  onCancel
}: ClearanceFormProps) => {
  const [clearanceCode, setClearanceCode] = useState("");
  const [clearanceError, setClearanceError] = useState("");
  const config = ROLE_CONFIGS[selectedRole];
  const IconComponent = roleIcons[selectedRole];
  const colorClass = roleColors[selectedRole];
  const handleSubmit = () => {
    if (clearanceCode === clearanceCode1111) {
      onSuccess(selectedRole);
    } else {
      setClearanceError("Invalid clearance code. Please enter '1111' for access.");
    }
  };
  const handleCancel = () => {
    setClearanceCode("");
    setClearanceError("");
    onCancel();
  };
  return <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <div className={`w-16 h-16 bg-gradient-to-br ${colorClass} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-white text-xl mb-2">
            {config.title} Access
          </CardTitle>
          <p className="text-gray-300 text-sm">
            This role requires special clearance. Please enter your access code.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clearance" className="text-white">Clearance Code</Label>
            <Input id="clearance" type="password" value={clearanceCode} onChange={e => setClearanceCode(e.target.value)} placeholder="Enter clearance code (1111)" className="bg-gray-700 border-gray-600 text-white" onKeyPress={e => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }} />
          </div>

          {clearanceError && <Alert className="bg-red-900 border-red-700">
              <Lock className="h-4 w-4" />
              <AlertDescription className="text-red-200">
                {clearanceError}
              </AlertDescription>
            </Alert>}

          <div className="flex space-x-3">
            <Button onClick={handleSubmit} className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600" disabled={!clearanceCode.trim()}>
              Verify Access
            </Button>
            <Button variant="outline" onClick={handleCancel} className="border-gray-600 text-slate-950 bg-slate-50">
              Cancel
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-400">
              Access code: 1111
            </p>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default ClearanceForm;