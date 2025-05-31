
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRole } from "@/types/auth";

interface AuthFormFieldsProps {
  isLogin: boolean;
  selectedRole: UserRole;
  formData: {
    name: string;
    email: string;
    password: string;
    schoolCode: string;
    childCode: string;
  };
  onFormDataChange: (data: any) => void;
}

const AuthFormFields = ({ isLogin, selectedRole, formData, onFormDataChange }: AuthFormFieldsProps) => {
  return (
    <>
      {!isLogin && (
        <div>
          <Label htmlFor="name" className="text-gray-300">Full name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onFormDataChange({...formData, name: e.target.value})}
            placeholder="e.g. Emil Nielsen"
            required={!isLogin}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400"
          />
        </div>
      )}

      {!isLogin && (selectedRole === 'parent' || selectedRole === 'teacher') && (
        <div>
          <Label htmlFor="schoolCode" className="text-gray-300">School code</Label>
          <Input
            id="schoolCode"
            value={formData.schoolCode}
            onChange={(e) => onFormDataChange({...formData, schoolCode: e.target.value})}
            placeholder="Enter school code"
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400"
          />
        </div>
      )}

      {!isLogin && selectedRole === 'parent' && (
        <div>
          <Label htmlFor="childCode" className="text-gray-300">Child code</Label>
          <Input
            id="childCode"
            value={formData.childCode}
            onChange={(e) => onFormDataChange({...formData, childCode: e.target.value})}
            placeholder="Enter your child's code"
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400"
          />
        </div>
      )}
      
      <div>
        <Label htmlFor="email" className="text-gray-300">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => onFormDataChange({...formData, email: e.target.value})}
          placeholder="your@email.com"
          required
          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400"
        />
      </div>
      
      <div>
        <Label htmlFor="password" className="text-gray-300">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => onFormDataChange({...formData, password: e.target.value})}
          placeholder="At least 6 characters"
          required
          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400"
        />
      </div>
    </>
  );
};

export default AuthFormFields;
