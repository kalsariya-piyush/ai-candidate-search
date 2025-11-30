import { Campaign } from '@/lib/api';
import { Mail, Users, Eye, MessageSquare, MoreVertical, Play, Pause, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { campaignsApi } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

interface CampaignCardProps {
  campaign: Campaign;
  onUpdate: () => void;
}

export default function CampaignCard({ campaign, onUpdate }: CampaignCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => campaignsApi.delete(campaign.id),
    onSuccess: onUpdate,
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => campaignsApi.update(campaign.id, { status }),
    onSuccess: onUpdate,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-foreground text-background';
      case 'paused':
        return 'bg-secondary text-secondary-foreground';
      case 'draft':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="border rounded-2xl p-6 hover:border-foreground transition-all bg-card">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold">{campaign.name}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
              {campaign.status}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{campaign.steps?.length || 0} steps</p>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <MoreVertical className="h-5 w-5 text-gray-600" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-card rounded-xl shadow-lg border z-10">
              <button
                onClick={() => {
                  updateStatusMutation.mutate(campaign.status === 'active' ? 'paused' : 'active');
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2 rounded-t-xl"
              >
                {campaign.status === 'active' ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Activate
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this campaign?')) {
                    deleteMutation.mutate();
                  }
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2 text-destructive rounded-b-xl"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Mail className="h-4 w-4" />
            <span className="text-xs font-medium">Sent</span>
          </div>
          <p className="text-2xl font-bold">{campaign.stats?.sent || 0}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Eye className="h-4 w-4" />
            <span className="text-xs font-medium">Opened</span>
          </div>
          <p className="text-2xl font-bold">{campaign.stats?.opened || 0}</p>
          <p className="text-xs text-muted-foreground">{campaign.stats?.openRate?.toFixed(1) || 0}%</p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <MessageSquare className="h-4 w-4" />
            <span className="text-xs font-medium">Replied</span>
          </div>
          <p className="text-2xl font-bold">{campaign.stats?.replied || 0}</p>
          <p className="text-xs text-muted-foreground">{campaign.stats?.replyRate?.toFixed(1) || 0}%</p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Users className="h-4 w-4" />
            <span className="text-xs font-medium">Recipients</span>
          </div>
          <p className="text-2xl font-bold">{campaign.recipients?.length || 0}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span className="font-medium">Delivery Progress</span>
          <span className="font-semibold">{campaign.stats?.deliveryRate?.toFixed(0) || 0}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-foreground rounded-full transition-all"
            style={{ width: `${campaign.stats?.deliveryRate || 0}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 rounded-xl">
          View Analytics
        </Button>
        <Button variant="outline" size="sm" className="flex-1 rounded-xl">
          Edit Campaign
        </Button>
      </div>
    </div>
  );
}
