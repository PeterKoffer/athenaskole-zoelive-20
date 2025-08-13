import { Universe } from './UniverseGenerator';
import { topTags } from './interestProfile';
import { createOrRefreshUniverse } from './universe/simulation';
import { UniverseState } from './universe/state';
import { saveArc } from './universe/persist';

export class AdaptiveUniverseGenerator {
  
  static async generatePersonalizedUniverse(
    subject: string = 'general',
    gradeLevel: number = 6,
    userId?: string
  ): Promise<Universe> {
    
    const gradeBand = gradeLevel <= 5 ? "3-5" : gradeLevel <= 8 ? "6-8" : "9-12";
    
    try {
      // Load existing universe arc or create new one
      let universeState: UniverseState;
      
      if (userId) {
        // Always create fresh universe to avoid repetitive content
        universeState = await createOrRefreshUniverse(subject, gradeBand);
        saveArc(userId, universeState);
      } else {
        // Guest user - create temporary universe
        universeState = await createOrRefreshUniverse(subject, gradeBand);
      }
      
      // Convert universe state to Universe format for compatibility
      const universe: Universe = {
        id: universeState.id,
        title: universeState.title,
        description: universeState.synopsis,
        theme: subject,
        characters: this.generateCharactersFromState(universeState),
        locations: this.generateLocationsFromState(universeState),
        activities: this.generateActivitiesFromState(universeState, subject)
      };
      
      return universe;
      
    } catch (error) {
      console.error('Failed to generate personalized universe:', error);
      // Fallback to interest-based universe
      const interests = topTags(3);
      return this.generateFallbackUniverse(subject, interests, gradeLevel);
    }
  }
  
  
  private static generateCharactersFromState(state: UniverseState): string[] {
    const baseCharacters = ['You (the student)', 'Your mentor'];
    
    // Add interest-specific characters based on tags
    if (state.tags.includes('sports')) {
      baseCharacters.push('Team captain', 'Coach');
    }
    if (state.tags.includes('cooking')) {
      baseCharacters.push('Head chef', 'Food critic');
    }
    if (state.tags.includes('technology')) {
      baseCharacters.push('Tech expert', 'Innovation lead');
    }
    if (state.tags.includes('music')) {
      baseCharacters.push('Music director', 'Sound engineer');
    }
    
    return baseCharacters.slice(0, 4); // Keep it manageable
  }
  
  private static generateLocationsFromState(state: UniverseState): string[] {
    const locations = ['Your classroom', 'School hallway'];
    
    // Add prop-based and interest-based locations
    if (state.props.some(p => p.includes('kitchen') || p.includes('food'))) {
      locations.push('School cafeteria', 'Local restaurant');
    }
    if (state.props.some(p => p.includes('computer') || p.includes('tech'))) {
      locations.push('Computer lab', 'Tech startup office');
    }
    if (state.props.some(p => p.includes('gym') || p.includes('field'))) {
      locations.push('School gymnasium', 'Sports field');
    }
    if (state.props.some(p => p.includes('library') || p.includes('book'))) {
      locations.push('School library', 'Study hall');
    }
    
    return locations.slice(0, 4);
  }
  
  private static generateActivitiesFromState(state: UniverseState, subject: string): string[] {
    const activities = [];
    
    // Subject-specific activities
    if (subject.includes('math')) {
      activities.push('Solve real-world problems', 'Calculate measurements and costs');
    } else if (subject.includes('science')) {
      activities.push('Conduct experiments', 'Analyze data and results');
    } else if (subject.includes('language') || subject.includes('english')) {
      activities.push('Write and present ideas', 'Interview community members');
    } else {
      activities.push('Research and investigate', 'Create and design solutions');
    }
    
    // Interest-based activities
    if (state.tags.includes('sports')) {
      activities.push('Plan team strategies', 'Track performance metrics');
    }
    if (state.tags.includes('cooking')) {
      activities.push('Design healthy menus', 'Calculate nutrition values');
    }
    if (state.tags.includes('technology')) {
      activities.push('Build digital solutions', 'Test and iterate designs');
    }
    
    return activities.slice(0, 5);
  }
  
  private static generateFallbackUniverse(
    subject: string,
    interests: string[],
    _gradeLevel: number
  ): Universe {
    
    const interestThemes = {
      sports: 'School Sports Team Management',
      cooking: 'Student-Run Café Project',
      technology: 'Tech Innovation Challenge',
      music: 'School Concert Production',
      art: 'Community Mural Project',
      science: 'Environmental Research Lab',
      history: 'Local History Investigation',
      animals: 'School Pet Care Program'
    };
    
    const primaryInterest = interests[0] || 'general';
    const title = interestThemes[primaryInterest as keyof typeof interestThemes] || 'Learning Adventure';
    
    return {
      id: `fallback-${Date.now()}`,
      title,
      description: `Join a ${title.toLowerCase()} where you'll apply ${subject} skills in real-world scenarios. Work with peers and mentors to tackle challenges and create meaningful impact in your school community.`,
      theme: subject,
      characters: ['You', 'Project mentor', 'Team members', 'Community expert'],
      locations: ['Your classroom', 'School commons', 'Project workspace', 'Community venue'],
      activities: [
        'Plan and organize project phases',
        'Apply subject knowledge to solve problems',
        'Collaborate with team members',
        'Present results to the community'
      ]
    };
  }
}