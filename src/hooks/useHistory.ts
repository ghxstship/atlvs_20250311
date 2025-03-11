import { useState, useCallback } from 'react';

interface HistoryEntry {
  id: string;
  timestamp: string;
  description: string;
  user: {
    name: string;
    avatar?: string;
  };
  type: 'create' | 'update' | 'delete' | 'restore';
  metadata?: Record<string, any>;
  canRevert?: boolean;
}

interface HistoryNode extends HistoryEntry {
  parentId?: string;
  children: string[];
}

interface UseHistoryOptions {
  maxEntries?: number;
  onRevert?: (entryId: string) => Promise<void>;
  onPreview?: (entryId: string) => Promise<void>;
}

export function useHistory({
  maxEntries = 100,
  onRevert,
  onPreview
}: UseHistoryOptions = {}) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [nodes, setNodes] = useState<Record<string, HistoryNode>>({});
  const [rootId, setRootId] = useState<string | null>(null);
  const [currentBranch, setCurrentBranch] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addEntry = useCallback((entry: HistoryEntry) => {
    setEntries(prev => {
      const newEntries = [...prev, entry].slice(-maxEntries);
      return newEntries;
    });

    setNodes(prev => {
      const currentNode = currentBranch[currentBranch.length - 1];
      const newNode: HistoryNode = {
        ...entry,
        parentId: currentNode,
        children: []
      };

      // Update parent's children
      if (currentNode) {
        prev[currentNode].children.push(entry.id);
      }

      return {
        ...prev,
        [entry.id]: newNode
      };
    });

    setCurrentBranch(prev => [...prev, entry.id]);

    if (!rootId) {
      setRootId(entry.id);
    }
  }, [currentBranch, maxEntries, rootId]);

  const createBranch = useCallback((fromEntryId: string) => {
    setCurrentBranch(prev => {
      const branchPoint = prev.indexOf(fromEntryId);
      return branchPoint >= 0 ? prev.slice(0, branchPoint + 1) : prev;
    });
  }, []);

  const mergeBranch = useCallback((fromEntryId: string, toEntryId: string) => {
    setNodes(prev => {
      const updatedNodes = { ...prev };
      updatedNodes[toEntryId].children.push(fromEntryId);
      return updatedNodes;
    });
  }, []);

  const handleRevert = useCallback(async (entryId: string) => {
    if (!onRevert) return;

    setIsProcessing(true);
    setError(null);

    try {
      await onRevert(entryId);
      createBranch(entryId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revert');
    } finally {
      setIsProcessing(false);
    }
  }, [onRevert, createBranch]);

  const handlePreview = useCallback(async (entryId: string) => {
    if (!onPreview) return;

    setIsProcessing(true);
    setError(null);

    try {
      await onPreview(entryId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to preview');
    } finally {
      setIsProcessing(false);
    }
  }, [onPreview]);

  return {
    entries,
    nodes,
    rootId,
    currentBranch,
    isProcessing,
    error,
    addEntry,
    createBranch,
    mergeBranch,
    handleRevert,
    handlePreview,
    setError
  };
}