import { registerGame } from './registry';
import budgetBreaker from './budgetBreaker';
import posterLayout from './posterLayout';
import bomBuilder from './bomBuilder';
import coldChain from './coldChainCheck';
import phraseBuilder from './phraseBuilder';
import queueManager from './queueManager';
import allergenAdvisor from './allergenAdvisor';
import speedPitch from './speedPitch';

[
  budgetBreaker, 
  posterLayout, 
  bomBuilder, 
  coldChain, 
  phraseBuilder, 
  queueManager, 
  allergenAdvisor, 
  speedPitch
].forEach(registerGame);