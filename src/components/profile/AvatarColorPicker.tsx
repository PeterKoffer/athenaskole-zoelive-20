
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Palette } from "lucide-react";

interface AvatarColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  userName: string;
}

const AVATAR_COLORS = [
  { name: "Purple Cyan", value: "from-purple-400 to-cyan-400", preview: "bg-gradient-to-br from-purple-400 to-cyan-400" },
  { name: "Blue Pink", value: "from-blue-400 to-pink-400", preview: "bg-gradient-to-br from-blue-400 to-pink-400" },
  { name: "Green Blue", value: "from-green-400 to-blue-400", preview: "bg-gradient-to-br from-green-400 to-blue-400" },
  { name: "Orange Red", value: "from-orange-400 to-red-400", preview: "bg-gradient-to-br from-orange-400 to-red-400" },
  { name: "Purple Pink", value: "from-purple-500 to-pink-500", preview: "bg-gradient-to-br from-purple-500 to-pink-500" },
  { name: "Indigo Purple", value: "from-indigo-400 to-purple-400", preview: "bg-gradient-to-br from-indigo-400 to-purple-400" },
  { name: "Teal Green", value: "from-teal-400 to-green-400", preview: "bg-gradient-to-br from-teal-400 to-green-400" },
  { name: "Yellow Orange", value: "from-yellow-400 to-orange-400", preview: "bg-gradient-to-br from-yellow-400 to-orange-400" },
  { name: "Rose Pink", value: "from-rose-400 to-pink-400", preview: "bg-gradient-to-br from-rose-400 to-pink-400" },
  { name: "Emerald Teal", value: "from-emerald-400 to-teal-400", preview: "bg-gradient-to-br from-emerald-400 to-teal-400" },
  { name: "Sky Blue", value: "from-sky-400 to-blue-400", preview: "bg-gradient-to-br from-sky-400 to-blue-400" },
  { name: "Violet Purple", value: "from-violet-400 to-purple-400", preview: "bg-gradient-to-br from-violet-400 to-purple-400" }
];

const AvatarColorPicker = ({ selectedColor, onColorChange, userName }: AvatarColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentColor = AVATAR_COLORS.find(color => color.value === selectedColor) || AVATAR_COLORS[0];

  return (
    <div className="space-y-3">
      <Label className="text-gray-300 flex items-center">
        <Palette className="w-4 h-4 mr-2" />
        Avatar Color
      </Label>
      
      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600 justify-start"
        >
          <div className={`w-6 h-6 rounded-full mr-3 ${currentColor.preview}`}></div>
          {currentColor.name}
        </Button>

        {isOpen && (
          <div className="grid grid-cols-3 gap-3 p-4 bg-gray-800 rounded-lg border border-gray-600">
            {AVATAR_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => {
                  onColorChange(color.value);
                  setIsOpen(false);
                }}
                className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                  selectedColor === color.value 
                    ? 'border-purple-400 ring-2 ring-purple-400/50' 
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className={`w-12 h-12 rounded-full ${color.preview} flex items-center justify-center text-white font-bold text-lg`}>
                    {userName ? userName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs text-gray-300 text-center">{color.name}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarColorPicker;
