
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CommunicationCenter from './CommunicationCenter';

const GlobalCommunicationButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Beskeder
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Kommunikationscenter</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <CommunicationCenter />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalCommunicationButton;
