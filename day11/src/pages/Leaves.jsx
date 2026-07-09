import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, CheckCircle2, XCircle, Trash2, ChevronLeft, ChevronRight, CalendarClock, Clock, FileCheck, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLeaves } from '../hooks/useLeaves';
import ConfirmDialog from '../components/employees/ConfirmDialog';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input, Select } from '../components/ui/Form';
import { PageHeader } from '../components/ui/PageHeader';
import { Modal } from '../components/ui/Modal';

// ─── Constants ────────────────────────────────────────────────────────────────
const LEAVE_TYPES = ['Annual Leave', 'Sick Leave', 'Casual Leave', 'Maternity Leave', 'Paternity Leave', 'Unpaid Leave'];
const STATUS_OPTS = ['All', 'Pending', 'Approved', 'Rejected'];
const EMPLOYEES   = [
  { id: '1', name: 'Jane Cooper',      department: 'Engineering' },
  { id: '2', name: 'Cody Fisher',      department: 'Product'     },
  { id: '3', name: 'Esther Howard',    department: 'Design'      },
  { id: '4', name: 'Jenny Wilson',     department: 'HR'          },
  { id: '6', name: 'Wade Warren',      department: 'Engineering' },
  { id: '7', name: 'Floyd Miles',      department: 'Finance'     },
  { id: '8', name: 'Ronald Richards',  department: 'Engineering' },
];
const PAGE_SIZE = 7;

const getStatusVariant = (status) => {
  switch (status) {
    case 'Approved': return 'success';
    case 'Pending': return 'warning';
    case 'Rejected': return 'error';
    default: return 'default';
  }
};

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <Card className={`flex items-center gap-4 p-5 ${color} shadow-sm border-none`}>
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/60 dark:bg-black/20">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <p className="text-xs font-medium opacity-70">{label}</p>
      <p className="text-2xl font-extrabold">{value}</p>
      {sub && <p className="text-xs opacity-60">{sub}</p>}
    </div>
  </Card>
);

// ─── Apply Leave Modal ────────────────────────────────────────────────────────
const LeaveModal = ({ isOpen, onClose, onSave }) => {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm]     = useState({ employeeId: '', type: '', from: today, to: today, reason: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      setForm({ employeeId: '', type: '', from: today, to: today, reason: '' });
      setErrors({});
    }
  }, [isOpen, today]);

  if (!isOpen) return null;

  const set = (k) => (e) => { setForm((p) => ({ ...p, [k]: e.target.value })); setErrors((p) => ({ ...p, [k]: '' })); };

  const calcDays = () => {
    if (!form.from || !form.to) return 0;
    const diff = (new Date(form.to) - new Date(form.from)) / 86400000;
    return diff < 0 ? 0 : diff + 1;
  };

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.employeeId) errs.employeeId = 'Select an employee.';
    if (!form.type)       errs.type       = 'Select leave type.';
    if (!form.from)       errs.from       = 'From date required.';
    if (!form.to)         errs.to         = 'To date required.';
    if (form.from && form.to && form.to < form.from) errs.to = 'End date must be after start date.';
    if (!form.reason.trim()) errs.reason  = 'Please provide a reason.';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    
    const emp = EMPLOYEES.find((e) => e.id === form.employeeId);
    onSave({ ...form, employeeName: emp?.name, department: emp?.department, days: calcDays() });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Apply for Leave">
      <form onSubmit={submit} noValidate className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Employee *</label>
          <Select error={errors.employeeId} value={form.employeeId} onChange={set('employeeId')}>
            <option value="">Select employee</option>
            {EMPLOYEES.map((e) => <option key={e.id} value={e.id}>{e.name} — {e.department}</option>)}
          </Select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Leave Type *</label>
          <Select error={errors.type} value={form.type} onChange={set('type')}>
            <option value="">Select leave type</option>
            {LEAVE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">From Date *</label>
            <Input type="date" error={errors.from} value={form.from} onChange={set('from')} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">To Date *</label>
            <Input type="date" error={errors.to} value={form.to} min={form.from} onChange={set('to')} />
          </div>
        </div>
        {form.from && form.to && form.to >= form.from && (
          <div className="flex items-center gap-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2">
            <CalendarClock className="h-4 w-4 text-indigo-500" />
            <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">Duration: <strong>{calcDays()} day{calcDays() !== 1 ? 's' : ''}</strong></span>
          </div>
        )}
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Reason *</label>
          <textarea 
            className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 ${
              errors.reason ? 'border-rose-400 bg-rose-50 text-slate-900 focus:border-rose-400 focus:ring-rose-400 dark:bg-rose-900/10 dark:text-white' : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white'
            }`} 
            rows={3} placeholder="Briefly describe the reason for leave…" value={form.reason} onChange={set('reason')} 
          />
          {errors.reason && (
            <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
              <AlertCircle className="h-3 w-3" />
              {errors.reason}
            </p>
          )}
        </div>
        <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" variant="primary" className="flex-1">Submit Request</Button>
        </div>
      </form>
    </Modal>
  );
};

// ─── Leave Management Page ────────────────────────────────────────────────────
const Leaves = () => {
  const { leaves, applyLeave, updateStatus, deleteLeave } = useLeaves();
  const [isLoading,    setIsLoading]    = useState(true);
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter,   setTypeFilter]   = useState('All');
  const [page,         setPage]         = useState(1);
  const [modalOpen,    setModalOpen]    = useState(false);
  const [deleteModal,  setDeleteModal]  = useState({ open: false, leaveId: null });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return leaves.filter((l) => {
      const matchSearch = !q || l.employeeName?.toLowerCase().includes(q) || l.type?.toLowerCase().includes(q) || l.department?.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'All' || l.status === statusFilter;
      const matchType   = typeFilter   === 'All' || l.type   === typeFilter;
      return matchSearch && matchStatus && matchType;
    }).sort((a, b) => b.appliedOn?.localeCompare(a.appliedOn));
  }, [leaves, search, statusFilter, typeFilter]);

  const pending  = leaves.filter((l) => l.status === 'Pending').length;
  const approved = leaves.filter((l) => l.status === 'Approved').length;
  const rejected = leaves.filter((l) => l.status === 'Rejected').length;
  const totalDaysApproved = leaves.filter((l) => l.status === 'Approved').reduce((s, l) => s + (l.days || 0), 0);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleApplyLeave = (data) => {
    applyLeave(data);
    toast.success('Leave requested successfully');
    setModalOpen(false);
  };

  const handleUpdateStatus = (id, newStatus) => {
    updateStatus(id, newStatus);
    if (newStatus === 'Approved') toast.success('Leave approved');
    else if (newStatus === 'Rejected') toast.success('Leave rejected');
    else toast.success('Leave reset to pending');
  };

  const handleDelete = () => {
    if (deleteModal.leaveId) {
      deleteLeave(deleteModal.leaveId);
      toast.success('Leave request deleted');
    }
    setDeleteModal({ open: false, leaveId: null });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="Leave Management" 
        description="Review, approve, and manage employee leave requests"
      >
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Apply for Leave
        </Button>
      </PageHeader>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={AlertCircle}  label="Pending Requests" value={pending}           color="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300" />
        <StatCard icon={CheckCircle2} label="Approved"          value={approved}          color="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300" />
        <StatCard icon={XCircle}      label="Rejected"           value={rejected}          color="bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300" />
        <StatCard icon={FileCheck}    label="Total Days Approved" value={totalDaysApproved} sub="All time" color="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300" />
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input type="text" placeholder="Search employee, type…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
          </div>
          <div className="flex flex-col justify-center gap-0.5">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Status</label>
            <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
              {STATUS_OPTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>
          <div className="flex flex-col justify-center gap-0.5">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Leave Type</label>
            <Select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}>
              <option value="All">All Types</option>
              {LEAVE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </Select>
          </div>
          {(statusFilter !== 'All' || typeFilter !== 'All' || search) && (
            <div className="flex items-end">
              <Button variant="danger" size="sm" onClick={() => { setStatusFilter('All'); setTypeFilter('All'); setSearch(''); setPage(1); }}>
                Clear
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            <p className="text-sm font-medium">Loading leaves...</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-slate-400">
            <CalendarClock className="h-10 w-10 opacity-40" />
            <p className="text-sm">No leave requests found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Employee</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 hidden md:table-cell">Leave Type</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 hidden lg:table-cell">Duration</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 hidden xl:table-cell">Reason</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginated.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-slate-900 dark:text-white">{l.employeeName}</p>
                      <p className="text-xs text-slate-400">{l.department}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="inline-flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                        {l.type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell text-slate-600 dark:text-slate-400">
                      <p className="text-xs font-medium">{new Date(l.from).toLocaleDateString('en-US', { month:'short', day:'numeric' })} → {new Date(l.to).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}</p>
                      <p className="text-xs text-slate-400">{l.days} day{l.days !== 1 ? 's' : ''}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden xl:table-cell max-w-xs">
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{l.reason}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={getStatusVariant(l.status)}>
                        {l.status === 'Pending' && <Clock className="mr-1 h-3 w-3" />}
                        {l.status === 'Approved' && <CheckCircle2 className="mr-1 h-3 w-3" />}
                        {l.status === 'Rejected' && <XCircle className="mr-1 h-3 w-3" />}
                        {l.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        {l.status === 'Pending' && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => handleUpdateStatus(l.id, 'Approved')} className="px-2" title="Approve">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleUpdateStatus(l.id, 'Rejected')} className="px-2" title="Reject">
                              <XCircle className="h-4 w-4 text-rose-500" />
                            </Button>
                          </>
                        )}
                        {l.status !== 'Pending' && (
                          <Button variant="ghost" size="sm" onClick={() => handleUpdateStatus(l.id, 'Pending')} className="px-2 text-xs" title="Reset to Pending">
                            Reset
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => setDeleteModal({ open: true, leaveId: l.id })} className="px-2" title="Delete">
                          <Trash2 className="h-4 w-4 text-rose-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-5 py-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing <span className="font-semibold">{(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)}</span> of <span className="font-semibold">{filtered.length}</span>
            </p>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" disabled={safePage === 1} onClick={() => setPage(safePage - 1)} className="px-2"><ChevronLeft className="h-4 w-4" /></Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button key={p} variant={p === safePage ? 'primary' : 'ghost'} size="sm" onClick={() => setPage(p)} className="px-3">{p}</Button>
              ))}
              <Button variant="ghost" size="sm" disabled={safePage === totalPages} onClick={() => setPage(safePage + 1)} className="px-2"><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        )}
      </Card>

      <LeaveModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleApplyLeave} />
      
      <ConfirmDialog
        isOpen={deleteModal.open}
        title="Delete Leave Request"
        message="Are you sure you want to permanently delete this leave request? This action cannot be undone."
        confirmLabel="Yes, Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, leaveId: null })}
      />
    </div>
  );
};

export default Leaves;
