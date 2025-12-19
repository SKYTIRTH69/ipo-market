export enum IPOStatus {
  UPCOMING = 'Upcoming',
  OPEN = 'Open',
  CLOSED = 'Closed',
  ALLOTMENT_OUT = 'Allotment Out',
  LISTED = 'Listed'
}

export enum Registrar {
  LINKINTIME = 'Link Intime',
  KFINTECH = 'KFintech',
  BIGSHARE = 'Bigshare',
  BSE = 'BSE',
  UNKNOWN = 'Unknown'
}

export interface IPOData {
  id: string;
  name: string;
  registrar: Registrar | string;
  status: IPOStatus | string;
  gmp: string; // Grey Market Premium
  subscription: string; // e.g. "50x"
  allotmentDate?: string;
  listingDate?: string;
  priceBand?: string;
  source?: 'AI' | 'Hardcoded' | 'Manual' | 'Sheet';
  registrarUrl?: string; // Custom URL from sheet
}

export interface GroundingSource {
  title: string;
  url: string;
  snippet?: string;
}

export interface MarketFeedItem {
  headline: string;
  source: string;
  url: string;
  timestamp: string;
}