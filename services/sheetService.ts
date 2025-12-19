import { IPOData, IPOStatus } from '../types';

// Helper to map spreadsheet terms to App Enums for better UI coloring
const normalizeStatus = (rawStatus: string): string => {
  const lower = rawStatus?.toLowerCase().trim() || '';
  
  if (lower === 'allotted' || lower.includes('allotment out')) return IPOStatus.ALLOTMENT_OUT;
  if (lower === 'closed') return IPOStatus.CLOSED;
  if (lower === 'open') return IPOStatus.OPEN;
  if (lower === 'upcoming') return IPOStatus.UPCOMING;
  if (lower === 'listed') return IPOStatus.LISTED;
  
  // Return original if no match (e.g. "Pending Listing")
  return rawStatus;
};

export const fetchSheetData = async (csvUrl: string): Promise<IPOData[]> => {
  if (!csvUrl) return [];

  try {
    // CRITICAL: Append a random timestamp to bypass browser caching
    // Google Sheets updates can still take ~5 mins to propagate on their server,
    // but this ensures the browser always asks for the latest version available.
    const separator = csvUrl.includes('?') ? '&' : '?';
    const urlWithCacheBuster = `${csvUrl}${separator}_cb=${Date.now()}`;

    const response = await fetch(urlWithCacheBuster);
    
    if (!response.ok) {
        throw new Error(`Failed to fetch sheet (Status: ${response.status})`);
    }
    
    const text = await response.text();
    
    // Safety check: If the sheet is not public, Google returns an HTML login page.
    if (text.trim().startsWith('<!DOCTYPE html>') || text.includes('<html')) {
        throw new Error("Google Sheet access denied. Ensure the sheet is public (Viewer).");
    }

    const rows = text.split('\n').slice(1); // Skip header

    // Expected CSV Order: Name, Registrar, Status, GMP, Subscription, Allotment Date, Registrar URL
    return rows.map((row, index) => {
      // Simple regex for CSV splitting that handles quotes roughly
      const columns = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/^"|"$/g, '').trim());
      
      if (columns.length < 2) return null;

      const [name, registrar, statusRaw, gmp, subscription, allotmentDate, registrarUrl] = columns;

      // Skip empty rows
      if (!name) return null;

      return {
        id: `sheet-${index}-${Date.now()}`,
        name: name || 'Unknown IPO',
        registrar: registrar || 'Unknown',
        status: normalizeStatus(statusRaw || IPOStatus.UPCOMING),
        gmp: gmp || 'N/A',
        subscription: subscription || 'N/A',
        allotmentDate: allotmentDate || '',
        registrarUrl: registrarUrl || '',
        source: 'Sheet'
      } as IPOData;
    }).filter((item): item is IPOData => item !== null);

  } catch (error) {
    // Re-throw so the UI component can handle the notification
    throw error;
  }
};