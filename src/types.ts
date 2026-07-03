export type PulseType = 'update' | 'blocker' | 'win';

export interface Pulse {
  id: string;
  author: string;
  message: string;
  type: PulseType;
  createdAt: string; // ISO timestamp
  read: boolean;
}

export type FetchStatus = 'idle' | 'loading' | 'success' | 'error';
