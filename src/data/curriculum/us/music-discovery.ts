
import { CurriculumNode } from '@/types/curriculum';
import { NELIESubject } from '@/types/curriculum/NELIESubjects';

export const musicDiscoveryCurriculum: CurriculumNode[] = [
  // Root Music Discovery Subject
  {
    id: 'us-music-discovery-root',
    parentId: 'us-subjects-root',
    nodeType: 'subject_area',
    name: 'Music Discovery',
    description: 'Comprehensive K-12 music education nurturing creativity, listening skills, cultural understanding, and emotional expression',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    subjectName: 'Music Discovery',
    educationalLevel: 'K-12',
    tags: ['music', 'creativity', 'cultural_appreciation', 'performance', 'composition']
  },

  // ELEMENTARY YEARS (K-3): Sound & Rhythm Foundations
  
  // Year 1 (K): Listening & Singing Basics
  {
    id: 'us-music-k-grade',
    parentId: 'us-music-discovery-root',
    nodeType: 'grade_level',
    name: 'Kindergarten Music Discovery',
    description: 'Listening & Singing Basics - foundational sound and rhythm awareness',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: 'K',
    estimatedDuration: 180,
    tags: ['kindergarten', 'listening', 'singing', 'rhythm_basics']
  },
  {
    id: 'us-music-k-aural-awareness',
    parentId: 'us-music-k-grade',
    nodeType: 'domain',
    name: 'Aural Awareness',
    description: 'Identify simple sounds and patterns; listen to environmental and instrumental sounds',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: 'K',
    estimatedDuration: 45,
    difficultyLevel: 1
  },
  {
    id: 'us-music-k-singing-pitch',
    parentId: 'us-music-k-grade',
    nodeType: 'domain',
    name: 'Singing & Pitch Matching',
    description: 'Sing simple melodic songs and nursery rhymes',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: 'K',
    estimatedDuration: 45,
    difficultyLevel: 1
  },
  {
    id: 'us-music-k-rhythm-fundamentals',
    parentId: 'us-music-k-grade',
    nodeType: 'domain',
    name: 'Rhythm Fundamentals',
    description: 'Clap or tap steady beat; echo simple rhythmic patterns',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: 'K',
    estimatedDuration: 45,
    difficultyLevel: 1
  },
  {
    id: 'us-music-k-cultural-sounds',
    parentId: 'us-music-k-grade',
    nodeType: 'domain',
    name: 'Cultural Sounds',
    description: 'Hear traditional song or melody from local heritage',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: 'K',
    estimatedDuration: 45,
    difficultyLevel: 1
  },

  // Year 2 (Grade 1): Rhythm & Melody Emergence
  {
    id: 'us-music-1-grade',
    parentId: 'us-music-discovery-root',
    nodeType: 'grade_level',
    name: 'Grade 1 Music Discovery',
    description: 'Rhythm & Melody Emergence - developing pitch recognition and rhythmic skills',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '1',
    estimatedDuration: 180,
    tags: ['grade1', 'pitch', 'melody', 'rhythm_patterns']
  },
  {
    id: 'us-music-1-pitch-melody',
    parentId: 'us-music-1-grade',
    nodeType: 'domain',
    name: 'Pitch & Melody',
    description: 'Recognize high vs. low notes; replicate simple melodies on voice or xylophone',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '1',
    estimatedDuration: 45,
    difficultyLevel: 1
  },
  {
    id: 'us-music-1-rhythmic-patterns',
    parentId: 'us-music-1-grade',
    nodeType: 'domain',
    name: 'Rhythmic Patterns',
    description: 'Perform rhythm patterns using body percussion or basic instruments',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '1',
    estimatedDuration: 45,
    difficultyLevel: 1
  },
  {
    id: 'us-music-1-singing-unison',
    parentId: 'us-music-1-grade',
    nodeType: 'domain',
    name: 'Singing in Unison',
    description: 'Sing short rounds or call-and-response songs',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '1',
    estimatedDuration: 45,
    difficultyLevel: 1
  },
  {
    id: 'us-music-1-cultural-exposure',
    parentId: 'us-music-1-grade',
    nodeType: 'domain',
    name: 'Cultural Exposure',
    description: 'Introduce folk songs, children\'s songs, or traditional songs of the country',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '1',
    estimatedDuration: 45,
    difficultyLevel: 1
  },

  // Year 3 (Grade 2): Exploring Instruments & Songs
  {
    id: 'us-music-2-grade',
    parentId: 'us-music-discovery-root',
    nodeType: 'grade_level',
    name: 'Grade 2 Music Discovery',
    description: 'Exploring Instruments & Songs - introduction to classroom instruments and basic notation',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '2',
    estimatedDuration: 180,
    tags: ['grade2', 'instruments', 'notation_basics', 'cultural_practice']
  },
  {
    id: 'us-music-2-instrument-identification',
    parentId: 'us-music-2-grade',
    nodeType: 'domain',
    name: 'Instrument Identification',
    description: 'Recognize sounds of various classroom instruments (percussion, recorder, glockenspiel)',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '2',
    estimatedDuration: 45,
    difficultyLevel: 2
  },
  {
    id: 'us-music-2-rhythm-notation-basics',
    parentId: 'us-music-2-grade',
    nodeType: 'domain',
    name: 'Rhythm & Notation Basics',
    description: 'Read and perform quarter and eighth note rhythms',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '2',
    estimatedDuration: 45,
    difficultyLevel: 2
  },
  {
    id: 'us-music-2-melody-song',
    parentId: 'us-music-2-grade',
    nodeType: 'domain',
    name: 'Melody & Song',
    description: 'Sing simple melodic songs with attention to pitch and phrase',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '2',
    estimatedDuration: 45,
    difficultyLevel: 2
  },
  {
    id: 'us-music-2-cultural-practice',
    parentId: 'us-music-2-grade',
    nodeType: 'domain',
    name: 'Cultural Practice',
    description: 'Learn a song/story in local tradition; possibly accompany with a simple instrument',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '2',
    estimatedDuration: 45,
    difficultyLevel: 2
  },

  // Year 4 (Grade 3): Ensemble & Improvisation
  {
    id: 'us-music-3-grade',
    parentId: 'us-music-discovery-root',
    nodeType: 'grade_level',
    name: 'Grade 3 Music Discovery',
    description: 'Ensemble & Improvisation - collaborative music making and creative expression',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '3',
    estimatedDuration: 180,
    tags: ['grade3', 'ensemble', 'improvisation', 'music_reading']
  },
  {
    id: 'us-music-3-ensemble-playing',
    parentId: 'us-music-3-grade',
    nodeType: 'domain',
    name: 'Ensemble Playing',
    description: 'Play unison rhythm and melody with classmates on simple instruments',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '3',
    estimatedDuration: 45,
    difficultyLevel: 2
  },
  {
    id: 'us-music-3-reading-music-basics',
    parentId: 'us-music-3-grade',
    nodeType: 'domain',
    name: 'Reading Music Basics',
    description: 'Read simple staff notation (pitch names, rhythm symbols)',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '3',
    estimatedDuration: 45,
    difficultyLevel: 2
  },
  {
    id: 'us-music-3-improvisation',
    parentId: 'us-music-3-grade',
    nodeType: 'domain',
    name: 'Improvisation',
    description: 'Create short melodic or rhythmic improvisations using limited notes',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '3',
    estimatedDuration: 45,
    difficultyLevel: 2
  },
  {
    id: 'us-music-3-cultural-traditions',
    parentId: 'us-music-3-grade',
    nodeType: 'domain',
    name: 'Cultural Traditions',
    description: 'Study local music style (folk or traditional dance music) and perform simplified version',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '3',
    estimatedDuration: 45,
    difficultyLevel: 2
  },

  // MIDDLE GRADES (4-7): Foundational Musicianship & Cultural Literacy

  // Year 5 (Grade 4): Music Notation & Song Structure
  {
    id: 'us-music-4-grade',
    parentId: 'us-music-discovery-root',
    nodeType: 'grade_level',
    name: 'Grade 4 Music Discovery',
    description: 'Music Notation & Song Structure - developing literacy and analytical skills',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '4',
    estimatedDuration: 180,
    tags: ['grade4', 'notation_skills', 'song_structure', 'cross_cultural']
  },
  {
    id: 'us-music-4-notation-skills',
    parentId: 'us-music-4-grade',
    nodeType: 'domain',
    name: 'Notation Skills',
    description: 'Read and write simple melodies and rhythms in notation',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '4',
    estimatedDuration: 45,
    difficultyLevel: 3
  },
  {
    id: 'us-music-4-singing-technique',
    parentId: 'us-music-4-grade',
    nodeType: 'domain',
    name: 'Singing Technique',
    description: 'Explore dynamic variation, phrasing, and simple harmony',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '4',
    estimatedDuration: 45,
    difficultyLevel: 3
  },
  {
    id: 'us-music-4-listening-analysis',
    parentId: 'us-music-4-grade',
    nodeType: 'domain',
    name: 'Listening Analysis',
    description: 'Identify instruments and form (verse/chorus) in recorded music',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '4',
    estimatedDuration: 45,
    difficultyLevel: 3
  },
  {
    id: 'us-music-4-cross-cultural-song-study',
    parentId: 'us-music-4-grade',
    nodeType: 'domain',
    name: 'Cross-Cultural Song Study',
    description: 'Learn songs from different regions; compare styles',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '4',
    estimatedDuration: 45,
    difficultyLevel: 3
  },

  // Year 6 (Grade 5): Ensemble & Basic Composition
  {
    id: 'us-music-5-grade',
    parentId: 'us-music-discovery-root',
    nodeType: 'grade_level',
    name: 'Grade 5 Music Discovery',
    description: 'Ensemble & Basic Composition - collaborative performance and creative composition',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '5',
    estimatedDuration: 180,
    tags: ['grade5', 'ensemble_performance', 'composition', 'regional_traditions']
  },
  {
    id: 'us-music-5-group-ensemble-performance',
    parentId: 'us-music-5-grade',
    nodeType: 'domain',
    name: 'Group Ensemble Performance',
    description: 'Play layered rhythms or melodies together on percussion/instruments',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '5',
    estimatedDuration: 45,
    difficultyLevel: 3
  },
  {
    id: 'us-music-5-composition-songwriting',
    parentId: 'us-music-5-grade',
    nodeType: 'domain',
    name: 'Composition & Songwriting',
    description: 'Write simple melodies or rhythmic pieces; use graphic or basic staff notation',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '5',
    estimatedDuration: 45,
    difficultyLevel: 3
  },
  {
    id: 'us-music-5-form-analysis',
    parentId: 'us-music-5-grade',
    nodeType: 'domain',
    name: 'Form Analysis',
    description: 'Recognize repetition and structure in songs',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '5',
    estimatedDuration: 45,
    difficultyLevel: 3
  },
  {
    id: 'us-music-5-regional-musical-traditions',
    parentId: 'us-music-5-grade',
    nodeType: 'domain',
    name: 'Regional Musical Traditions',
    description: 'Study one or more regional music styles deeply (e.g. folk dance, indigenous chant)',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '5',
    estimatedDuration: 45,
    difficultyLevel: 3
  },

  // Year 7 (Grade 6): Music Theory & Aural Skills
  {
    id: 'us-music-6-grade',
    parentId: 'us-music-discovery-root',
    nodeType: 'grade_level',
    name: 'Grade 6 Music Discovery',
    description: 'Music Theory & Aural Skills - theoretical understanding and ear training',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '6',
    estimatedDuration: 180,
    tags: ['grade6', 'music_theory', 'aural_skills', 'cultural_comparisons']
  },
  {
    id: 'us-music-6-scales-intervals',
    parentId: 'us-music-6-grade',
    nodeType: 'domain',
    name: 'Scales & Intervals',
    description: 'Understand major/minor scales and intervals by ear',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '6',
    estimatedDuration: 45,
    difficultyLevel: 4
  },
  {
    id: 'us-music-6-harmony-texture',
    parentId: 'us-music-6-grade',
    nodeType: 'domain',
    name: 'Harmony & Texture',
    description: 'Explore simple chordal accompaniments or drone backgrounds in performance',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '6',
    estimatedDuration: 45,
    difficultyLevel: 4
  },
  {
    id: 'us-music-6-ear-training',
    parentId: 'us-music-6-grade',
    nodeType: 'domain',
    name: 'Ear Training',
    description: 'Transcribe short melodies and rhythmic patterns by ear',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '6',
    estimatedDuration: 45,
    difficultyLevel: 4
  },
  {
    id: 'us-music-6-cultural-comparisons',
    parentId: 'us-music-6-grade',
    nodeType: 'domain',
    name: 'Cultural Comparisons',
    description: 'Compare musical instruments, scales, or rhythms across cultures',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '6',
    estimatedDuration: 45,
    difficultyLevel: 4
  },

  // Year 8 (Grade 7): Creative Music & Performance
  {
    id: 'us-music-7-grade',
    parentId: 'us-music-discovery-root',
    nodeType: 'grade_level',
    name: 'Grade 7 Music Discovery',
    description: 'Creative Music & Performance - advanced composition and technology integration',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '7',
    estimatedDuration: 180,
    tags: ['grade7', 'composition_projects', 'performance_ensemble', 'music_technology']
  },
  {
    id: 'us-music-7-composition-projects',
    parentId: 'us-music-7-grade',
    nodeType: 'domain',
    name: 'Composition Projects',
    description: 'Create short compositions using staff or digital notation tools',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '7',
    estimatedDuration: 45,
    difficultyLevel: 4
  },
  {
    id: 'us-music-7-performance-ensemble',
    parentId: 'us-music-7-grade',
    nodeType: 'domain',
    name: 'Performance Ensemble',
    description: 'Prepare and perform group pieces (choir, band, percussion ensemble)',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '7',
    estimatedDuration: 45,
    difficultyLevel: 4
  },
  {
    id: 'us-music-7-music-technology',
    parentId: 'us-music-7-grade',
    nodeType: 'domain',
    name: 'Music Technology',
    description: 'Use basic software or apps to record, mix, or sequence recordings',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '7',
    estimatedDuration: 45,
    difficultyLevel: 4
  },
  {
    id: 'us-music-7-world-music-appreciation',
    parentId: 'us-music-7-grade',
    nodeType: 'domain',
    name: 'World Music Appreciation',
    description: 'Explore music traditions from around the world; present on cultural context',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '7',
    estimatedDuration: 45,
    difficultyLevel: 4
  },

  // HIGH SCHOOL (8-12): Musicianship, Analysis & Cultural Leadership

  // Year 9 (Grade 8/9): Theory & Ensemble Mastery
  {
    id: 'us-music-8-grade',
    parentId: 'us-music-discovery-root',
    nodeType: 'grade_level',
    name: 'Grade 8 Music Discovery',
    description: 'Theory & Ensemble Mastery - advanced theoretical concepts and ensemble skills',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '8',
    estimatedDuration: 180,
    tags: ['grade8', 'advanced_theory', 'ensemble_mastery', 'cultural_context']
  },
  {
    id: 'us-music-8-advanced-music-theory',
    parentId: 'us-music-8-grade',
    nodeType: 'domain',
    name: 'Advanced Music Theory',
    description: 'Study chord progressions (e.g. I-IV-V), key signatures, cadences',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '8',
    estimatedDuration: 45,
    difficultyLevel: 5
  },
  {
    id: 'us-music-8-ensemble-performance',
    parentId: 'us-music-8-grade',
    nodeType: 'domain',
    name: 'Ensemble Performance',
    description: 'Participate in choir, band, or small ensemble; sight-read music',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '8',
    estimatedDuration: 45,
    difficultyLevel: 5
  },
  {
    id: 'us-music-8-aural-analysis',
    parentId: 'us-music-8-grade',
    nodeType: 'domain',
    name: 'Aural Analysis',
    description: 'Analyze melodic, harmonic, and rhythmic elements in recordings',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '8',
    estimatedDuration: 45,
    difficultyLevel: 5
  },
  {
    id: 'us-music-8-cultural-context-studies',
    parentId: 'us-music-8-grade',
    nodeType: 'domain',
    name: 'Cultural Context Studies',
    description: 'Investigate role of music in national ceremonies, festivals, or social movements',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '8',
    estimatedDuration: 45,
    difficultyLevel: 5
  },

  // Year 10 (Grade 9): Composition & Music Critique
  {
    id: 'us-music-9-grade',
    parentId: 'us-music-discovery-root',
    nodeType: 'grade_level',
    name: 'Grade 9 Music Discovery',
    description: 'Composition & Music Critique - advanced creative work and analytical skills',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '9',
    estimatedDuration: 180,
    tags: ['grade9', 'composition_techniques', 'solo_performance', 'music_critique']
  },
  {
    id: 'us-music-9-composition-techniques',
    parentId: 'us-music-9-grade',
    nodeType: 'domain',
    name: 'Composition Techniques',
    description: 'Use harmony and structure in original compositions; may integrate lyrics',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '9',
    estimatedDuration: 45,
    difficultyLevel: 5
  },
  {
    id: 'us-music-9-solo-performance',
    parentId: 'us-music-9-grade',
    nodeType: 'domain',
    name: 'Solo Performance',
    description: 'Deliver solo vocal or instrumental performance with technical confidence',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '9',
    estimatedDuration: 45,
    difficultyLevel: 5
  },
  {
    id: 'us-music-9-critique-reflection',
    parentId: 'us-music-9-grade',
    nodeType: 'domain',
    name: 'Critique & Reflection',
    description: 'Write critical reviews or analytical essays on musical works across genres',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '9',
    estimatedDuration: 45,
    difficultyLevel: 5
  },
  {
    id: 'us-music-9-musical-heritage-projects',
    parentId: 'us-music-9-grade',
    nodeType: 'domain',
    name: 'Musical Heritage Projects',
    description: 'Research and present on a local music tradition or composer',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '9',
    estimatedDuration: 45,
    difficultyLevel: 5
  },

  // Year 11 (Grade 10): Hybrid & Digital Music Creation
  {
    id: 'us-music-10-grade',
    parentId: 'us-music-discovery-root',
    nodeType: 'grade_level',
    name: 'Grade 10 Music Discovery',
    description: 'Hybrid & Digital Music Creation - technology integration and innovative composition',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '10',
    estimatedDuration: 180,
    tags: ['grade10', 'digital_production', 'fusion_innovation', 'music_leadership']
  },
  {
    id: 'us-music-10-digital-music-production',
    parentId: 'us-music-10-grade',
    nodeType: 'domain',
    name: 'Digital Music Production',
    description: 'Use DAWs (Ableton, GarageBand) to compose, record, and edit music',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '10',
    estimatedDuration: 45,
    difficultyLevel: 6
  },
  {
    id: 'us-music-10-fusion-innovation',
    parentId: 'us-music-10-grade',
    nodeType: 'domain',
    name: 'Fusion & Innovation',
    description: 'Combine traditional and modern musical styles in creative projects',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '10',
    estimatedDuration: 45,
    difficultyLevel: 6
  },
  {
    id: 'us-music-10-music-society',
    parentId: 'us-music-10-grade',
    nodeType: 'domain',
    name: 'Music & Society',
    description: 'Discuss music\'s societal, political and cultural roles (e.g. protest songs)',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '10',
    estimatedDuration: 45,
    difficultyLevel: 6
  },
  {
    id: 'us-music-10-peer-music-leadership',
    parentId: 'us-music-10-grade',
    nodeType: 'domain',
    name: 'Peer Music Leadership',
    description: 'Lead choirs, direct small ensembles, or mentor younger students',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '10',
    estimatedDuration: 45,
    difficultyLevel: 6
  },

  // Year 12 (Grade 11): Capstone Composition & Performance
  {
    id: 'us-music-11-grade',
    parentId: 'us-music-discovery-root',
    nodeType: 'grade_level',
    name: 'Grade 11 Music Discovery',
    description: 'Capstone Composition & Performance - mastery demonstration and community engagement',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '11',
    estimatedDuration: 180,
    tags: ['grade11', 'senior_composition', 'recital', 'music_research', 'advocacy']
  },
  {
    id: 'us-music-11-senior-composition',
    parentId: 'us-music-11-grade',
    nodeType: 'domain',
    name: 'Senior Composition',
    description: 'Compose an original, substantial music piece (with score or recording)',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '11',
    estimatedDuration: 45,
    difficultyLevel: 6
  },
  {
    id: 'us-music-11-solo-group-recital',
    parentId: 'us-music-11-grade',
    nodeType: 'domain',
    name: 'Solo/Group Recital',
    description: 'Plan and perform a public recital or concert',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '11',
    estimatedDuration: 45,
    difficultyLevel: 6
  },
  {
    id: 'us-music-11-music-research-presentation',
    parentId: 'us-music-11-grade',
    nodeType: 'domain',
    name: 'Music Research & Presentation',
    description: 'Present in-depth studies (local music history, genre development)',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '11',
    estimatedDuration: 45,
    difficultyLevel: 6
  },
  {
    id: 'us-music-11-music-advocacy-teaching',
    parentId: 'us-music-11-grade',
    nodeType: 'domain',
    name: 'Music Advocacy & Teaching',
    description: 'Lead community workshops, organize performances, mentor peers in musical work',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '11',
    estimatedDuration: 45,
    difficultyLevel: 6
  },

  // Grade 12 Capstone
  {
    id: 'us-music-12-grade',
    parentId: 'us-music-discovery-root',
    nodeType: 'grade_level',
    name: 'Grade 12 Music Discovery',
    description: 'Advanced Capstone & Portfolio - professional-level music creation and leadership',
    countryCode: 'US',
    subject: NELIESubject.MUSIC,
    educationalLevel: '12',
    estimatedDuration: 180,
    tags: ['grade12', 'advanced_capstone', 'professional_portfolio', 'community_leadership']
  }
];
