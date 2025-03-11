import React, { useState } from 'react';
import { GitBranch, GitMerge, ChevronRight, ChevronDown, RotateCcw, Eye } from 'lucide-react';

interface HistoryNode {
  id: string;
  timestamp: string;
  description: string;
  user: {
    name: string;
    avatar?: string;
  };
  parentId?: string;
  children: string[];
  metadata?: Record<string, any>;
  canRevert?: boolean;
}

interface HistoryTreeViewProps {
  nodes: Record<string, HistoryNode>;
  rootId: string;
  onRevert: (nodeId: string) => void;
  onPreview: (nodeId: string) => void;
}

export default function HistoryTreeView({ nodes, rootId, onRevert, onPreview }: HistoryTreeViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([rootId]));

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const renderNode = (nodeId: string, level = 0) => {
    const node = nodes[nodeId];
    if (!node) return null;

    const isExpanded = expandedNodes.has(nodeId);
    const hasChildren = node.children.length > 0;
    const isMergeNode = node.children.length > 1;

    return (
      <div key={nodeId} style={{ marginLeft: `${level * 24}px` }}>
        <div className="flex items-center py-2 group">
          {/* Expand/collapse button */}
          {hasChildren ? (
            <button
              onClick={() => toggleNode(nodeId)}
              className="w-6 h-6 flex items-center justify-center text-mono-400 hover:text-mono-600"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          ) : (
            <div className="w-6" />
          )}

          {/* Branch/merge indicator */}
          {isMergeNode ? (
            <GitMerge className="w-4 h-4 text-purple-500 mr-2" />
          ) : (
            <GitBranch className="w-4 h-4 text-blue-500 mr-2" />
          )}

          {/* Node content */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-mono-100 flex items-center justify-center mr-2">
                  {node.user.avatar ? (
                    <img 
                      src={node.user.avatar} 
                      alt={node.user.name}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <span className="text-xs font-medium text-mono-600">
                      {node.user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium text-mono-900">{node.description}</span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onPreview(nodeId)}
                  className="p-1 text-mono-400 hover:text-accent rounded"
                  title="Preview this version"
                >
                  <Eye className="w-4 h-4" />
                </button>
                {node.canRevert && (
                  <button
                    onClick={() => onRevert(nodeId)}
                    className="p-1 text-mono-400 hover:text-accent rounded"
                    title="Revert to this version"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Metadata */}
            {node.metadata && Object.keys(node.metadata).length > 0 && (
              <div className="mt-1 ml-8 text-xs text-mono-500">
                {Object.entries(node.metadata).map(([key, value]) => (
                  <span key={key} className="mr-4">
                    {key}: <span className="text-mono-700">{value}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Render children */}
        {isExpanded && hasChildren && (
          <div className="border-l border-mono-200 ml-3 pl-3">
            {node.children.map(childId => renderNode(childId, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {renderNode(rootId)}
    </div>
  );
}