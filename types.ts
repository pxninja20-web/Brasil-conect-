
export enum Tab {
  HOME = 'home',
  CALLS = 'calls',
  INBOX = 'inbox',
  AI = 'ai',
  PROFILE = 'profile'
}

export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
}

export interface Call {
  id: string;
  number: string;
  duration: string;
  type: 'incoming' | 'outgoing' | 'missed';
  timestamp: Date;
}

export interface UserProfile {
  uid: string;
  socialId: string;
  virtualNumber: string | null;
  credits: number;
  status: 'active' | 'suspended';
}
