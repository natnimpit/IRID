export enum MemoType {
  PUBLICATION_REWARD = '1-memo',
  TIME_EXEMPTION = '2-memo',
  CONFERENCE_SUPPORT = '3-memo',
  PAGE_CHARGE = '7-memo',
}

export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  INCOMPLETE = 'incomplete',
  REJECTED = 'rejected',
}

export interface ResearchRequest {
  id: string;
  userId: string;
  userName: string;
  role: 'faculty' | 'admin';
  memoType: MemoType;
  academicYear: string;
  driveFolderLink: string;
  status: RequestStatus;
  calculatedAmount?: number;
  submittedAt: string;
  memoData: any; // Type-safe data per memo
  reviewNotes?: string;
}

export interface PublicationRewardData {
  title: string;
  journalName: string;
  indexing: 'TCI-1' | 'TCI-2' | 'Scopus-Q1' | 'Scopus-Q2' | 'Scopus-Q3' | 'Scopus-Q4';
  hasImpactFactor: boolean;
  impactFactorValue?: number;
  publishedDate: string;
}

export interface TimeExemptionData {
  title: string;
  publisherName: string;
  authorRole: 'First' | 'Corresponding' | 'Other';
}

export interface ConferenceSupportData {
  conferenceName: string;
  location: 'National' | 'International';
  occurence: '1st' | '2nd';
  indexing: 'Scopus' | 'SJR' | 'Other';
}

export interface PageChargeData {
  title: string;
  journalName: string;
  amountRequested: number;
}
