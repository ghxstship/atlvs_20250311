import { useState, useCallback } from 'react';

interface UseBatchEditOptions<T> {
  onUpdate: (ids: string[], updates: Partial<T>) => Promise<void>;
  onDelete?: (ids: string[]) => Promise<void>;
  onDuplicate?: (ids: string[]) => Promise<void>;
  onArchive?: (ids: string[]) => Promise<void>;
  onExport?: (ids: string[]) => Promise<void>;
  onShare?: (ids: string[]) => Promise<void>;
}

export function useBatchEdit<T>({
  onUpdate,
  onDelete,
  onDuplicate,
  onArchive,
  onExport,
  onShare
}: UseBatchEditOptions<T>) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      }
      return [...prev, id];
    });
  }, []);

  const handleSelectAll = useCallback((ids: string[]) => {
    setSelectedIds(ids);
  }, []);

  const handleDeselectAll = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const handleBatchUpdate = async (updates: Partial<T>) => {
    setIsProcessing(true);
    setError(null);
    try {
      await onUpdate(selectedIds, updates);
      setIsEditModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update items');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBatchDelete = async () => {
    if (!onDelete) return;
    setIsProcessing(true);
    setError(null);
    try {
      await onDelete(selectedIds);
      setSelectedIds([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete items');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBatchDuplicate = async () => {
    if (!onDuplicate) return;
    setIsProcessing(true);
    setError(null);
    try {
      await onDuplicate(selectedIds);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to duplicate items');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBatchArchive = async () => {
    if (!onArchive) return;
    setIsProcessing(true);
    setError(null);
    try {
      await onArchive(selectedIds);
      setSelectedIds([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive items');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBatchExport = async () => {
    if (!onExport) return;
    setIsProcessing(true);
    setError(null);
    try {
      await onExport(selectedIds);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export items');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBatchShare = async () => {
    if (!onShare) return;
    setIsProcessing(true);
    setError(null);
    try {
      await onShare(selectedIds);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to share items');
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    selectedIds,
    isEditModalOpen,
    isProcessing,
    error,
    handleSelect,
    handleSelectAll,
    handleDeselectAll,
    handleBatchUpdate,
    handleBatchDelete,
    handleBatchDuplicate,
    handleBatchArchive,
    handleBatchExport,
    handleBatchShare,
    setIsEditModalOpen,
    setError
  };
}