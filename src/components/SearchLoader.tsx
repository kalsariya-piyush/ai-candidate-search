'use client';

import { useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { useSearchStore } from '@/store/useSearchStore';

export default function SearchLoader() {
  const { stages, currentStage, setCurrentStage } = useSearchStore();
  const [stageStatus, setStageStatus] = useState<('pending' | 'loading' | 'completed')[]>(
    stages.map(() => 'pending')
  );

  useEffect(() => {
    const runStages = async () => {
      for (let i = 0; i < stages.length; i++) {
        setCurrentStage(i);
        setStageStatus((prev) => prev.map((status, idx) => (idx === i ? 'loading' : status)));
        
        await new Promise((resolve) => setTimeout(resolve, 2000));
        
        setStageStatus((prev) => prev.map((status, idx) => (idx === i ? 'completed' : status)));
      }
    };

    runStages();
  }, [stages, setCurrentStage]);

  return (
    <div className="border rounded-2xl p-8 mb-8 bg-card">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-foreground rounded-xl flex items-center justify-center mx-auto mb-4">
            <Loader2 className="h-6 w-6 text-background animate-spin" />
          </div>
          <h3 className="text-xl font-semibold mb-2">AI Processing</h3>
          <p className="text-sm text-muted-foreground">Analyzing candidates with advanced algorithms</p>
        </div>
        
        <div className="space-y-4">
          {stages.map((stage, index) => (
            <div key={stage} className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  stageStatus[index] === 'completed'
                    ? 'bg-foreground'
                    : stageStatus[index] === 'loading'
                    ? 'bg-foreground'
                    : 'bg-muted'
                }`}
              >
                {stageStatus[index] === 'completed' ? (
                  <Check className="h-5 w-5 text-background" />
                ) : stageStatus[index] === 'loading' ? (
                  <Loader2 className="h-5 w-5 text-background animate-spin" />
                ) : (
                  <span className="text-muted-foreground font-medium">{index + 1}</span>
                )}
              </div>
              
              <div className="flex-1">
                <div
                  className={`font-medium transition-colors ${
                    stageStatus[index] === 'completed'
                      ? 'text-foreground'
                      : stageStatus[index] === 'loading'
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  {stage}
                </div>
                
                {stageStatus[index] === 'loading' && (
                  <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-foreground rounded-full animate-pulse w-3/4" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
