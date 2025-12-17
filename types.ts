export interface ColorInfo {
  hex: string;
  name: string;
  description: string;
  rgb?: string; // We can calculate this or ask AI
  hsl?: string; // We can calculate this
}

export interface Palette {
  id: string;
  name: string;
  description: string;
  colors: ColorInfo[];
  createdAt: number;
}

export enum GeneratorStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}