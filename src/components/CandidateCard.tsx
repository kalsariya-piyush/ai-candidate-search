import { Candidate } from '@/lib/api';
import { MapPin, Briefcase, Heart, ThumbsDown, Star } from 'lucide-react';
import { getMatchColor, getMatchBgColor } from '@/lib/utils';
import { Button } from './ui/button';
import { candidatesApi } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CandidateCardProps {
  candidate: Candidate;
  onClick: () => void;
}

export default function CandidateCard({ candidate, onClick }: CandidateCardProps) {
  const queryClient = useQueryClient();

  const shortlistMutation = useMutation({
    mutationFn: (liked: boolean) => candidatesApi.shortlist(candidate.id, liked),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shortlisted'] });
    },
  });

  const handleShortlist = (e: React.MouseEvent, liked: boolean) => {
    e.stopPropagation();
    shortlistMutation.mutate(liked);
  };

  return (
    <div
      onClick={onClick}
      className="border rounded-2xl hover:border-foreground transition-all cursor-pointer p-6 bg-card group"
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-foreground to-foreground/80 flex items-center justify-center text-background text-lg font-bold group-hover:scale-105 transition-transform">
          {candidate.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg truncate">{candidate.name}</h3>
            <div
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                candidate.availability === 'available'
                  ? 'bg-green-500'
                  : candidate.availability === 'passive'
                  ? 'bg-yellow-500'
                  : 'bg-muted-foreground'
              }`}
            />
          </div>
          <p className="text-sm font-medium truncate">{candidate.title}</p>
          <p className="text-sm text-muted-foreground truncate">{candidate.company}</p>
        </div>
      </div>

      {/* Match Score */}
      {candidate.matchScore && (
        <div className="mb-4">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-foreground text-background text-sm font-semibold">
            {candidate.matchScore}% Match
          </div>
        </div>
      )}

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Briefcase className="h-4 w-4 flex-shrink-0" />
          <span>{candidate.experience} years experience</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{candidate.location}</span>
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {candidate.skills.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="px-2.5 py-1 bg-secondary text-xs rounded-full font-medium"
          >
            {skill}
          </span>
        ))}
        {candidate.skills.length > 3 && (
          <span className="px-2.5 py-1 bg-secondary text-xs rounded-full font-medium">
            +{candidate.skills.length - 3}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 rounded-xl"
          onClick={(e) => handleShortlist(e, false)}
        >
          <ThumbsDown className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 rounded-xl"
          onClick={(e) => handleShortlist(e, true)}
        >
          <Heart className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 rounded-xl"
          onClick={(e) => handleShortlist(e, true)}
        >
          <Star className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
