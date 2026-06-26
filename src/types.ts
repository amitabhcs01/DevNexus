export interface Review {
  reviewer: string;
  rating: number;
  comment: string;
  date: string;
}

export interface GitHubRepo {
  name: string;
  stars: number;
  forks: number;
  language: string;
}

export interface ProjectHistoryItem {
  client: string;
  projectName: string;
  duration: string;
  rating: number;
  feedback: string;
}

export interface Developer {
  id: string;
  name: string;
  title: string;
  avatar: string;
  bio: string;
  skills: string[];
  hourlyRate: number;
  availability: 'Available Now' | 'In 1 Week' | 'In 2 Weeks' | 'Unavailable';
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  gitHubUsername: string;
  githubRepos: GitHubRepo[];
  projectHistory: ProjectHistoryItem[];
  verified: boolean;
  niche: string;
}

export interface ProjectBrief {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  estimatedCost: string;
  estimatedTimeline: string;
  architecture: string;
  features: string[];
  risks: { risk: string; mitigation: string }[];
}

export interface NDA {
  partyA: string;
  partyB: string;
  ndaType: string;
  ipClauses: string;
  confidentialityPeriod: string;
  jurisdiction: string;
  signedByA: boolean;
  signedByB: boolean;
  signatureA: string;
  signatureB: string;
  date: string;
}

export interface ChatMessage {
  id: string;
  sender: 'PartyA' | 'PartyB' | 'System';
  senderName: string;
  text: string;
  timestamp: string;
  isEncrypted: boolean;
}

export interface EphemeralFile {
  name: string;
  size: string;
  type: string;
  contentMock: string;
}
