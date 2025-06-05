
import { LessonActivity } from '../types/LessonTypes';
import { createWelcomeActivity } from '../utils/welcomeActivityGenerator';

export const createScienceLesson = (): LessonActivity[] => [
  createWelcomeActivity('science'),
  {
    id: 'science-explanation-1',
    type: 'explanation',
    title: 'Animal Habitats',
    duration: 8,
    content: {
      text: 'A habitat is where an animal lives and finds everything it needs - food, water, shelter, and space. Different animals need different types of homes! Think of it like your bedroom - you have everything you need there!'
    }
  },
  {
    id: 'science-question-1',
    type: 'question',
    title: 'Where Do Animals Live?',
    duration: 25,
    content: {
      question: 'Where would you most likely find a polar bear living?',
      options: ['Hot desert', 'Arctic ice and snow', 'Tropical rainforest', 'Deep ocean'],
      correct: 1,
      explanation: 'Fantastic! Polar bears live in the Arctic where there is lots of ice and snow. Their thick fur keeps them warm in the freezing cold!'
    }
  },
  {
    id: 'science-game-1',
    type: 'game',
    title: 'Animal Habitat Match',
    duration: 30,
    content: {
      question: 'Match the animal to its habitat! Which animal lives in the ocean?',
      options: ['Lion', 'Dolphin', 'Eagle', 'Rabbit'],
      correct: 1,
      explanation: 'Great job! Dolphins live in the ocean and are amazing swimmers. They can hold their breath for a long time underwater!'
    }
  },
  {
    id: 'science-explanation-2',
    type: 'explanation',
    title: 'What Plants Need',
    duration: 8,
    content: {
      text: 'Plants are living things just like us! They need four important things to grow: sunlight for energy, water to drink, air to breathe, and nutrients from soil to stay healthy. Just like you need food, water, and air!'
    }
  },
  {
    id: 'science-question-2',
    type: 'question',
    title: 'Plant Needs',
    duration: 25,
    content: {
      question: 'What do plants need to grow healthy and strong?',
      options: ['Only water', 'Only sunlight', 'Sunlight, water, air, and nutrients', 'Only soil'],
      correct: 2,
      explanation: 'Perfect! Plants need sunlight, water, air, and nutrients from soil - just like how you need food, water, and air to grow big and strong!'
    }
  },
  {
    id: 'science-game-2',
    type: 'game',
    title: 'Weather Detective',
    duration: 30,
    content: {
      question: 'What type of weather brings rain?',
      options: ['Sunny and clear', 'Cloudy and gray', 'Snowy and cold', 'Windy and dry'],
      correct: 1,
      explanation: 'Excellent detective work! Cloudy, gray skies often bring rain. The clouds are full of tiny water droplets that fall as rain!'
    }
  },
  {
    id: 'science-explanation-3',
    type: 'explanation',
    title: 'The Water Cycle',
    duration: 10,
    content: {
      text: 'Water goes on an amazing journey! The sun heats up water in oceans and lakes, turning it into invisible water vapor that rises up. When it gets high and cold, it turns back into water droplets that make clouds. Then it falls as rain and starts the journey all over again!'
    }
  },
  {
    id: 'science-question-3',
    type: 'question',
    title: 'Water Cycle Magic',
    duration: 25,
    content: {
      question: 'What happens when the sun heats up water in the ocean?',
      options: ['It turns to ice', 'It becomes water vapor and rises up', 'It stays the same', 'It becomes heavier'],
      correct: 1,
      explanation: 'Amazing! When the sun heats water, it evaporates and becomes invisible water vapor that floats up into the sky. This is how clouds are made!'
    }
  },
  {
    id: 'science-game-3',
    type: 'game',
    title: 'Human Body Explorer',
    duration: 30,
    content: {
      question: 'Which part of your body pumps blood throughout your whole body?',
      options: ['Brain', 'Heart', 'Lungs', 'Stomach'],
      correct: 1,
      explanation: 'Wonderful! Your heart is like a powerful pump that beats about 100,000 times every day to send blood all around your body!'
    }
  },
  {
    id: 'science-explanation-4',
    type: 'explanation',
    title: 'Healthy Bodies',
    duration: 8,
    content: {
      text: 'Your body is amazing! Your heart pumps blood, your lungs help you breathe, your brain controls everything, and your muscles help you move. Taking care of your body with good food, exercise, and sleep keeps you healthy and strong!'
    }
  },
  {
    id: 'science-question-4',
    type: 'question',
    title: 'Staying Healthy',
    duration: 25,
    content: {
      question: 'What are three important ways to keep your body healthy?',
      options: ['Sleeping all day', 'Eating good food, exercising, and getting enough sleep', 'Only eating candy', 'Never moving around'],
      correct: 1,
      explanation: 'Perfect! Eating nutritious food, staying active with exercise, and getting good sleep are the three super important ways to keep your amazing body healthy!'
    }
  },
  {
    id: 'science-game-4',
    type: 'game',
    title: 'Space Adventure',
    duration: 35,
    content: {
      question: 'Which is the closest star to Earth?',
      options: ['The Moon', 'The Sun', 'Mars', 'Jupiter'],
      correct: 1,
      explanation: 'Brilliant! The Sun is actually a star - our closest star! It gives us light and warmth every day. The Moon is not a star, it\'s Earth\'s natural satellite!'
    }
  }
];
