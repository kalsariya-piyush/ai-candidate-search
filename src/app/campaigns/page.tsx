'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { campaignsApi, Campaign } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Plus, Mail, Linkedin, TrendingUp, ArrowLeft, Sparkles } from 'lucide-react';
import CampaignCard from '@/components/CampaignCard';
import CreateCampaignModal from '@/components/CreateCampaignModal';
import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';

export default function CampaignsPage() {
  const [activeTab, setActiveTab] = useState<'email' | 'linkedin'>('email');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: campaigns, isLoading, refetch } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const response = await campaignsApi.list();
      return response.data;
    },
  });

  const filteredCampaigns = campaigns?.filter((c: Campaign) => c.type === activeTab) || [];

  const stats = {
    totalSent: filteredCampaigns.reduce((sum: number, c: Campaign) => sum + (c.stats?.sent || 0), 0),
    avgOpenRate: filteredCampaigns.length > 0
      ? filteredCampaigns.reduce((sum: number, c: Campaign) => sum + (c.stats?.openRate || 0), 0) / filteredCampaigns.length
      : 0,
    avgReplyRate: filteredCampaigns.length > 0
      ? filteredCampaigns.reduce((sum: number, c: Campaign) => sum + (c.stats?.replyRate || 0), 0) / filteredCampaigns.length
      : 0,
  };

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
          <ThemeToggle />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Campaigns</h1>
            <p className="text-muted-foreground">Create and manage your outreach campaigns</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} size="lg" className="rounded-xl">
            <Plus className="mr-2 h-5 w-5" />
            New Campaign
          </Button>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('email')}
                className={`pb-4 px-1 border-b-2 font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'email'
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Mail className="h-4 w-4" />
                Email Sequences
              </button>
              <button
                onClick={() => setActiveTab('linkedin')}
                className={`pb-4 px-1 border-b-2 font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'linkedin'
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn Campaigns
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="border rounded-2xl p-6 bg-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Sent</h3>
              <TrendingUp className="h-4 w-4" />
            </div>
            <p className="text-4xl font-bold">{stats.totalSent}</p>
            <p className="text-sm text-muted-foreground mt-1">Across all campaigns</p>
          </div>

          <div className="border rounded-2xl p-6 bg-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Avg Open Rate</h3>
              <TrendingUp className="h-4 w-4" />
            </div>
            <p className="text-4xl font-bold">{stats.avgOpenRate.toFixed(1)}%</p>
            <p className="text-sm text-muted-foreground mt-1">Average across campaigns</p>
          </div>

          <div className="border rounded-2xl p-6 bg-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Avg Reply Rate</h3>
              <TrendingUp className="h-4 w-4" />
            </div>
            <p className="text-4xl font-bold">{stats.avgReplyRate.toFixed(1)}%</p>
            <p className="text-sm text-muted-foreground mt-1">Average across campaigns</p>
          </div>
        </div>

        {/* Campaigns List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading campaigns...</p>
          </div>
        ) : filteredCampaigns.length > 0 ? (
          <div className="space-y-4">
            {filteredCampaigns.map((campaign: Campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} onUpdate={refetch} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border rounded-2xl bg-card">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No campaigns yet</h3>
            <p className="text-muted-foreground mb-6">Create your first {activeTab} campaign to get started</p>
            <Button onClick={() => setShowCreateModal(true)} size="lg" className="rounded-xl">
              <Plus className="mr-2 h-5 w-5" />
              Create Campaign
            </Button>
          </div>
        )}
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <CreateCampaignModal
          type={activeTab}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}
