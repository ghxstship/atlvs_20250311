import React, { useState } from 'react';
import { Clock, Download, RotateCcw, CheckCircle, AlertCircle, MessageSquare, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { Document, DocumentVersion } from '../../types/document';
import { formatDate } from '../../lib/utils';

interface VersionControlProps {
  document: Document;
  onRevert: (versionId: string) => void;
  onDownload: (version: DocumentVersion) => void;
  onAddComment: (versionId: string, comment: string) => void;
}

export default function VersionControl({ 
  document, 
  onRevert, 
  onDownload, 
  onAddComment 
}: VersionControlProps) {
  const [expandedVersion, setExpandedVersion] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = (versionId: string) => {
    onAddComment(versionId, newComment);
    setNewComment('');
  };

  const sortedVersions = [...document.versions].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-mono-900">Version History</h3>
        <div className="text-sm text-mono-500">
          Current Version: {document.currentVersion}
        </div>
      </div>

      <div className="space-y-2">
        {sortedVersions.map(version => (
          <div 
            key={version.id}
            className={`bg-white rounded-lg border ${
              version.version === document.currentVersion 
                ? 'border-mono-900' 
                : 'border-mono-200'
            }`}
          >
            <div 
              className="p-4 flex items-center justify-between cursor-pointer"
              onClick={() => setExpandedVersion(
                expandedVersion === version.id ? null : version.id
              )}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-2 h-2 rounded-full ${
                  version.status === 'published' ? 'bg-green-500' :
                  version.status === 'draft' ? 'bg-yellow-500' :
                  'bg-mono-500'
                }`} />
                <div>
                  <div className="font-medium text-mono-900">
                    Version {version.version}
                  </div>
                  <div className="text-sm text-mono-500">
                    {formatDate(version.createdAt)} by {version.createdBy.name}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {version.version === document.currentVersion && (
                  <span className="text-xs bg-mono-100 text-mono-700 px-2 py-1 rounded">
                    Current
                  </span>
                )}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload(version);
                  }}
                  className="p-1 text-mono-400 hover:text-accent rounded"
                >
                  <Download className="w-4 h-4" />
                </button>
                {version.version !== document.currentVersion && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRevert(version.id);
                    }}
                    className="p-1 text-mono-400 hover:text-accent rounded"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
                {expandedVersion === version.id ? (
                  <ChevronUp className="w-4 h-4 text-mono-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-mono-400" />
                )}
              </div>
            </div>

            {expandedVersion === version.id && (
              <div className="border-t border-mono-200 p-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-mono-900 mb-2">Changes</h4>
                    <p className="text-sm text-mono-600">{version.changes}</p>
                  </div>

                  {version.reviewedBy && version.reviewedBy.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-mono-900 mb-2">Reviewed By</h4>
                      <div className="flex flex-wrap gap-2">
                        {version.reviewedBy.map(reviewer => (
                          <span 
                            key={reviewer.id}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-mono-100 text-mono-700"
                          >
                            {reviewer.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {version.approvedBy && (
                    <div>
                      <h4 className="text-sm font-medium text-mono-900 mb-2">Approval</h4>
                      <div className="flex items-center text-sm text-mono-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Approved by {version.approvedBy.name} on {formatDate(version.approvedAt!)}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium text-mono-900 mb-2">Comments</h4>
                    <div className="space-y-3">
                      {version.comments?.map(comment => (
                        <div key={comment.id} className="bg-mono-50 rounded p-3">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-mono-900">
                              {comment.author.name}
                            </span>
                            <span className="text-xs text-mono-500">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-mono-600">{comment.content}</p>
                        </div>
                      ))}
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment..."
                          className="flex-1 px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500 text-sm"
                        />
                        <button
                          onClick={() => handleAddComment(version.id)}
                          disabled={!newComment.trim()}
                          className="px-4 py-2 bg-mono-900 text-white rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}