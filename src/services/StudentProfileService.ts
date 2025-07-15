import { supabaseStudentProfileService } from './SupabaseStudentProfileService';

// Re-export the Supabase service as the main service
export const studentProfileService = supabaseStudentProfileService;

// Keep the class for backward compatibility
export class StudentProfileService {
  public async getProfile(userId: string) {
    return await supabaseStudentProfileService.getProfile(userId);
  }

  public async createProfile(userId: string, profile: any) {
    return await supabaseStudentProfileService.createProfile(userId, profile);
  }

  public async updateProfile(userId: string, updates: any) {
    return await supabaseStudentProfileService.updateProfile(userId, updates);
  }

  public async deleteProfile(userId: string) {
    return await supabaseStudentProfileService.deleteProfile(userId);
  }
}
