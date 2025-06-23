
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
    currentStepId?: string; // optional: ID of the step (e.g., "1")
  };
  parentInfo: {
    parentName: string;
    parentEmail: string;
    parentPhone: string;
    parentAddress: string;
    relationship: string;
  };
  classId?: string; // optional field for class assignment
}

export interface RegistrationStep {
  id: number;
  title: string;
  icon: unknown;
}

// Teaching Perspective Setting for a school
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
      // Initialize audio context if needed
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
      // Stop any currently playing audio
      this.stopAudio();
      
      // Create new audio instance (placeholder for actual implementation)
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
