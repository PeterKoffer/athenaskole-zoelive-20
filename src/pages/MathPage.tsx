import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MathPage = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);

        console.log('Fetching questions...');

        const { data, error } = await supabase.functions.invoke('generate-question', {
          body: {
            subject: 'mathematics',
            skillArea: 'arithmetic',
            gradeLevel: 4,
          },
        });

        if (error) {

          console.error('Error fetching questions:', error);
          throw new Error(error.message);
        }

        console.log('Questions data:', data);
        setQuestions(data ? data.questions : []);
      } catch (err: any) {
        console.error('An error occurred:', err);

        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleOptionClick = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    if (optionIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      alert(`You have completed the quiz! Your score is ${score}/${questions.length}`);
      navigate('/training-ground');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No questions found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>
              Question {currentQuestion + 1} of {questions.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-lg mb-4">{questions[currentQuestion].question}</p>
              <div className="grid grid-cols-1 gap-4">
                {questions[currentQuestion].options.map((option: string, index: number) => (
                  <Button
                    key={index}
                    variant={selectedOption === index ? (index === questions[currentQuestion].correct ? 'default' : 'destructive') : 'outline'}
                    onClick={() => handleOptionClick(index)}
                    disabled={selectedOption !== null}
                  >
                    {option}
                  </Button>
                ))}
              </div>
              {selectedOption !== null && (
                <div className="mt-4">
                  <p className="text-lg">{questions[currentQuestion].explanation}</p>
                  <Button onClick={handleNextQuestion} className="mt-4">
                    Next
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MathPage;
