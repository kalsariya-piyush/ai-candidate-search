'use client';

import { Candidate } from '@/lib/api';
import { X, MapPin, Briefcase, Mail, Phone, Linkedin, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { getMatchColor, getMatchBgColor } from '@/lib/utils';
import { useState } from 'react';
import { candidatesApi } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';

interface CandidateModalProps {
  candidate: Candidate;
  onClose: () => void;
}

export default function CandidateModal({ candidate, onClose }: CandidateModalProps) {
  const [contactUnlocked, setContactUnlocked] = useState(false);
  const [contactInfo, setContactInfo] = useState<any>(null);

  const unlockMutation = useMutation({
    mutationFn: () => candidatesApi.unlock(candidate.id),
    onSuccess: (response) => {
      setContactInfo(response.data);
      setContactUnlocked(true);
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
              {candidate.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{candidate.name}</h2>
              <p className="text-gray-600">{candidate.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Match Score */}
          {candidate.matchScore && (
            <div className="mb-6">
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full ${getMatchBgColor(
                  candidate.matchScore
                )}`}
              >
                <span className={`text-lg font-semibold ${getMatchColor(candidate.matchScore)}`}>
                  {candidate.matchScore}% Match
                </span>
              </div>
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-600">
              <Briefcase className="h-5 w-5" />
              <span>{candidate.experience} years experience</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-5 w-5" />
              <span>{candidate.location}</span>
            </div>
          </div>

          {/* Strengths */}
          {candidate.strengths && candidate.strengths.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Strengths</h3>
              <ul className="space-y-2">
                {candidate.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Areas to Probe */}
          {candidate.areasToProbe && candidate.areasToProbe.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Areas to Probe</h3>
              <ul className="space-y-2">
                {candidate.areasToProbe.map((area, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-1">?</span>
                    <span className="text-gray-700">{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AI Verdict */}
          {candidate.verdict && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">AI Verdict</h3>
              <p className="text-blue-800">{candidate.verdict}</p>
            </div>
          )}

          {/* Work History */}
          {candidate.workHistory && candidate.workHistory.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Work Experience</h3>
              <div className="space-y-4">
                {candidate.workHistory.map((work, index) => (
                  <div key={index} className="border-l-2 border-gray-200 pl-4">
                    <h4 className="font-medium">{work.title}</h4>
                    <p className="text-gray-600">{work.company}</p>
                    <p className="text-sm text-gray-500">
                      {work.startDate} - {work.endDate || 'Present'}
                    </p>
                    {work.description && (
                      <p className="text-sm text-gray-700 mt-2">{work.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* About */}
          {candidate.about && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">About</h3>
              <p className="text-gray-700">{candidate.about}</p>
            </div>
          )}

          {/* Contact Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Contact Information</h3>
              {!contactUnlocked && (
                <Button
                  onClick={() => unlockMutation.mutate()}
                  disabled={unlockMutation.isPending}
                  size="sm"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Unlock (5 credits)
                </Button>
              )}
            </div>

            {contactUnlocked && contactInfo ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="h-4 w-4" />
                  <a href={`mailto:${contactInfo.email}`} className="hover:text-blue-600">
                    {contactInfo.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${contactInfo.phone}`} className="hover:text-blue-600">
                    {contactInfo.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Linkedin className="h-4 w-4" />
                  <a
                    href={contactInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <Lock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>Contact information is locked</p>
                <p className="text-sm">Unlock to view email, phone, and LinkedIn</p>
              </div>
            )}
          </div>

          {/* Education */}
          {candidate.education && candidate.education.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Education</h3>
              <div className="space-y-2">
                {candidate.education.map((edu, index) => (
                  <div key={index}>
                    <p className="font-medium">{edu.degree}</p>
                    <p className="text-gray-600">{edu.institution}</p>
                    <p className="text-sm text-gray-500">{edu.year}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
