'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { candidatesApi, Candidate } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Upload, Loader2 } from 'lucide-react';
import CandidateCard from '@/components/CandidateCard';
import CandidateModal from '@/components/CandidateModal';
import SearchLoader from '@/components/SearchLoader';
import { useSearchStore } from '@/store/useSearchStore';

import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function SearchPage() {
  const [searchInput, setSearchInput] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'matches' | 'shortlisted'>('matches');
  
  const { query, setQuery, results, setResults, loading, setLoading, credits, setCredits } = useSearchStore();

  const { data: searchData, refetch, isFetching } = useQuery({
    queryKey: ['candidates', query, currentPage],
    queryFn: async () => {
      if (!query) return null;
      setLoading(true);
      
      // Simulate multi-stage loading
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await candidatesApi.search(query, {}, currentPage, 12);
      setResults(response.data.results);
      setCredits(response.data.creditsRemaining);
      setLoading(false);
      
      return response.data;
    },
    enabled: false,
  });

  const { data: shortlistedData } = useQuery({
    queryKey: ['shortlisted'],
    queryFn: async () => {
      const response = await candidatesApi.getShortlisted();
      return response.data;
    },
    enabled: activeTab === 'shortlisted',
  });

  const handleSearch = () => {
    if (searchInput.trim()) {
      setQuery(searchInput);
      setCurrentPage(1);
      refetch();
    }
  };

  const displayedCandidates = activeTab === 'matches' ? results : shortlistedData || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-background" />
              </div>
              <span className="font-bold text-xl">RecruitAI</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 rounded-full border text-sm font-medium">
              {credits} Credits
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Find Candidates</h1>
          <p className="text-muted-foreground">Search using natural language to discover the perfect match</p>
        </div>

        {/* Search Bar */}
        <div className="border rounded-2xl p-6 mb-8 bg-card">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="e.g., Senior React developer with 5+ years experience in San Francisco"
                className="pl-12 h-14 text-base rounded-xl border-2 focus-visible:ring-0 focus-visible:border-foreground"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={isFetching || loading} size="lg" className="h-14 px-8 rounded-xl">
              {isFetching || loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Searching
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Search
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="rounded-full">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <Upload className="mr-2 h-4 w-4" />
              Upload JD
            </Button>
            <div className="h-4 w-px bg-border mx-2" />
            {['Senior Frontend Developer', 'Full Stack Engineer', 'DevOps Specialist'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setSearchInput(suggestion);
                  setQuery(suggestion);
                  refetch();
                }}
                className="px-4 py-1.5 text-sm border rounded-full hover:bg-accent transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && <SearchLoader />}

        {/* Tabs */}
        {!loading && results.length > 0 && (
          <div className="mb-8">
            <div className="border-b">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab('matches')}
                  className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                    activeTab === 'matches'
                      ? 'border-foreground text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Matches ({results.length})
                </button>
                <button
                  onClick={() => setActiveTab('shortlisted')}
                  className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                    activeTab === 'shortlisted'
                      ? 'border-foreground text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Shortlisted
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {!loading && displayedCandidates.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {displayedCandidates.map((candidate: any) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  onClick={() => setSelectedCandidate(candidate)}
                />
              ))}
            </div>

            {/* Pagination */}
            {activeTab === 'matches' && searchData && (
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center px-4">
                  Page {currentPage} of {searchData.pagination.totalPages}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={currentPage === searchData.pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && query && (
          <div className="text-center py-20 border rounded-2xl bg-card">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No candidates found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Initial State */}
        {!loading && results.length === 0 && !query && (
          <div className="text-center py-20 border rounded-2xl bg-card">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Start your search</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter a job description or requirements to find the perfect candidates
            </p>
          </div>
        )}
      </div>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <CandidateModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  );
}
