
import { CurriculumGame } from '../types/GameTypes';

let cachedGames: CurriculumGame[] | null = null;

export const loadK12Games = async (): Promise<CurriculumGame[]> => {
  if (cachedGames) {
    return cachedGames;
  }

  try {
    const gameFiles = [
      '/data/games/mathematics-k12-games.json',
      '/data/games/english-games.json',
      '/data/games/science-games.json',
      '/data/games/computerscience-games.json',
      '/data/games/socialstudies-games.json',
      '/data/games/language-games.json',
      '/data/games/music-games.json'
    ];

    const allGames: CurriculumGame[] = [];

    for (const file of gameFiles) {
      try {
        const response = await fetch(file);
        if (response.ok) {
          const games = await response.json();
          allGames.push(...games);
        }
      } catch (error) {
        console.warn(`Failed to load ${file}:`, error);
      }
    }

    // Enhanced fallback games with engaging content
    if (allGames.length === 0) {
      const enhancedGames: CurriculumGame[] = [];
      
      // Create engaging games for each grade (K-12)
      for (let grade = 0; grade <= 12; grade++) {
        const subjects = [
          {
            name: 'Mathematics',
            games: [
              {
                title: `Math Quest Arena (Grade ${grade})`,
                description: `Battle mathematical monsters using your calculation skills! Master Grade ${grade} math concepts through epic adventures.`,
                emoji: '⚔️',
                skillAreas: ['arithmetic', 'problem_solving', 'logical_thinking']
              },
              {
                title: `Number Detective Stories (Grade ${grade})`,
                description: `Solve mysterious cases using mathematical clues and deductive reasoning. Perfect for Grade ${grade} learners!`,
                emoji: '🕵️',
                skillAreas: ['pattern_recognition', 'logical_reasoning', 'number_sense']
              },
              {
                title: `Space Math Mission (Grade ${grade})`,
                description: `Navigate through space using math skills! Calculate trajectories, solve puzzles, and save the galaxy.`,
                emoji: '🚀',
                skillAreas: ['geometry', 'measurement', 'spatial_reasoning']
              }
            ]
          },
          {
            name: 'English',
            games: [
              {
                title: `Story Builder Adventures (Grade ${grade})`,
                description: `Create epic tales while mastering grammar, vocabulary, and creative writing skills for Grade ${grade}.`,
                emoji: '📖',
                skillAreas: ['creative_writing', 'grammar', 'vocabulary']
              },
              {
                title: `Word Wizard Challenge (Grade ${grade})`,
                description: `Cast spelling spells and defeat vocabulary villains in this magical language adventure!`,
                emoji: '🪄',
                skillAreas: ['spelling', 'vocabulary', 'reading_comprehension']
              },
              {
                title: `Poetry Power Quest (Grade ${grade})`,
                description: `Unlock the power of poetry! Learn rhythm, rhyme, and literary devices through interactive storytelling.`,
                emoji: '🎭',
                skillAreas: ['poetry', 'literary_analysis', 'creative_expression']
              }
            ]
          },
          {
            name: 'Science',
            games: [
              {
                title: `Laboratory Legends (Grade ${grade})`,
                description: `Conduct virtual experiments and discover scientific principles through hands-on investigation!`,
                emoji: '🧪',
                skillAreas: ['scientific_method', 'experimentation', 'observation']
              },
              {
                title: `Ecosystem Explorer (Grade ${grade})`,
                description: `Journey through different habitats and learn about biodiversity, food chains, and environmental science.`,
                emoji: '🌿',
                skillAreas: ['biology', 'ecology', 'environmental_science']
              },
              {
                title: `Physics Playground (Grade ${grade})`,
                description: `Master forces, motion, and energy through interactive simulations and real-world applications.`,
                emoji: '⚡',
                skillAreas: ['physics', 'mechanics', 'energy']
              }
            ]
          },
          {
            name: 'Computer Science',
            games: [
              {
                title: `Coding Kingdom (Grade ${grade})`,
                description: `Rule a digital kingdom by programming solutions to help your citizens and protect your realm!`,
                emoji: '👑',
                skillAreas: ['programming', 'logic', 'problem_solving']
              },
              {
                title: `Algorithm Academy (Grade ${grade})`,
                description: `Train as an algorithm warrior! Master sorting, searching, and optimization through competitive challenges.`,
                emoji: '🏛️',
                skillAreas: ['algorithms', 'data_structures', 'computational_thinking']
              },
              {
                title: `Robot Rescue Mission (Grade ${grade})`,
                description: `Program robots to complete rescue missions! Learn sequences, loops, and conditionals through action.`,
                emoji: '🤖',
                skillAreas: ['robotics', 'programming_concepts', 'logical_sequences']
              }
            ]
          }
        ];
        
        subjects.forEach((subject) => {
          subject.games.forEach((gameTemplate, gameIndex) => {
            enhancedGames.push({
              id: `${subject.name.toLowerCase()}-grade${grade}-${gameIndex + 1}`,
              title: gameTemplate.title,
              description: gameTemplate.description,
              emoji: gameTemplate.emoji,
              subject: subject.name,
              gradeLevel: [grade],
              difficulty: grade <= 3 ? 'beginner' : grade <= 8 ? 'intermediate' : 'advanced',
              interactionType: ['multiple-choice', 'drag-drop', 'simulation', 'puzzle'][gameIndex % 4] as any,
              timeEstimate: "15-30 min",
              skillAreas: gameTemplate.skillAreas,
              learningObjectives: [
                `Master Grade ${grade} ${subject.name} concepts through engaging gameplay`,
                "Develop critical thinking and problem-solving skills",
                "Apply knowledge to real-world scenarios and challenges",
                "Build confidence through progressive skill development"
              ],
              status: "available",
              rewards: {
                coins: 150 + (grade * 15) + (gameIndex * 25),
                badges: [`${subject.name} Champion`, `Grade ${grade} Master`, 'Problem Solver']
              },
              adaptiveRules: {
                successThreshold: 0.75,
                failureThreshold: 0.4,
                difficultyIncrease: 0.1,
                difficultyDecrease: 0.15
              }
            });
          });
        });
      }
      
      allGames.push(...enhancedGames);
    }

    cachedGames = allGames;
    console.log(`🎮 Loaded ${allGames.length} enhanced K-12 educational games`);
    return allGames;
    
  } catch (error) {
    console.error('Failed to load K-12 games:', error);
    return [];
  }
};

export const getGamesByGrade = async (grade: number): Promise<CurriculumGame[]> => {
  const games = await loadK12Games();
  return games.filter(game => game.gradeLevel.includes(grade));
};

export const getGamesBySubject = async (subject: string): Promise<CurriculumGame[]> => {
  const games = await loadK12Games();
  return games.filter(game => game.subject === subject);
};

export const getGameById = async (id: string): Promise<CurriculumGame | undefined> => {
  const games = await loadK12Games();
  return games.find(game => game.id === id);
};
