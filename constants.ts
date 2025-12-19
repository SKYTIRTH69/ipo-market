import { IPOData, IPOStatus, Registrar } from './types';

// Your provided Google Sheet CSV export URL
export const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1M2oDbuBU20Iyxgq_cKpjgk0WCu-8xxGQcnKhlM0Mq9I/export?format=csv'; 

export const REGISTRAR_URLS: Record<string, string> = {
  [Registrar.LINKINTIME]: 'https://linkintime.co.in/initial_offer/public-issues.html',
  [Registrar.KFINTECH]: 'https://ris.kfintech.com/ipostatus/',
  [Registrar.BIGSHARE]: 'https://www.bigshareonline.com/ipo_Allotment.html',
  [Registrar.BSE]: 'https://www.bseindia.com/investors/appli_check.aspx',
};

// Initial fallback data mirroring your Google Sheet screenshot
export const INITIAL_IPO_DATA: IPOData[] = [
  {
    id: 'init-1',
    name: 'ICICI Prudential AMC',
    registrar: 'KFin Tech',
    status: IPOStatus.CLOSED,
    gmp: '₹450',
    subscription: '39.17x',
    allotmentDate: '12/17/2025',
    source: 'Hardcoded'
  },
  {
    id: 'init-2',
    name: 'InfraBuild India',
    registrar: 'MAS Services Ltd.',
    status: IPOStatus.ALLOTMENT_OUT, // Mapped from "Allotted"
    gmp: '₹180',
    subscription: '35.6x',
    allotmentDate: '11/18/2025',
    source: 'Hardcoded'
  },
  {
    id: 'init-3',
    name: 'KSH International',
    registrar: 'Link Intime',
    status: IPOStatus.CLOSED,
    gmp: '₹0',
    subscription: '0.80x',
    allotmentDate: '12/19/2025',
    source: 'Hardcoded'
  },
  {
    id: 'init-4',
    name: 'MediaVerse Studios',
    registrar: 'Karvy Fintech Pvt. Ltd.',
    status: 'Pending Listing',
    gmp: '₹15',
    subscription: '8.7x',
    allotmentDate: '12/28/2025',
    source: 'Hardcoded'
  },
  {
    id: 'init-5',
    name: 'Exim Routes (SME)',
    registrar: 'Bigshare',
    status: IPOStatus.CLOSED,
    gmp: '-',
    subscription: '14.06x',
    allotmentDate: '12/17/2025',
    source: 'Hardcoded'
  },
  {
    id: 'init-6',
    name: 'Neptune Logitek (SME)',
    registrar: 'Maashitla',
    status: IPOStatus.CLOSED,
    gmp: '0',
    subscription: '-',
    allotmentDate: '12/18/2025',
    source: 'Hardcoded'
  },
  {
    id: 'init-7',
    name: 'Stanbik Agro (SME)',
    registrar: 'Skyline',
    status: IPOStatus.CLOSED,
    gmp: '-',
    subscription: '-',
    allotmentDate: '12/17/2025',
    source: 'Hardcoded'
  }
];

export const REGISTRAR_OPTIONS = [
  Registrar.LINKINTIME,
  Registrar.KFINTECH,
  Registrar.BIGSHARE,
  Registrar.BSE,
];