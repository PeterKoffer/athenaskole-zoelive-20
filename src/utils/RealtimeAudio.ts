
export interface Student {
  id: string;
  name: string;
  email: string;
  enrollmentDate: string;
  progress: number;
  attendance: number;
  grades: { subject: string; grade: number }[];
}

export interface Class {
  id: string;
  name: string;
  grade: string;
  teacher: string;
  subject: string;
  students: Student[];
  schedule: string;
  room: string;
  capacity: number;
}

export interface SchoolStats {
  totalStudents: number;
  totalTeachers: number;
  averageProgress: number;
  attendanceRate: number;
}

export interface StudentProfile {
  personalInfo: {
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: string;
    nationality: string;
    idNumber: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    emergencyContact: string;
    emergencyPhone: string;
  };
  academicInfo: {
    grade: string;
    previousSchool: string;
    startDate: string;
    subjects: string[];
    specialNeeds: string;
    notes: string;
    currentStepId?: string;
  };
  parentInfo: {
    parentName: string;
    parentEmail: string;
    parentPhone: string;
    parentAddress: string;
    relationship: string;
  };
  classId?: string;
}

export interface RegistrationStep {
  id: number;
  title: string;
  icon: unknown;
}

export type TeachingPerspectiveType = "none" | "mild-christian" | "strong-christian" | "secular" | "custom";

export interface TeachingPerspective {
  type: TeachingPerspectiveType;
  customValues?: string[];
  emphasis?: string;
}

export interface AudioConfig {
  enabled: boolean;
  volume: number;
  autoPlay: boolean;
}

export interface RealtimeAudioService {
  initialize(): Promise<void>;
  playAudio(text: string): Promise<void>;
  stopAudio(): void;
  setVolume(volume: number): void;
  isPlaying(): boolean;
}

export interface RealtimeChatConfig {
  apiKey?: string;
  model?: string;
  temperature?: number;
}

export class RealtimeChat {
  private config: RealtimeChatConfig;

  constructor(config: RealtimeChatConfig = {}) {
    this.config = config;
  }

  async sendMessage(message: string): Promise<string> {
    console.log('💬 RealtimeChat sending message:', message);
    // Mock response for now
    return "This is a mock response from RealtimeChat";
  }

  async streamResponse(message: string, onChunk: (chunk: string) => void): Promise<void> {
    console.log('🌊 RealtimeChat streaming response for:', message);
    // Mock streaming response
    const mockResponse = "This is a mock streaming response";
    for (let i = 0; i < mockResponse.length; i++) {
      setTimeout(() => onChunk(mockResponse[i]), i * 50);
    }
  }
}

export class RealtimeAudioManager implements RealtimeAudioService {
  private isInitialized = false;
  private currentAudio: HTMLAudioElement | null = null;
  private config: AudioConfig = {
    enabled: true,
    volume: 0.8,
    autoPlay: false
  };

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      this.isInitialized = true;
      console.log('✅ Realtime Audio Manager initialized');
    } catch (error) {
      console.error('❌ Failed to initialize audio manager:', error);
      throw error;
    }
  }

  async playAudio(text: string): Promise<void> {
    if (!this.config.enabled || !text.trim()) return;
    
    try {
      this.stopAudio();
      console.log(`🔊 Playing audio for: ${text.substring(0, 50)}...`);
      
    } catch (error) {
      console.error('❌ Failed to play audio:', error);
    }
  }

  stopAudio(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  setVolume(volume: number): void {
    this.config.volume = Math.max(0, Math.min(1, volume));
    if (this.currentAudio) {
      this.currentAudio.volume = this.config.volume;
    }
  }

  isPlaying(): boolean {
    return this.currentAudio ? !this.currentAudio.paused : false;
  }
}

export const realtimeAudioManager = new RealtimeAudioManager();
