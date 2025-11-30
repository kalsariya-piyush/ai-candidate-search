import { create } from 'zustand';
import { Candidate, SearchFilters } from '@/lib/api';

interface SearchState {
  query: string;
  filters: SearchFilters;
  results: Candidate[];
  loading: boolean;
  currentStage: number;
  stages: string[];
  credits: number;
  setQuery: (query: string) => void;
  setFilters: (filters: SearchFilters) => void;
  setResults: (results: Candidate[]) => void;
  setLoading: (loading: boolean) => void;
  setCurrentStage: (stage: number) => void;
  setCredits: (credits: number) => void;
  reset: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  filters: {},
  results: [],
  loading: false,
  currentStage: 0,
  stages: [
    'Fetching profiles',
    'Semantic search and LLM match',
    'Ranking and scoring',
    'Preparing insights'
  ],
  credits: 100,
  setQuery: (query) => set({ query }),
  setFilters: (filters) => set({ filters }),
  setResults: (results) => set({ results }),
  setLoading: (loading) => set({ loading }),
  setCurrentStage: (currentStage) => set({ currentStage }),
  setCredits: (credits) => set({ credits }),
  reset: () => set({ query: '', filters: {}, results: [], loading: false, currentStage: 0 }),
}));
