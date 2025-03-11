import { create } from 'zustand';
import { Document, DocumentVersion } from '../types/document';

interface DocumentState {
  documents: Document[];
  selectedDocument: Document | null;
  loading: boolean;
  error: string | null;
  
  // Document Actions
  setDocuments: (documents: Document[]) => void;
  addDocument: (document: Document) => void;
  updateDocument: (id: string, document: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  selectDocument: (document: Document | null) => void;
  
  // Version Control Actions
  addVersion: (documentId: string, version: DocumentVersion) => void;
  updateVersion: (documentId: string, versionId: string, version: Partial<DocumentVersion>) => void;
  deleteVersion: (documentId: string, versionId: string) => void;
  revertToVersion: (documentId: string, versionId: string) => void;
  
  // Loading States
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  documents: [],
  selectedDocument: null,
  loading: false,
  error: null,

  setDocuments: (documents) => set({ documents }),
  addDocument: (document) => set((state) => ({ 
    documents: [...state.documents, document] 
  })),
  updateDocument: (id, document) => set((state) => ({
    documents: state.documents.map(d => d.id === id ? { ...d, ...document } : d)
  })),
  deleteDocument: (id) => set((state) => ({
    documents: state.documents.filter(d => d.id !== id)
  })),
  selectDocument: (document) => set({ selectedDocument: document }),

  addVersion: (documentId, version) => set((state) => ({
    documents: state.documents.map(doc => {
      if (doc.id === documentId) {
        return {
          ...doc,
          versions: [...doc.versions, version],
          currentVersion: version.version,
          updatedAt: new Date().toISOString()
        };
      }
      return doc;
    })
  })),

  updateVersion: (documentId, versionId, version) => set((state) => ({
    documents: state.documents.map(doc => {
      if (doc.id === documentId) {
        return {
          ...doc,
          versions: doc.versions.map(v => 
            v.id === versionId ? { ...v, ...version } : v
          )
        };
      }
      return doc;
    })
  })),

  deleteVersion: (documentId, versionId) => set((state) => ({
    documents: state.documents.map(doc => {
      if (doc.id === documentId) {
        return {
          ...doc,
          versions: doc.versions.filter(v => v.id !== versionId)
        };
      }
      return doc;
    })
  })),

  revertToVersion: (documentId, versionId) => set((state) => ({
    documents: state.documents.map(doc => {
      if (doc.id === documentId) {
        const version = doc.versions.find(v => v.id === versionId);
        if (version) {
          return {
            ...doc,
            currentVersion: version.version,
            updatedAt: new Date().toISOString()
          };
        }
      }
      return doc;
    })
  })),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error })
}));