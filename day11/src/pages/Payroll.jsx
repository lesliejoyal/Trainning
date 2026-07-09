import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search, Download, Eye, CheckCircle2, Clock, X,
  Printer, DollarSign, TrendingUp, CreditCard,
  ChevronLeft, ChevronRight, Briefcase, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { usePayroll } from '../hooks/usePayroll';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input, Select } from '../components/ui/Form';
import { PageHeader } from '../components/ui/PageHeader';
import { Modal } from '../components/ui/Modal';

// ─── Constants ────────────────────────────────────────────────────────────────
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DEPARTMENTS = ['All','Engineering','Product','Design','HR','Marketing','Finance','Sales','Operations'];
const PAGE_SIZE = 8;

const statusConfig = {
  Paid:    { variant: 'success', dot: 'bg-emerald-500' },
  Pending: { variant: 'warning', dot: 'bg-amber-500'   },
  Hold:    { variant: 'error',   dot: 'bg-rose-500'    },
};

const avatarGradients = [
  'from-indigo-500 to-violet-500','from-emerald-500 to-teal-500',
  'from-rose-500 to-pink-500','from-amber-500 to-orange-500',
  'from-sky-500 to-blue-500','from-fuchsia-500 to-purple-500',
];
const getGradient = (name = '') => avatarGradients[name.charCodeAt(0) % avatarGradients.length];

const fmt = (n) => `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

// ─── Payslip Modal ────────────────────────────────────────────────────────────
const PayslipModal = ({ record, onClose }) => {
  const printRef = useRef();

  if (!record) return null;

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open('', '_blank', 'width=800,height=600');
    win.document.write(`
      <html>
        <head>
          <title>Payslip – ${record.employeeName} – ${record.month} ${record.year}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1e293b; background: white; padding: 32px; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 20px; border-bottom: 2px solid #6366f1; margin-bottom: 20px; }
            .company { font-size: 22px; font-weight: 800; color: #6366f1; }
            .payslip-title { font-size: 13px; color: #64748b; margin-top: 4px; }
            .section { margin-bottom: 18px; }
            .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6366f1; margin-bottom: 10px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 24px; }
            .info-item label { font-size: 10px; color: #94a3b8; display: block; }
            .info-item span { font-size: 13px; font-weight: 600; color: #1e293b; }
            table { width: 100%; border-collapse: collapse; font-size: 13px; }
            th { background: #f1f5f9; padding: 8px 12px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; }
            td { padding: 8px 12px; border-bottom: 1px solid #f1f5f9; }
            td:last-child { text-align: right; font-weight: 600; }
            .total-row td { background: #f8fafc; font-weight: 700; border-top: 2px solid #e2e8f0; }
            .net-box { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border-radius: 12px; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; margin-top: 18px; }
            .net-label { font-size: 13px; opacity: 0.85; }
            .net-value { font-size: 28px; font-weight: 800; }
            .footer-note { margin-top: 24px; font-size: 10px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.print();
    win.close();
  };

  const { earnings: e, deductions: d } = record;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">Payslip</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{record.month} {record.year} · {record.employeeName}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handlePrint} className="px-3">
              <Printer className="mr-1.5 h-3.5 w-3.5" /> Print
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="px-2">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div ref={printRef} className="p-6 space-y-6">
          {/* Company Header */}
          <div className="header flex items-start justify-between pb-5 border-b-2 border-indigo-500">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">EMS Portal</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">123 Business Park, Tech City, CA 94105</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">payroll@ems.com · +1 (555) 000-0000</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900 dark:text-white">PAYSLIP</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{record.month} {record.year}</p>
              {record.paidOn && <p className="text-xs text-slate-500 dark:text-slate-400">Paid on: {new Date(record.paidOn).toLocaleDateString('en-US', {month:'short',day:'numeric',year:'numeric'})}</p>}
            </div>
          </div>

          {/* Employee Info */}
          <div className="section">
            <p className="section-title text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3">Employee Information</p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4">
              {[
                { label: 'Employee Name', value: record.employeeName },
                { label: 'Employee ID',   value: `EMP-${record.employeeId.toString().padStart(4, '0')}` },
                { label: 'Department',    value: record.department },
                { label: 'Designation',   value: record.role },
                { label: 'Pay Period',    value: `${record.month} ${record.year}` },
                { label: 'Payment Status',value: record.status },
              ].map(({ label, value }) => (
                <div key={label} className="info-item">
                  <label className="block text-xs text-slate-400 dark:text-slate-500 mb-0.5">{label}</label>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="section-title text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-3">Earnings</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 rounded-tl-lg">Component</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 rounded-tr-lg">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {[
                    ['Basic Salary',     e.basic],
                    ['HRA (20%)',        e.hra],
                    ['Transport Allow.', e.transport],
                    ['Medical Allow.',   e.medical],
                    ['Special Allow.',   e.special],
                  ].map(([label, val]) => (
                    <tr key={label}>
                      <td className="px-4 py-2 text-slate-600 dark:text-slate-400">{label}</td>
                      <td className="px-4 py-2 text-right font-semibold text-slate-900 dark:text-white">{fmt(val)}</td>
                    </tr>
                  ))}
                  <tr className="bg-emerald-50 dark:bg-emerald-900/20">
                    <td className="px-4 py-2 font-bold text-emerald-700 dark:text-emerald-400">Gross Earnings</td>
                    <td className="px-4 py-2 text-right font-bold text-emerald-700 dark:text-emerald-400">{fmt(e.gross)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <p className="section-title text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400 mb-3">Deductions</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 rounded-tl-lg">Component</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 rounded-tr-lg">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {[
                    ['Provident Fund (12%)', d.pf],
                    ['Income Tax (10%)',     d.tax],
                    ['Health Insurance (2%)',d.insurance],
                  ].map(([label, val]) => (
                    <tr key={label}>
                      <td className="px-4 py-2 text-slate-600 dark:text-slate-400">{label}</td>
                      <td className="px-4 py-2 text-right font-semibold text-slate-900 dark:text-white">{fmt(val)}</td>
                    </tr>
                  ))}
                  <tr className="bg-rose-50 dark:bg-rose-900/20">
                    <td className="px-4 py-2 font-bold text-rose-700 dark:text-rose-400">Total Deductions</td>
                    <td className="px-4 py-2 text-right font-bold text-rose-700 dark:text-rose-400">{fmt(d.total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="net-box flex items-center justify-between rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 text-white">
            <div>
              <p className="net-label text-sm text-indigo-100">Net Pay (Take Home)</p>
              <p className="text-xs text-indigo-200 mt-0.5">After all deductions</p>
            </div>
            <p className="net-value text-3xl font-extrabold">{fmt(record.net)}</p>
          </div>

          <p className="footer-note text-center text-xs text-slate-400 dark:text-slate-600 pt-2">
            This is a system-generated payslip and does not require a signature. For queries, contact payroll@ems.com
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Generate Payroll Modal ───────────────────────────────────────────────────
const GenerateModal = ({ isOpen, onClose, onGenerate }) => {
  const [month, setMonth] = useState(MONTHS[new Date().getMonth()]);
  const [year,  setYear]  = useState(2026);

  if (!isOpen) return null;

  const handleGenerate = () => {
    onGenerate(month, year);
    toast.success(`Payroll for ${month} ${year} generated successfully`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generate Payroll">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Month</label>
          <Select value={month} onChange={(e) => setMonth(e.target.value)}>
            {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
          </Select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Year</label>
          <Input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} min={2020} max={2030} />
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
        <Button variant="primary" onClick={handleGenerate} className="flex-1">Generate</Button>
      </div>
    </Modal>
  );
};

// ─── Payroll Page ─────────────────────────────────────────────────────────────
const Payroll = () => {
  const { records, updateStatus, generatePayslips } = usePayroll();
  const currentMonthName = MONTHS[new Date().getMonth()];

  const [isLoading,    setIsLoading]    = useState(true);
  const [search,       setSearch]       = useState('');
  const [monthFilter,  setMonthFilter]  = useState(currentMonthName);
  const [deptFilter,   setDeptFilter]   = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page,         setPage]         = useState(1);
  const [viewRecord,   setViewRecord]   = useState(null);
  const [genModalOpen, setGenModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return records.filter((r) => {
      const matchSearch = !q || r.employeeName?.toLowerCase().includes(q) || r.department?.toLowerCase().includes(q) || r.role?.toLowerCase().includes(q);
      const matchMonth  = !monthFilter  || monthFilter  === 'All' || r.month === monthFilter;
      const matchDept   = deptFilter   === 'All' || r.department === deptFilter;
      const matchStatus = statusFilter === 'All' || r.status === statusFilter;
      return matchSearch && matchMonth && matchDept && matchStatus;
    });
  }, [records, search, monthFilter, deptFilter, statusFilter]);

  // Summary for current month filter
  const monthRecords  = records.filter((r) => r.month === monthFilter);
  const totalPayroll  = monthRecords.reduce((s, r) => s + r.net, 0);
  const avgSalary     = monthRecords.length ? Math.round(monthRecords.reduce((s, r) => s + r.earnings.basic, 0) / monthRecords.length) : 0;
  const paidCount     = monthRecords.filter((r) => r.status === 'Paid').length;
  const pendingCount  = monthRecords.filter((r) => r.status === 'Pending').length;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const StatCard = ({ icon: Icon, label, value, sub, color }) => (
    <Card className={`flex items-center gap-4 p-5 ${color} shadow-sm border-none`}>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/60 dark:bg-black/20">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium opacity-70">{label}</p>
        <p className="text-xl font-extrabold truncate">{value}</p>
        {sub && <p className="text-xs opacity-60">{sub}</p>}
      </div>
    </Card>
  );

  const handleUpdateStatus = (id, newStatus) => {
    updateStatus(id, newStatus);
    if (newStatus === 'Paid') toast.success('Payslip marked as paid');
    else if (newStatus === 'Hold') toast.success('Payslip put on hold');
    else toast.success('Payslip status updated to pending');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="Payroll" 
        description="Manage salary, payslips, and payment status"
      >
        <Button onClick={() => setGenModalOpen(true)}>
          <CreditCard className="mr-2 h-4 w-4" /> Generate Payroll
        </Button>
      </PageHeader>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {MONTHS.map((m) => (
          <button key={m} onClick={() => { setMonthFilter(m); setPage(1); }}
            className={`shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${monthFilter === m ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
            {m}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={DollarSign}  label="Total Payroll"  value={`$${Math.round(totalPayroll).toLocaleString()}`} sub={`${monthFilter} 2026`} color="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300" />
        <StatCard icon={TrendingUp}  label="Avg Basic Salary" value={`$${avgSalary.toLocaleString()}`} sub="Per employee" color="bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-300" />
        <StatCard icon={CheckCircle2}label="Paid"             value={paidCount}  sub="Payslips" color="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300" />
        <StatCard icon={Clock}       label="Pending"          value={pendingCount} sub="Awaiting payment" color="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300" />
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input type="text" placeholder="Search employee, department, role…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
          </div>
          <div className="flex flex-col justify-center gap-0.5">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Department</label>
            <Select value={deptFilter} onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }}>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </Select>
          </div>
          <div className="flex flex-col justify-center gap-0.5">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Status</label>
            <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
              {['All','Paid','Pending','Hold'].map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>
          {(deptFilter !== 'All' || statusFilter !== 'All' || search) && (
            <div className="flex items-end">
              <Button variant="danger" size="sm" onClick={() => { setDeptFilter('All'); setStatusFilter('All'); setSearch(''); setPage(1); }}>
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
            <p className="text-sm font-medium">Loading payroll...</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-slate-400">
            <DollarSign className="h-10 w-10 opacity-40" />
            <p className="text-sm">No payroll records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Employee</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 hidden md:table-cell">Gross</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 hidden lg:table-cell">Deductions</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Net Pay</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 hidden sm:table-cell">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginated.map((r) => {
                  const sc = statusConfig[r.status] || { variant:'default', dot:'bg-slate-400' };
                  const initials = r.employeeName?.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0,2);
                  return (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${getGradient(r.employeeName)} text-xs font-bold text-white shadow-sm`}>
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{r.employeeName}</p>
                            <p className="text-xs text-slate-400">{r.role} · {r.department}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right hidden md:table-cell text-slate-600 dark:text-slate-300 font-medium">{fmt(r.earnings.gross)}</td>
                      <td className="px-5 py-3.5 text-right hidden lg:table-cell text-rose-500 dark:text-rose-400 font-medium">−{fmt(r.deductions.total)}</td>
                      <td className="px-5 py-3.5 text-right">
                        <span className="font-bold text-slate-900 dark:text-white">{fmt(r.net)}</span>
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell">
                        <Badge variant={sc.variant}>{r.status}</Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setViewRecord(r)} className="px-2" title="View Payslip">
                            <Eye className="h-4 w-4 text-indigo-500" />
                          </Button>
                          {r.status === 'Pending' && (
                            <Button variant="ghost" size="sm" onClick={() => handleUpdateStatus(r.id, 'Paid')} className="px-2" title="Mark as Paid">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            </Button>
                          )}
                          {r.status === 'Paid' && (
                            <Button variant="ghost" size="sm" onClick={() => handleUpdateStatus(r.id, 'Hold')} className="px-2 text-xs text-amber-500" title="Put on Hold">
                              Hold
                            </Button>
                          )}
                          {r.status === 'Hold' && (
                            <Button variant="ghost" size="sm" onClick={() => handleUpdateStatus(r.id, 'Pending')} className="px-2 text-xs" title="Set to Pending">
                              Release
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
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

      <PayslipModal record={viewRecord} onClose={() => setViewRecord(null)} />
      <GenerateModal isOpen={genModalOpen} onClose={() => setGenModalOpen(false)} onGenerate={generatePayslips} />
    </div>
  );
};

export default Payroll;
