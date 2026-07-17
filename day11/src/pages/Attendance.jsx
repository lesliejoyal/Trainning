import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, Clock, UserCheck, UserX, CalendarDays, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAttendance } from '../hooks/useAttendance';
import ConfirmDialog from '../components/employees/ConfirmDialog';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input, Select } from '../components/ui/Form';
import { PageHeader } from '../components/ui/PageHeader';
import { Modal } from '../components/ui/Modal';

// ─── Constants ────────────────────────────────────────────────────────────────
const STATUSES    = ['All', 'Present', 'Absent', 'Late', 'Half Day'];
const ATT_STATUSES = ['Present', 'Absent', 'Late', 'Half Day'];
const EMPLOYEES   = [
  { id: '1', name: 'Kavitha Kanimozhi',   department: 'Engineering' },
  { id: '2', name: 'Arivoli Subramanian', department: 'Product'     },
  { id: '3', name: 'Oviya Thamarai',      department: 'Design'      },
  { id: '4', name: 'Meenakshi Nandhini',  department: 'HR'          },
  { id: '6', name: 'Elango Murugan',      department: 'Engineering' },
  { id: '7', name: 'Vikram Ramasamy',     department: 'Finance'     },
  { id: '8', name: 'Arulozhi Senthil',    department: 'Engineering' },
];
const PAGE_SIZE = 8;

const getStatusVariant = (status) => {
  switch (status) {
    case 'Present': return 'success';
    case 'Absent': return 'error';
    case 'Late': return 'warning';
    case 'Half Day': return 'info';
    default: return 'default';
  }
};

const StatCard = ({ icon: Icon, label, value, color }) => (
  <Card className={`flex items-center gap-4 p-5 ${color} shadow-sm border-none transition-all duration-200 hover:shadow-md hover:-translate-y-1 rounded-xl`}>
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/60 dark:bg-black/20">
      <Icon className="h-6 w-6" />
    </div>
    <div>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="text-3xl font-extrabold">{value}</p>
    </div>
  </Card>
);

// ─── Mark Attendance Modal ────────────────────────────────────────────────────
const MarkModal = ({ isOpen, onClose, onSave, existing }) => {
  const isEdit = Boolean(existing);
  const [form, setForm] = useState({ employeeId: '', date: new Date().toISOString().slice(0,10), status: 'Present', checkIn: '09:00', checkOut: '18:00' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
       
      setForm(existing ? { employeeId: existing.employeeId, date: existing.date, status: existing.status, checkIn: existing.checkIn || '', checkOut: existing.checkOut || '' } : { employeeId: '', date: new Date().toISOString().slice(0,10), status: 'Present', checkIn: '09:00', checkOut: '18:00' });
       
      setErrors({});
    }
  }, [isOpen, existing]);

  const set = (k) => (e) => { setForm((p) => ({ ...p, [k]: e.target.value })); setErrors((p) => ({ ...p, [k]: '' })); };

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.employeeId) errs.employeeId = 'Select an employee.';
    if (!form.date)       errs.date       = 'Date is required.';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    
    const emp = EMPLOYEES.find((e) => e.id === form.employeeId);
    onSave({ ...form, employeeName: emp?.name, department: emp?.department, checkIn: form.status === 'Absent' ? '' : form.checkIn, checkOut: form.status === 'Absent' ? '' : form.checkOut });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Attendance' : 'Mark Attendance'}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Employee *</label>
          <Select error={errors.employeeId} value={form.employeeId} onChange={set('employeeId')} disabled={isEdit}>
            <option value="">Select employee</option>
            {EMPLOYEES.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Date *</label>
            <Input type="date" error={errors.date} value={form.date} onChange={set('date')} disabled={isEdit} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Status *</label>
            <Select value={form.status} onChange={set('status')}>
              {ATT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>
        </div>
        {form.status !== 'Absent' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Check In</label>
              <Input type="time" value={form.checkIn} onChange={set('checkIn')} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Check Out</label>
              <Input type="time" value={form.checkOut} onChange={set('checkOut')} />
            </div>
          </div>
        )}
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" variant="primary" className="flex-1">
            {isEdit ? 'Update' : 'Save'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// ─── Attendance Page ──────────────────────────────────────────────────────────
const Attendance = () => {
  const { records, addRecord, updateRecord, deleteRecord } = useAttendance();
  const today = new Date().toISOString().slice(0, 10);

  const [isLoading,   setIsLoading]   = useState(true);
  const [search,      setSearch]      = useState('');
  const [dateFilter,  setDateFilter]  = useState(today);
  const [statusFilter,setStatusFilter]= useState('All');
  const [page,        setPage]        = useState(1);
  const [modal,       setModal]       = useState({ open: false, record: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, recordId: null });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return records.filter((r) => {
      const matchDate   = !dateFilter || r.date === dateFilter;
      const matchStatus = statusFilter === 'All' || r.status === statusFilter;
      const matchSearch = !q || r.employeeName?.toLowerCase().includes(q) || r.department?.toLowerCase().includes(q);
      return matchDate && matchStatus && matchSearch;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [records, dateFilter, statusFilter, search]);

  const todayRecords = records.filter((r) => r.date === today);
  const countByStatus = (s) => todayRecords.filter((r) => r.status === s).length;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleSave = (data) => {
    if (modal.record) {
      updateRecord(modal.record.id, data);
      toast.success('Attendance updated successfully');
    } else {
      addRecord(data);
      toast.success('Attendance marked successfully');
    }
    setModal({ open: false, record: null });
  };

  const handleDelete = () => {
    if (deleteModal.recordId) {
      deleteRecord(deleteModal.recordId);
      toast.success('Attendance record deleted');
    }
    setDeleteModal({ open: false, recordId: null });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="Attendance" 
        description="Track daily employee attendance records"
      >
        <Button onClick={() => setModal({ open: true, record: null })}>
          <Plus className="mr-2 h-4 w-4" /> Mark Attendance
        </Button>
      </PageHeader>

      {/* Today's stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={UserCheck}   label="Present Today"  value={countByStatus('Present')}  color="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300" />
        <StatCard icon={UserX}       label="Absent Today"   value={countByStatus('Absent')}   color="bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300" />
        <StatCard icon={Clock}       label="Late Today"     value={countByStatus('Late')}     color="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300" />
        <StatCard icon={CalendarDays}label="Half Day"       value={countByStatus('Half Day')} color="bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-300" />
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input type="text" placeholder="Search employee…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
          </div>
          <div className="flex flex-col justify-center gap-0.5">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Date</label>
            <Input type="date" value={dateFilter} onChange={(e) => { setDateFilter(e.target.value); setPage(1); }} />
          </div>
          <div className="flex flex-col justify-center gap-0.5">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Status</label>
            <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>
          {(dateFilter !== today || statusFilter !== 'All' || search) && (
            <div className="flex items-end">
              <Button variant="danger" size="sm" onClick={() => { setDateFilter(today); setStatusFilter('All'); setSearch(''); setPage(1); }}>
                Reset
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            <p className="text-sm font-medium">Loading attendance...</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-slate-400">
            <CalendarDays className="h-10 w-10 opacity-40" />
            <p className="text-sm">No attendance records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Employee</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 hidden md:table-cell">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 hidden lg:table-cell">Check In</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 hidden lg:table-cell">Check Out</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginated.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-slate-900 dark:text-white">{r.employeeName}</p>
                      <p className="text-xs text-slate-400">{r.department}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell text-slate-600 dark:text-slate-400">
                      {new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell text-slate-600 dark:text-slate-400 font-mono">{r.checkIn || '—'}</td>
                    <td className="px-5 py-3.5 hidden lg:table-cell text-slate-600 dark:text-slate-400 font-mono">{r.checkOut || '—'}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={getStatusVariant(r.status)}>{r.status}</Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setModal({ open: true, record: r })} className="px-2">
                          <Pencil className="h-4 w-4 text-amber-500" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteModal({ open: true, recordId: r.id })} className="px-2">
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

      <MarkModal isOpen={modal.open} onClose={() => setModal({ open: false, record: null })} onSave={handleSave} existing={modal.record} />
      
      <ConfirmDialog
        isOpen={deleteModal.open}
        title="Delete Attendance Record"
        message="Are you sure you want to permanently delete this attendance record? This action cannot be undone."
        confirmLabel="Yes, Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, recordId: null })}
      />
    </div>
  );
};

export default Attendance;
