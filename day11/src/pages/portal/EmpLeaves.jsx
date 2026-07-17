import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLeaves } from '../../hooks/useLeaves';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Form';
import { Badge } from '../../components/ui/Badge';
import toast from 'react-hot-toast';

const LEAVE_TYPES = ['Annual Leave', 'Sick Leave', 'Casual Leave', 'Unpaid Leave'];

const EmpLeaves = () => {
  const { user } = useAuth();
  const { leaves, applyLeave, deleteLeave } = useLeaves();
  const [isOpen, setIsOpen] = useState(false);

  const [form, setForm] = useState({
    type: 'Annual Leave',
    from: '',
    to: '',
    reason: '',
  });

  const myLeaves = leaves.filter(
    (l) => l.employeeId === user?.id || l.employeeName === user?.name
  );

  // Hardcoded balances for simplicity, but tracking approved days
  const balances = {
    'Annual Leave': 15,
    'Sick Leave': 10,
    'Casual Leave': 7,
  };

  const getUsedDays = (type) => {
    return myLeaves
      .filter((l) => l.type === type && l.status === 'Approved')
      .reduce((sum, l) => sum + Number(l.days || 0), 0);
  };

  const handleApply = (e) => {
    e.preventDefault();
    if (!form.from || !form.to || !form.reason.trim()) {
      toast.error('Please fill in all fields.');
      return;
    }

    const fromDate = new Date(form.from);
    const toDate = new Date(form.to);

    if (toDate < fromDate) {
      toast.error('End date cannot be before start date.');
      return;
    }

    const diffTime = Math.abs(toDate - fromDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    applyLeave({
      employeeId: user?.id || '1',
      employeeName: user?.name || 'Jane Cooper',
      department: user?.department || 'Engineering',
      type: form.type,
      from: form.from,
      to: form.to,
      days: diffDays,
      reason: form.reason,
    });

    setIsOpen(false);
    setForm({ type: 'Annual Leave', from: '', to: '', reason: '' });
    toast.success('Leave application submitted!');
  };

  const handleCancel = (id) => {
    deleteLeave(id);
    toast.success('Leave request cancelled.');
  };

  return (
    <div className="space-y-6">
      
      {/* Upper header action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Leave Management</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Request leave off and track your balances</p>
        </div>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Request Leave
        </Button>
      </div>

      {/* Leave Balances Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        {Object.entries(balances).map(([type, total]) => {
          const used = getUsedDays(type);
          const available = total - used;
          return (
            <Card key={type} className="p-5 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{type}</h4>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">{available} days</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs text-slate-500">
                <span>Total Allocation: {total}</span>
                <span>Used: {used}</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Leave History Table */}
      <Card className="overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Leave Requests</h3>
          <p className="text-xs text-slate-500">History of requested dates off and status</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide">Type</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide">Duration</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide">Days</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide">Reason</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide">Status</th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {myLeaves.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-white">{l.type}</td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                    {l.from} to {l.to}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{l.days} days</td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300 max-w-xs truncate">{l.reason}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant={l.status === 'Approved' ? 'success' : l.status === 'Pending' ? 'warning' : 'danger'}>
                      {l.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {l.status === 'Pending' ? (
                      <Button variant="danger" size="sm" onClick={() => handleCancel(l.id)}>
                        <Trash2 className="h-4 w-4 mr-1" /> Cancel
                      </Button>
                    ) : (
                      <span className="text-xs text-slate-400">Locked</span>
                    )}
                  </td>
                </tr>
              ))}
              {myLeaves.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-500">
                    No leave requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Apply Leave Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Apply for Leave</h3>
                <button onClick={() => setIsOpen(false)} className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="h-4 w-4 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleApply} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Leave Type</label>
                  <Select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    {LEAVE_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">From Date</label>
                    <Input
                      type="date"
                      value={form.from}
                      onChange={(e) => setForm({ ...form, from: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">To Date</label>
                    <Input
                      type="date"
                      value={form.to}
                      onChange={(e) => setForm({ ...form, to: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Reason</label>
                  <textarea
                    rows="3"
                    value={form.reason}
                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    placeholder="Provide a reason for leave"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Submit Request</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default EmpLeaves;
