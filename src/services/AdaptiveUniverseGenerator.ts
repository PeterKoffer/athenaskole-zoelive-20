import { Universe } from './UniverseGenerator';
import { topTags } from './interestProfile';
import { UniverseBrief, buildUniverseBriefPrompt } from './universeBrief';
import { supabase } from '@/integrations/supabase/client';

export class AdaptiveUniverseGenerator {
  
  static async generatePersonalizedUniverse(
    subject: string = 'general',
    gradeLevel: number = 6
  ): Promise<Universe> {
    
    // Get user's top interests
    const interests = topTags(3);
    const gradeBand = `grade ${gradeLevel}`;
    
    try {
      // Generate universe brief using AI
      const brief = await this.generateUniverseBrief(subject, gradeBand, interests);
      
      // Convert brief to Universe format
      const universe: Universe = {
        id: `adaptive-${Date.now()}`,
        title: brief.title,
        description: brief.synopsis,
        theme: subject,
        characters: this.generateCharactersFromBrief(brief),
        locations: this.generateLocationsFromBrief(brief),
        activities: this.generateActivitiesFromBrief(brief, subject)
      };
      
      return universe;
      
    } catch (error) {
      console.error('Failed to generate personalized universe:', error);
      // Fallback to interest-based universe
      return this.generateFallbackUniverse(subject, interests, gradeLevel);
    }
  }
  
  private static async generateUniverseBrief(
    subject: string,
    gradeBand: string,
    interests: string[]
  ): Promise<UniverseBrief> {
    
    const prompt = buildUniverseBriefPrompt(subject, gradeBand, interests);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-adaptive-content', {
        body: {
          prompt: prompt,
          maxTokens: 300,
          temperature: 0.8
        }
      });
      
      if (error) throw error;
      
      // Parse the AI response
      let briefData;
      if (typeof data.content === 'string') {
        // Try to extract JSON from the response
        const jsonMatch = data.content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          briefData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } else {
        briefData = data.content;
      }
      
      return {
        title: briefData.title || 'Learning Adventure',
        synopsis: briefData.synopsis || 'An engaging learning experience',
        props: briefData.props || ['notebook', 'calculator', 'smartphone', 'backpack'],
        imagePrompt: briefData.imagePrompt || 'Students engaged in learning activity',
        tags: briefData.tags || interests,
        subject,
        gradeLevel: parseInt(gradeBand.split(' ')[1])
      };
      
    } catch (error) {
      console.error('AI brief generation failed:', error);
      throw error;
    }
  }
  
  private static generateCharactersFromBrief(brief: UniverseBrief): string[] {
    const baseCharacters = ['You (the student)', 'Your mentor'];
    
    // Add interest-specific characters
    if (brief.tags.includes('sports')) {
      baseCharacters.push('Team captain', 'Coach');
    }
    if (brief.tags.includes('cooking')) {
      baseCharacters.push('Head chef', 'Food critic');
    }
    if (brief.tags.includes('technology')) {
      baseCharacters.push('Tech expert', 'Innovation lead');
    }
    if (brief.tags.includes('music')) {
      baseCharacters.push('Music director', 'Sound engineer');
    }
    
    return baseCharacters.slice(0, 4); // Keep it manageable
  }
  
  private static generateLocationsFromBrief(brief: UniverseBrief): string[] {
    const locations = ['Your classroom', 'School hallway'];
    
    // Add prop-based and interest-based locations
    if (brief.props.some(p => p.includes('kitchen') || p.includes('food'))) {
      locations.push('School cafeteria', 'Local restaurant');
    }
    if (brief.props.some(p => p.includes('computer') || p.includes('tech'))) {
      locations.push('Computer lab', 'Tech startup office');
    }
    if (brief.props.some(p => p.includes('gym') || p.includes('field'))) {
      locations.push('School gymnasium', 'Sports field');
    }
    if (brief.props.some(p => p.includes('library') || p.includes('book'))) {
      locations.push('School library', 'Study hall');
    }
    
    return locations.slice(0, 4);
  }
  
  private static generateActivitiesFromBrief(brief: UniverseBrief, subject: string): string[] {
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
    if (brief.tags.includes('sports')) {
      activities.push('Plan team strategies', 'Track performance metrics');
    }
    if (brief.tags.includes('cooking')) {
      activities.push('Design healthy menus', 'Calculate nutrition values');
    }
    if (brief.tags.includes('technology')) {
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