import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Simple local storage persistence
const STORAGE_KEY = 'bu_research_requests';

export const storage = {
  getRequests: (): any[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to read from local storage', e);
      return [];
    }
  },
  saveRequest: (request: any) => {
    const requests = storage.getRequests();
    const index = requests.findIndex((r: any) => r.id === request.id);
    if (index > -1) {
      requests[index] = request;
    } else {
      requests.push(request);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  },
  deleteRequest: (id: string) => {
    const requests = storage.getRequests().filter((r: any) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  }
};
