import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface GameProps {
  game: any;
}

const Game: React.FC<GameProps> = ({ game }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{game.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{game.description}</p>
        <Button onClick={() => window.open(game.url, '_blank')}>Play Game</Button>
      </CardContent>
    </Card>
  );
};

export default Game;
