import { StudentProfile } from '../types/studentProfile';

class StudentProfileService {
  private static readonly STORAGE_KEY = 'student-profiles';

  public getProfile(id: string): StudentProfile | null {
    const profiles = this.getProfiles();
    return profiles[id] || null;
  }

  public createProfile(profile: StudentProfile): void {
    const profiles = this.getProfiles();
    profiles[profile.id] = profile;
    this.saveProfiles(profiles);
  }

  public updateProfile(profile: StudentProfile): void {
    const profiles = this.getProfiles();
    profiles[profile.id] = profile;
    this.saveProfiles(profiles);
  }

  public deleteProfile(id: string): void {
    const profiles = this.getProfiles();
    delete profiles[id];
    this.saveProfiles(profiles);
  }

  private getProfiles(): { [id: string]: StudentProfile } {
    const profilesJson = localStorage.getItem(StudentProfileService.STORAGE_KEY);
    return profilesJson ? JSON.parse(profilesJson) : {};
  }

  private saveProfiles(profiles: { [id: string]: StudentProfile }): void {
    localStorage.setItem(StudentProfileService.STORAGE_KEY, JSON.stringify(profiles));
  }
}

export const studentProfileService = new StudentProfileService();
