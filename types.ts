
export enum Difficulty {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2'
}

export enum GameState {
  INTRO = 'INTRO',
  MENU = 'MENU',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  RESULTS = 'RESULTS'
}

export interface WordChallenge {
  arabic: string;
  english: string;
}

export interface PlayerRecord {
  challenge: WordChallenge;
  playerAnswer: string;
  isCorrect: boolean;
  timeTaken: number;
}

export interface GameConfig {
  difficulty: Difficulty;
  timePerWord: number;
}
