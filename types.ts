
export interface WheelItem {
  id: string;
  text: string;
  color: string;
}

export enum GameState {
  IDLE = 'IDLE',
  SPINNING = 'SPINNING',
  CELEBRATING = 'CELEBRATING'
}
