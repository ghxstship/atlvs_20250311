export interface Task {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  dueDate: string;
  assignee: string;
  status: 'todo' | 'inProgress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  completionPercentage: number;
  tags?: string[];
  dependencies?: { id: string; title: string; }[];
  attachments?: { name: string; url: string; size: string; }[];
  comments?: {
    id: string;
    author: string;
    content: string;
    createdAt: string;
  }[];
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'completed' | 'onHold';
  client: string;
  budget: number;
  team: string[];
  tasks: Task[];
}