'use client';

import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { campaignsApi, CampaignStep } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';

interface CreateCampaignModalProps {
  type: 'email' | 'linkedin';
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateCampaignModal({ type, onClose, onSuccess }: CreateCampaignModalProps) {
  const [name, setName] = useState('');
  const [steps, setSteps] = useState<CampaignStep[]>([
    { subject: '', content: '', delayDays: 0 },
  ]);

  const createMutation = useMutation({
    mutationFn: () => campaignsApi.create({ name, type, steps }),
    onSuccess: () => {
      onSuccess();
    },
  });

  const addStep = () => {
    setSteps([...steps, { subject: '', content: '', delayDays: 0 }]);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, field: keyof CampaignStep, value: any) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Create {type === 'email' ? 'Email' : 'LinkedIn'} Campaign</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Campaign Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Senior Developer Outreach Q1"
              required
            />
          </div>

          {/* Steps */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Campaign Steps</h3>
              <Button type="button" onClick={addStep} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Step
              </Button>
            </div>

            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Step {index + 1}</h4>
                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {type === 'email' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject Line
                      </label>
                      <Input
                        value={step.subject || ''}
                        onChange={(e) => updateStep(index, 'subject', e.target.value)}
                        placeholder="Email subject"
                        required
                      />
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message Content
                    </label>
                    <textarea
                      value={step.content}
                      onChange={(e) => updateStep(index, 'content', e.target.value)}
                      placeholder="Hi {{firstName}},&#10;&#10;Your message here..."
                      className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Use variables: {'{'}firstName{'}'}, {'{'}lastName{'}'}, {'{'}company{'}'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delay (days)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={step.delayDays}
                      onChange={(e) => updateStep(index, 'delayDays', parseInt(e.target.value))}
                      placeholder="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Days to wait before sending this step
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Campaign'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
