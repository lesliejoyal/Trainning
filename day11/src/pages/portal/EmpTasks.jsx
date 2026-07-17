import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, Circle, Clock, RefreshCw, Play, Pause, RotateCcw, 
  Flame, FileText, Check 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../hooks/useTasks';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import toast from 'react-hot-toast';

const EmpTasks = () => {
  const { user } = useAuth();
  const { tasks, updateTaskProgress, markCompleted } = useTasks(user?.id);
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'productivity'
  const [editingId, setEditingId] = useState(null);
  const [progressVal, setProgressVal] = useState(0);

  // Pomodoro Focus Timer states
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [timerMode, setTimerMode] = useState('focus'); // 'focus' | 'break'

  // Personal notes state
  const [personalNotes, setPersonalNotes] = useState(() => {
    const saved = localStorage.getItem(`ems_notes_${user?.id}`);
    return saved ? saved : 'Write your notes or scratchpad items here...';
  });

  // Habit tracker state
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem(`ems_habits_${user?.id}`);
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Code Review', doneToday: false, streak: 5 },
      { id: 2, name: 'Write Documentation', doneToday: false, streak: 2 },
      { id: 3, name: 'Team Alignment Check-in', doneToday: true, streak: 8 }
    ];
  });

  // Pomodoro countdown timer logic
  useEffect(() => {
    let interval = null;
    if (timerActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setTimerActive(false);
      if (timerMode === 'focus') {
        toast.success('Focus session complete! Time for a short break. ☕');
        setSecondsLeft(5 * 60);
        setTimerMode('break');
      } else {
        toast.success('Break time is over! Ready to focus again? 💪');
        setSecondsLeft(25 * 60);
        setTimerMode('focus');
      }
    }
    return () => clearInterval(interval);
  }, [timerActive, secondsLeft, timerMode]);

  // Save notes on change
  useEffect(() => {
    localStorage.setItem(`ems_notes_${user?.id}`, personalNotes);
  }, [personalNotes, user?.id]);

  // Save habits on change
  useEffect(() => {
    localStorage.setItem(`ems_habits_${user?.id}`, JSON.stringify(habits));
  }, [habits, user?.id]);

  const toggleHabit = (id) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const nextDone = !h.doneToday;
        return {
          ...h,
          doneToday: nextDone,
          streak: nextDone ? h.streak + 1 : Math.max(0, h.streak - 1)
        };
      }
      return h;
    }));
    toast.success('Habit status updated!');
  };

  const handleUpdateClick = (task) => {
    setEditingId(task.id);
    setProgressVal(task.progress);
  };

  const handleSaveProgress = (id) => {
    const numericProgress = Math.min(100, Math.max(0, Number(progressVal)));
    updateTaskProgress(id, numericProgress);
    setEditingId(null);
    toast.success(`Task progress updated to ${numericProgress}%`);
  };

  const handleMarkDone = (id) => {
    markCompleted(id);
    toast.success('Task marked as completed! 🎉');
  };

  // Timer helper
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Stats calculation
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const pending = tasks.filter((t) => t.status === 'pending').length;

  return (
    <div className="space-y-6">
      
      {/* Tab controls */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${activeTab === 'tasks' ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            Assigned Tasks
          </button>
          <button 
            onClick={() => setActiveTab('productivity')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${activeTab === 'productivity' ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            Productivity Hub (Focus & Habits)
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'tasks' ? (
          <motion.div key="tasks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Upper metrics */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              <Card className="p-4 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned Tasks</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white mt-2">{total}</span>
              </Card>
              <Card className="p-4 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Completed</span>
                <span className="text-xl font-extrabold text-emerald-600 mt-2">{completed}</span>
              </Card>
              <Card className="p-4 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">In Progress</span>
                <span className="text-xl font-extrabold text-primary mt-2">{inProgress}</span>
              </Card>
              <Card className="p-4 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Pending</span>
                <span className="text-xl font-extrabold text-amber-600 mt-2">{pending}</span>
              </Card>
            </div>

            {/* Task list */}
            <div className="space-y-4">
              {tasks.map((task) => {
                const isCompleted = task.status === 'completed';
                return (
                  <Card key={task.id} className="p-5">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <button
                          onClick={() => !isCompleted && handleMarkDone(task.id)}
                          className="mt-1 flex-shrink-0"
                          disabled={isCompleted}
                        >
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-emerald-500 fill-emerald-50 dark:fill-emerald-950" />
                          ) : (
                            <Circle className="h-5 w-5 text-slate-300 hover:text-primary transition-colors" />
                          )}
                        </button>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className={`font-semibold text-sm ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>
                              {task.title}
                            </h4>
                            <Badge variant={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'default'}>
                              {task.priority}
                            </Badge>
                            <Badge variant={task.status === 'completed' ? 'success' : task.status === 'in-progress' ? 'info' : 'default'}>
                              {task.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{task.description}</p>
                          <div className="flex items-center gap-3 mt-3 text-[10px] text-slate-400">
                            <span>Deadline: {task.deadline}</span>
                            <span>Progress: {task.progress}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress adjustments */}
                      <div className="flex flex-col sm:items-end w-full sm:w-auto shrink-0 gap-2">
                        {editingId === task.id ? (
                          <div className="flex items-center gap-2 w-full sm:w-56">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={progressVal}
                              onChange={(e) => setProgressVal(Number(e.target.value))}
                              className="w-full accent-primary"
                            />
                            <span className="text-xs font-semibold w-8">{progressVal}%</span>
                            <Button size="sm" onClick={() => handleSaveProgress(task.id)}>Save</Button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            {!isCompleted && (
                              <Button variant="secondary" size="sm" onClick={() => handleUpdateClick(task)}>
                                <RefreshCw className="h-3.5 w-3.5 mr-1" /> Update
                              </Button>
                            )}
                          </div>
                        )}
                        <div className="w-full sm:w-40 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div className={`h-full bg-primary`} style={{ width: `${task.progress}%` }} />
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div key="productivity" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-6 md:grid-cols-3">
            
            {/* Pomodoro Focus Timer */}
            <Card className="p-5 flex flex-col items-center text-center">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" /> Focus Pomodoro
              </h3>
              <div className="relative flex items-center justify-center h-32 w-32 rounded-full border-4 border-primary/20 bg-primary/5">
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {formatTime(secondsLeft)}
                </div>
                <div className="absolute bottom-2.5 text-[9px] font-semibold uppercase tracking-widest text-primary">
                  {timerMode}
                </div>
              </div>
              <div className="flex gap-2 mt-5 w-full">
                <Button 
                  onClick={() => setTimerActive(!timerActive)}
                  variant={timerActive ? 'secondary' : 'primary'}
                  className="flex-1 text-xs"
                >
                  {timerActive ? <Pause className="h-3.5 w-3.5 mr-1" /> : <Play className="h-3.5 w-3.5 mr-1" />}
                  {timerActive ? 'Pause' : 'Start'}
                </Button>
                <Button 
                  onClick={() => { setTimerActive(false); setSecondsLeft(25 * 60); setTimerMode('focus'); }}
                  variant="secondary"
                  className="p-2.5"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </Card>

            {/* Habit Tracker */}
            <Card className="p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-amber-500" /> Daily Habit Tracker
                </h3>
                <div className="space-y-3">
                  {habits.map((habit) => (
                    <div key={habit.id} className="flex items-center justify-between p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">{habit.name}</p>
                        <p className="text-[10px] text-slate-400">🔥 {habit.streak} day streak</p>
                      </div>
                      <button 
                        onClick={() => toggleHabit(habit.id)}
                        className={`h-6 w-6 rounded-lg flex items-center justify-center border transition-all ${habit.doneToday ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 hover:border-emerald-500'}`}
                      >
                        {habit.doneToday && <Check className="h-4 w-4" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Personal Notepad / Work Log */}
            <Card className="p-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-primary" /> Daily Scratchpad
              </h3>
              <textarea
                value={personalNotes}
                onChange={(e) => setPersonalNotes(e.target.value)}
                rows="6"
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:border-primary resize-none font-mono"
              />
              <p className="text-[9px] text-slate-400 text-right mt-1.5">Auto-saved to LocalStorage</p>
            </Card>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default EmpTasks;
