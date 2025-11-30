import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Candidate {
  id: string;
  name: string;
  title: string;
  company: string;
  experience: number;
  location: string;
  skills: string[];
  availability: string;
  imageUrl?: string;
  matchScore?: number;
  strengths?: string[];
  areasToProbe?: string[];
  verdict?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  about?: string;
  education?: Education[];
  workHistory?: WorkHistory[];
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface WorkHistory {
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface SearchFilters {
  experience?: number;
  location?: string;
  skills?: string[];
}

export interface SearchResponse {
  results: Candidate[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  creditsRemaining: number;
}

export interface Campaign {
  id: string;
  name: string;
  type: string;
  status: string;
  createdAt: string;
  steps: CampaignStep[];
  stats?: {
    sent: number;
    opened: number;
    replied: number;
    deliveryRate: number;
    openRate: number;
    replyRate: number;
  };
}

export interface CampaignStep {
  id?: string;
  order?: number;
  subject?: string;
  content: string;
  delayDays: number;
}

export const candidatesApi = {
  search: (query: string, filters?: SearchFilters, page = 1, limit = 12) =>
    api.post<SearchResponse>('/api/candidates/search', { query, filters, page, limit }),
  
  getById: (id: string) =>
    api.get<Candidate>(`/api/candidates/${id}`),
  
  shortlist: (id: string, liked = true) =>
    api.post(`/api/candidates/${id}/shortlist`, { liked }),
  
  unlock: (id: string) =>
    api.get(`/api/candidates/${id}/unlock`),
  
  getShortlisted: () =>
    api.get('/api/candidates/shortlisted/list'),
};

export const campaignsApi = {
  list: () =>
    api.get<Campaign[]>('/api/campaigns'),
  
  create: (data: { name: string; type: string; steps: CampaignStep[] }) =>
    api.post<Campaign>('/api/campaigns', data),
  
  update: (id: string, data: Partial<Campaign>) =>
    api.put<Campaign>(`/api/campaigns/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/api/campaigns/${id}`),
  
  getAnalytics: (id: string) =>
    api.get(`/api/campaigns/${id}/analytics`),
};

export default api;
