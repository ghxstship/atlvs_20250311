import { User } from './user';

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: string;
  changes: string;
  createdBy: User;
  createdAt: string;
  fileUrl: string;
  fileSize: string;
  checksum: string;
  status: 'draft' | 'published' | 'archived';
  reviewedBy?: User[];
  approvedBy?: User;
  approvedAt?: string;
  comments?: {
    id: string;
    content: string;
    author: User;
    createdAt: string;
  }[];
}

export interface Document {
  id: string;
  title: string;
  description?: string;
  category: string;
  tags: string[];
  createdBy: User;
  createdAt: string;
  updatedAt: string;
  currentVersion: string;
  versions: DocumentVersion[];
  status: 'draft' | 'published' | 'archived';
  accessLevel: 'public' | 'private' | 'restricted';
  allowedUsers?: string[];
  allowedRoles?: string[];
  metadata: Record<string, any>;
}