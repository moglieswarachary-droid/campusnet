export interface ResearchPublication {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi: string;
  abstract: string;
  datasetLink?: string;
  tags: string[];
  citations: number;
  collabOpen: boolean;
  institution?: string;
}

export interface ResearchConference {
  id: string;
  title: string;
  organizer: string;
  venue: string;
  city: string;
  state: string;
  dates: string;
  submissionDeadline: string;
  tracks: string[];
  mode: 'Offline' | 'Online' | 'Hybrid';
  indexType: string;
  registrationUrl: string;
}
