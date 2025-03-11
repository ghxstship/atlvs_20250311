import { create } from 'zustand';
import { Task, Project } from '../types/project';

interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  tasks: Task[];
  loading: boolean;
  error: string | null;
  
  // Project Actions
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  selectProject: (project: Project | null) => void;
  
  // Task Actions
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newStatus: Task['status']) => void;
  
  // Loading States
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  selectedProject: null,
  tasks: [],
  loading: false,
  error: null,

  setProjects: (projects) => set({ projects }),
  addProject: (project) => set((state) => ({ 
    projects: [...state.projects, project] 
  })),
  updateProject: (id, project) => set((state) => ({
    projects: state.projects.map(p => p.id === id ? { ...p, ...project } : p)
  })),
  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter(p => p.id !== id)
  })),
  selectProject: (project) => set({ selectedProject: project }),

  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ 
    tasks: [...state.tasks, task] 
  })),
  updateTask: (id, task) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, ...task } : t)
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(t => t.id !== id)
  })),
  moveTask: (taskId, newStatus) => set((state) => ({
    tasks: state.tasks.map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    )
  })),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error })
}));