'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, Mail, Sparkles, TrendingUp, Users, Zap } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-background" />
            </div>
            <span className="font-bold text-xl">RecruitAI</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Recruitment</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Find Perfect Candidates
            <span className="block mt-2">In Seconds</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Leverage AI to search, analyze, and engage with top talent. 
            Streamline your recruitment with intelligent automation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search">
              <Button size="lg" className="w-full sm:w-auto text-base px-8">
                <Search className="mr-2 h-5 w-5" />
                Start Searching
              </Button>
            </Link>
            <Link href="/campaigns">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8">
                <Mail className="mr-2 h-5 w-5" />
                View Campaigns
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20 border-t">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Link href="/search" className="group">
            <div className="border rounded-2xl p-8 hover:border-foreground transition-all h-full bg-card">
              <div className="w-12 h-12 bg-foreground rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6 text-background" />
              </div>
              <h3 className="text-2xl font-bold mb-3">AI Candidate Search</h3>
              <p className="text-muted-foreground mb-6">
                Natural language search with intelligent matching, scoring, and insights. 
                Find the right talent faster with AI-powered recommendations.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-secondary text-xs rounded-full">Smart Matching</span>
                <span className="px-3 py-1 bg-secondary text-xs rounded-full">AI Insights</span>
                <span className="px-3 py-1 bg-secondary text-xs rounded-full">Quick Search</span>
              </div>
            </div>
          </Link>

          <Link href="/campaigns" className="group">
            <div className="border rounded-2xl p-8 hover:border-foreground transition-all h-full bg-card">
              <div className="w-12 h-12 bg-foreground rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6 text-background" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Email Campaigns</h3>
              <p className="text-muted-foreground mb-6">
                Create multi-step email sequences with analytics. Track opens, replies, 
                and engagement to optimize your outreach strategy.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-secondary text-xs rounded-full">Multi-Step</span>
                <span className="px-3 py-1 bg-secondary text-xs rounded-full">Analytics</span>
                <span className="px-3 py-1 bg-secondary text-xs rounded-full">Templates</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20 border-t">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 mr-2" />
              <div className="text-4xl font-bold">50+</div>
            </div>
            <div className="text-sm text-muted-foreground">Candidates</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Zap className="w-5 h-5 mr-2" />
              <div className="text-4xl font-bold">8s</div>
            </div>
            <div className="text-sm text-muted-foreground">AI Processing</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 mr-2" />
              <div className="text-4xl font-bold">95%</div>
            </div>
            <div className="text-sm text-muted-foreground">Match Accuracy</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Mail className="w-5 h-5 mr-2" />
              <div className="text-4xl font-bold">100</div>
            </div>
            <div className="text-sm text-muted-foreground">Free Credits</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-foreground rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-background" />
              </div>
              <span className="font-semibold">RecruitAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 RecruitAI. Built with Next.js & TypeScript.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
