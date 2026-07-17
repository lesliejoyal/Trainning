import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'ems_tasks';

const SEED_TASKS = [
  { id: 't1', title: 'Complete Q3 performance review', description: 'Submit self-assessment form by end of month', priority: 'high', status: 'in-progress', deadline: '2026-07-31', progress: 60, assignedTo: '1' },
  { id: 't2', title: 'Update project documentation', description: 'Document all API endpoints and architecture decisions', priority: 'medium', status: 'pending', deadline: '2026-07-20', progress: 0, assignedTo: '1' },
  { id: 't3', title: 'Code review for feature branch', description: 'Review PR #142 — authentication module', priority: 'high', status: 'pending', deadline: '2026-07-15', progress: 0, assignedTo: '1' },
  { id: 't4', title: 'Onboarding presentation slides', description: 'Prepare slides for new team member onboarding', priority: 'low', status: 'completed', deadline: '2026-07-10', progress: 100, assignedTo: '1' },
  { id: 't5', title: 'Security audit checklist', description: 'Go through the quarterly security audit checklist', priority: 'medium', status: 'in-progress', deadline: '2026-07-28', progress: 40, assignedTo: '1' },
];

export const useTasks = (employeeId) => {
  const [tasks, setTasks] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : SEED_TASKS;
    } catch {
      return SEED_TASKS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const myTasks = employeeId
    ? tasks.filter((t) => t.assignedTo === String(employeeId))
    : tasks;

  const updateTaskProgress = useCallback((id, progress) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, progress, status: progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'pending' }
          : t
      )
    );
  }, []);

  const markCompleted = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'completed', progress: 100 } : t))
    );
  }, []);

  return { tasks: myTasks, allTasks: tasks, updateTaskProgress, markCompleted };
};
