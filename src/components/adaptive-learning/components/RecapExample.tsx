/**
 * Example component demonstrating how to use the new recap functionality
 * This shows how students can review questions they've answered before
 */

import React from 'react';
import { useQuestionManager } from './QuestionManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RecapExampleProps {
  subject: string;
  skillArea: string;
  difficultyLevel: number;
  userId: string;
}

const RecapExample: React.FC<RecapExampleProps> = ({
  subject,
  skillArea,
  difficultyLevel,
  userId
}) => {
  const {
    sessionQuestions,
    currentQuestionIndex,
    answers,
    isGenerating,
    generateNextQuestion,
    generateRecapQuestion, // New method for recap questions
    handleAnswerSelect,
    resetQuestions
  } = useQuestionManager({
    subject,
    skillArea,
    difficultyLevel,
    userId,
    totalQuestions: 5,
    allowRecap: true // Enable recap functionality
  });

  const currentQuestion = sessionQuestions[currentQuestionIndex];
  const hasAnswered = answers.length > currentQuestionIndex;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Learning Session with Recap
            <div className="text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of {sessionQuestions.length}
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Control buttons */}
          <div className="flex gap-4">
            <Button 
              onClick={generateNextQuestion}
              disabled={isGenerating}
              variant="default"
            >
              {isGenerating ? 'Generating...' : 'Generate New Question'}
            </Button>
            
            <Button 
              onClick={generateRecapQuestion}
              disabled={isGenerating}
              variant="outline"
            >
              Generate Recap Question
            </Button>
            
            <Button 
              onClick={resetQuestions}
              variant="secondary"
            >
              Reset Session
            </Button>
          </div>

          {/* Question display */}
          {currentQuestion && (
            <Card className="bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {currentQuestion.question}
                  {currentQuestion.isRecap && (
                    <span className="text-sm bg-yellow-200 px-2 py-1 rounded">
                      📚 Recap Question
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={hasAnswered}
                      variant={
                        hasAnswered && index === currentQuestion.correct
                          ? 'default'
                          : hasAnswered && index === answers[currentQuestionIndex]
                          ? 'destructive'
                          : 'outline'
                      }
                      className="w-full text-left justify-start"
                    >
                      {String.fromCharCode(65 + index)}. {option}
                    </Button>
                  ))}
                </div>
                
                {hasAnswered && (
                  <div className="mt-4 p-4 bg-gray-100 rounded">
                    <h4 className="font-semibold">Explanation:</h4>
                    <p>{currentQuestion.explanation}</p>
                    {currentQuestion.isRecap && (
                      <p className="text-sm text-blue-600 mt-2">
                        💡 This was a recap question to help reinforce your learning!
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card className="bg-green-50">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-green-800 mb-2">
                How Recap Questions Work:
              </h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Normal questions cannot be repeated within a session</li>
                <li>• Recap questions can repeat previously answered questions</li>
                <li>• Recap questions are marked with a 📚 badge</li>
                <li>• Students need to answer at least 5 questions correctly to unlock recap</li>
                <li>• Recap questions help reinforce learning and build confidence</li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecapExample;