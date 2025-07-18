
import OpenAI from 'openai';
import { Universe } from './UniverseGenerator';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const openAIService = {
  async generateUniverse(prompt: string, signal?: AbortSignal): Promise<Universe> {
    console.log('🤖 OpenAI Service: Generating universe with prompt:', typeof prompt === 'string' ? prompt.substring(0, 100) + '...' : prompt);
    
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error('❌ OpenAI API key not found in environment variables');
      throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your environment variables.');
    }

    console.log('🔑 OpenAI API key found, length:', apiKey.length);

    try {
      const systemPrompt = `You are an expert educational content creator. Generate a themed learning universe for students based on their profile. Always respond with valid JSON only.

The response must follow this exact structure:
{
  "id": "unique-id",
  "title": "Universe Title",
  "description": "Engaging description",
  "theme": "Detailed theme description",
  "objectives": [
    {
      "id": "unique-objective-id",
      "name": "Objective Name",
      "description": "What students will learn",
      "subjectName": "Subject",
      "educationalLevel": "Grade Level"
    }
  ]
}`;

      const userPrompt = typeof prompt === 'string' 
        ? `Create a learning universe with this theme: ${prompt}`
        : `Create a learning universe for this student profile: ${JSON.stringify(prompt)}. Include 2-3 learning objectives appropriate for their grade level and interests.`;

      console.log('📤 Sending request to OpenAI API...');

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 1000
      }, {
        signal
      });

      console.log('📥 Received response from OpenAI API');

      const content = completion.choices[0].message.content;
      if (!content) {
        throw new Error('No content received from OpenAI');
      }

      console.log('📝 Raw OpenAI response:', content.substring(0, 200) + '...');

      // Clean and parse JSON response
      const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
      const parsedUniverse = JSON.parse(cleanedContent);

      // Validate the response structure
      if (!parsedUniverse.title || !parsedUniverse.description) {
        throw new Error('Invalid universe structure received from OpenAI');
      }

      // Ensure objectives array exists
      if (!parsedUniverse.objectives) {
        parsedUniverse.objectives = [];
      }

      console.log('✅ Successfully generated universe:', parsedUniverse.title);

      return parsedUniverse;

    } catch (error) {
      console.error('❌ OpenAI API call failed:', error);
      
      if (error.name === 'AbortError') {
        console.log('🛑 Request was aborted');
        throw error;
      }
      
      // Re-throw the error instead of using fallback
      throw new Error(`OpenAI universe generation failed: ${error.message}`);
    }
  },
};
