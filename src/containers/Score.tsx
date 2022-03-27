import React, { FC, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@store/hooks';
import { Score as ScoreComponent } from '@components/Score/Score';
import { loadScore, saveScore } from 'util/localStorage';
import { evalGameActions } from '@store/slices';

export interface ScoreComponentProps {
  gameKey: string;
}

export const Score: FC<ScoreComponentProps> = ({ gameKey }) => {
  const {
    evalGameStore: { currentScore: evalCurrentScore, maxScore: evalMaxScore },
    catGameStore: { currentScore: catCurrentScore, maxScore: catMaxScore },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  const maxScore = gameKey === 'catGame' ? catMaxScore : evalMaxScore;
  const currentScore = gameKey === 'catGame' ? catCurrentScore : evalCurrentScore;

  useEffect(() => {
    const maxScore = loadScore(gameKey);
    if (maxScore > 0) {
      dispatch(evalGameActions.setMaxScore(maxScore));
    }
  }, []);

  useEffect(() => {
    if (currentScore > maxScore) {
      dispatch(evalGameActions.setMaxScore(currentScore));
      saveScore(currentScore, gameKey);
    }
  }, [currentScore]);

  return <ScoreComponent currentScore={currentScore} maxScore={maxScore} />;
};