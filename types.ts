
export interface MenuItem {
  id: string;
  name: string;
}

export type RouletteState = 'idle' | 'spinning' | 'slowing' | 'finished';
