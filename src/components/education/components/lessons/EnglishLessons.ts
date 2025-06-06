
import { LessonActivity } from '../types/LessonTypes';
import { createWelcomeActivity } from '../utils/welcomeActivityGenerator';

export const createEnglishLesson = (): LessonActivity[] => [
  createWelcomeActivity('english'),
  {
    id: 'english-explanation-1',
    type: 'explanation',
    title: 'Understanding Words and Their Jobs',
    duration: 8,
    content: {
      text: 'Every word in English has a special job! Nouns are naming words for people, places, and things. Verbs are action words that tell us what someone is doing. Adjectives describe and give us more details about nouns.'
    }
  },
  {
    id: 'english-question-1',
    type: 'question',
    title: 'Identifying Nouns',
    duration: 25,
    content: {
      question: 'Look at this sentence: "The happy dog ran quickly through the beautiful garden." Which word is a NOUN?',
      options: ['happy', 'dog', 'ran', 'quickly'],
      correctAnswer: 1,
      explanation: 'Excellent! "Dog" is a noun because it names an animal. Nouns are words that name people, places, things, or animals!'
    }
  },
  {
    id: 'english-explanation-2',
    type: 'explanation',
    title: 'Action Words - Verbs',
    duration: 8,
    content: {
      text: 'Verbs are the action heroes of sentences! They tell us what is happening. Words like "run," "jump," "think," and "sing" are all verbs because they show action or being.'
    }
  },
  {
    id: 'english-question-2',
    type: 'question',
    title: 'Finding Action Words',
    duration: 25,
    content: {
      question: 'In the sentence "Sarah carefully painted a colorful picture," which word is the VERB?',
      options: ['Sarah', 'carefully', 'painted', 'colorful'],
      correctAnswer: 2,
      explanation: 'Perfect! "Painted" is the verb because it tells us what action Sarah was doing. Verbs show what someone or something is doing!'
    }
  },
  {
    id: 'english-game-1',
    type: 'game',
    title: 'Word Detective Challenge',
    duration: 30,
    content: {
      question: 'You\'re a word detective! In this sentence: "The clever cat silently climbed the tall tree," find the ADJECTIVE that describes the cat.',
      options: ['clever', 'silently', 'climbed', 'tall'],
      correctAnswer: 0,
      explanation: 'Amazing detective work! "Clever" is an adjective that describes what kind of cat it is. Adjectives give us more information about nouns!'
    }
  },
  {
    id: 'english-question-3',
    type: 'question',
    title: 'Reading Comprehension Adventure',
    duration: 30,
    content: {
      question: 'Read this mini-story: "Emma discovered a mysterious book in the old library. When she opened it, magical words floated out like butterflies." What did the words look like?',
      options: ['flowers', 'butterflies', 'birds', 'stars'],
      correctAnswer: 1,
      explanation: 'Wonderful reading! The story says the magical words "floated out like butterflies." This is called a simile - comparing two things using "like" or "as"!'
    }
  },
  {
    id: 'english-explanation-3',
    type: 'explanation',
    title: 'Building Better Sentences',
    duration: 8,
    content: {
      text: 'Great sentences have interesting words! Instead of saying "big," we can say "enormous," "gigantic," or "massive." Using exciting vocabulary makes our writing come alive and helps readers picture exactly what we mean.'
    }
  },
  {
    id: 'english-question-4',
    type: 'question',
    title: 'Vocabulary Power-Up',
    duration: 25,
    content: {
      question: 'Which word means the same as "very happy" but sounds more exciting?',
      options: ['sad', 'okay', 'ecstatic', 'tired'],
      correctAnswer: 2,
      explanation: 'Fantastic choice! "Ecstatic" means extremely happy or joyful. Using powerful vocabulary words like this makes your writing and speaking much more interesting!'
    }
  }
];
