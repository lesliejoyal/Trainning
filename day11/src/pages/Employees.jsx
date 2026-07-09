import { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Filter, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, X, Users, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useEmployees } from '../hooks/useEmployees';
import EmployeeModal from '../components/employees/EmployeeModal';
import EmployeeViewModal from '../components/employees/EmployeeViewModal';
import ConfirmDialog from '../components/employees/ConfirmDialog';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input, Select } from '../components/ui/Form';
import { PageHeader } from '../components/ui/PageHeader';

const DEPARTMENTS = ['All', 'Engineering', 'Product', 'Design', 'HR', 'Marketing', 'Finance', 'Sales', 'Operations'];
const STATUSES    = ['All', 'Active', 'On Leave', 'Remote', 'Terminated'];
const PAGE_SIZE   = 7;

const avatarGradients = [
  'from-indigo-500 to-violet-500', 'from-emerald-500 to-teal-500',
  'from-rose-500 to-pink-500',     'from-amber-500 to-orange-500',
  'from-sky-500 to-blue-500',      'from-fuchsia-500 to-purple-500',
];
const getGradient = (name = '') => avatarGradients[name.charCodeAt(0) % avatarGradients.length];

const Employees = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useEmployees();

  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch]         = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage]             = useState(1);
  const [modal, setModal]         = useState({ type: null, employee: null });

  useEffect(() => {
    // Simulate loading state for 500ms on mount
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return employees.filter((emp) => {
      const matchSearch = !q || [emp.firstName, emp.lastName, emp.email, emp.role, emp.department]
        .some((f) => f?.toLowerCase().includes(q));
      const matchDept   = deptFilter   === 'All' || emp.department === deptFilter;
      const matchStatus = statusFilter === 'All' || emp.status     === statusFilter;
      return matchSearch && matchDept && matchStatus;
    });
  }, [employees, search, deptFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const resetPage = () => setPage(1);

  const openAdd    = () => setModal({ type: 'add',  employee: null });
  const openEdit   = (emp) => setModal({ type: 'edit', employee: emp });
  const openView   = (emp) => setModal({ type: 'view', employee: emp });
  const openDelete = (emp) => setModal({ type: 'delete', employee: emp });
  const closeModal = () => setModal({ type: null, employee: null });

  const handleSave = (data) => {
    if (modal.type === 'add') {
      addEmployee(data);
      toast.success('Employee added successfully');
    }
    if (modal.type === 'edit') {
      updateEmployee(modal.employee.id, data);
      toast.success('Employee updated successfully');
    }
    closeModal();
  };

  const handleDelete = () => {
    deleteEmployee(modal.employee.id);
    toast.success('Employee deleted successfully');
    closeModal();
  };

  const activeFilters = [deptFilter !== 'All', statusFilter !== 'All'].filter(Boolean).length;

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'On Leave': return 'warning';
      case 'Terminated': return 'error';
      case 'Remote': return 'info';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="Employees" 
        description={`${filtered.length} of ${employees.length} employees`}
      >
        <Button onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Employee
        </Button>
      </PageHeader>

      <Card>
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by name, email, role, department…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetPage(); }}
              className="pl-10"
            />
            {search && (
              <button onClick={() => { setSearch(''); resetPage(); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Button
            variant={showFilters || activeFilters > 0 ? 'primary' : 'secondary'}
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {activeFilters > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {activeFilters}
              </span>
            )}
          </Button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-3 border-t border-slate-100 dark:border-slate-800 px-4 pb-4 pt-3">
            <div className="flex flex-col gap-1 w-40">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Department</span>
              <Select value={deptFilter} onChange={(e) => { setDeptFilter(e.target.value); resetPage(); }}>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
            </div>

            <div className="flex flex-col gap-1 w-40">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Status</span>
              <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); resetPage(); }}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </div>

            {activeFilters > 0 && (
              <div className="flex flex-col justify-end">
                <Button variant="danger" size="sm" onClick={() => { setDeptFilter('All'); setStatusFilter('All'); resetPage(); }}>
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            <p className="text-sm font-medium">Loading employees...</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <Users className="h-12 w-12 opacity-40" />
            <p className="text-sm font-medium">No employees match your filters.</p>
            <Button variant="ghost" onClick={() => { setSearch(''); setDeptFilter('All'); setStatusFilter('All'); }}>
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Employee</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 hidden md:table-cell">Department</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 hidden lg:table-cell">Salary</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 hidden xl:table-cell">Joined</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginated.map((emp) => {
                  const fullName = `${emp.firstName} ${emp.lastName}`;
                  const initials = `${emp.firstName[0]}${emp.lastName[0]}`.toUpperCase();
                  return (
                    <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${getGradient(fullName)} text-xs font-bold text-white shadow-sm`}>
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{fullName}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <p className="font-medium text-slate-900 dark:text-white">{emp.department}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{emp.role}</p>
                      </td>
                      <td className="px-5 py-3.5 hidden lg:table-cell">
                        <span className="font-medium text-slate-900 dark:text-white">
                          ${Number(emp.salary).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={getStatusVariant(emp.status)}>{emp.status}</Badge>
                      </td>
                      <td className="px-5 py-3.5 hidden xl:table-cell text-slate-500 dark:text-slate-400">
                        {new Date(emp.joinDate).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openView(emp)} className="px-2">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openEdit(emp)} className="px-2">
                            <Pencil className="h-4 w-4 text-amber-500" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openDelete(emp)} className="px-2">
                            <Trash2 className="h-4 w-4 text-rose-500" />
                          </Button>
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
              <Button
                variant="ghost" size="sm"
                disabled={safePage === 1}
                onClick={() => setPage(safePage - 1)}
                className="px-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p} size="sm"
                  variant={p === safePage ? 'primary' : 'ghost'}
                  onClick={() => setPage(p)}
                  className="px-3"
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="ghost" size="sm"
                disabled={safePage === totalPages}
                onClick={() => setPage(safePage + 1)}
                className="px-2"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      <EmployeeModal
        isOpen={modal.type === 'add' || modal.type === 'edit'}
        employee={modal.type === 'edit' ? modal.employee : null}
        onClose={closeModal}
        onSave={handleSave}
      />

      <EmployeeViewModal
        isOpen={modal.type === 'view'}
        employee={modal.employee}
        onClose={closeModal}
        onEdit={() => setModal({ type: 'edit', employee: modal.employee })}
      />

      <ConfirmDialog
        isOpen={modal.type === 'delete'}
        title="Delete Employee"
        message={`Are you sure you want to permanently delete ${modal.employee?.firstName} ${modal.employee?.lastName}? This action cannot be undone.`}
        confirmLabel="Yes, Delete"
        onConfirm={handleDelete}
        onCancel={closeModal}
      />
    </div>
  );
};

export default Employees;
