import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, FileText, Download, TrendingUp, TrendingDown, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePayroll } from '../../hooks/usePayroll';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import toast from 'react-hot-toast';

const EmpPayroll = () => {
  const { user } = useAuth();
  const { records } = usePayroll();
  const [selectedSlip, setSelectedSlip] = useState(null);

  // Find all payslip records for this logged-in user (match by employeeId or employeeName)
  const mySlips = records.filter(
    (r) => r.employeeId === user?.id || r.employeeName === user?.name
  );

  // Calculate annual earnings
  const latestSalary = mySlips[0]?.earnings?.gross || (user?.salary ? Number(user.salary) / 12 : 7916.67);
  const latestNet = mySlips[0]?.net || latestSalary * 0.83;
  const latestDeduction = mySlips[0]?.deductions?.total || latestSalary * 0.17;

  const handleDownload = (slip) => {
    toast.loading('Generating payslip PDF...');
    setTimeout(() => {
      toast.dismiss();
      toast.success(`Downloaded payslip for ${slip.month} ${slip.year}`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* upper overview grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Monthly Gross Salary</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 flex items-center justify-center">
              <DollarSign className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              ₹{Math.round(latestSalary).toLocaleString('en-IN')}
            </span>
            <p className="text-xs text-slate-500 mt-1">Pre-deductions and taxes</p>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Net Take-Home</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              ₹{Math.round(latestNet).toLocaleString('en-IN')}
            </span>
            <p className="text-xs text-slate-500 mt-1">Directly credited to bank</p>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Total Deductions</span>
            <div className="h-8 w-8 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-600 flex items-center justify-center">
              <TrendingDown className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              ₹{Math.round(latestDeduction).toLocaleString('en-IN')}
            </span>
            <p className="text-xs text-slate-500 mt-1">PF, Tax, Insurance deductions</p>
          </div>
        </Card>
      </div>

      {/* Salary Details Card */}
      <Card className="p-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Salary Structure Breakdown</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">Earnings</h4>
            <div className="space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Basic Salary</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{Math.round(latestSalary * 0.65).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>House Rent Allowance (HRA)</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{Math.round(latestSalary * 0.20).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Transport Allowance</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{Math.round(latestSalary * 0.05).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Medical Allowance</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{Math.round(latestSalary * 0.03).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-2 font-bold text-slate-900 dark:text-white">
                <span>Gross Monthly Earnings</span>
                <span>₹{Math.round(latestSalary).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-2">Deductions</h4>
            <div className="space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Provident Fund (PF)</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{Math.round(latestSalary * 0.08).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Professional Tax</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{Math.round(latestSalary * 0.07).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Health Insurance Premium</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{Math.round(latestSalary * 0.02).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-2 font-bold text-slate-900 dark:text-white">
                <span>Total Deductions</span>
                <span>₹{Math.round(latestDeduction).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* History table */}
      <Card className="overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Payslips History</h3>
          <p className="text-xs text-slate-500">History of monthly salary distributions</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide">Month & Year</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide">Gross Earning</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide">Deductions</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide">Net Pay</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide">Status</th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {mySlips.map((slip) => (
                <tr key={slip.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-white">
                    {slip.month} {slip.year}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                    ₹{Math.round(slip.earnings?.gross || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                    ₹{Math.round(slip.deductions?.total || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300 font-semibold">
                    ₹{Math.round(slip.net || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={slip.status === 'Paid' ? 'success' : 'warning'}>
                      {slip.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedSlip(slip)}>
                      <FileText className="h-4 w-4 mr-1" /> View Detail
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDownload(slip)}>
                      <Download className="h-4 w-4 mr-1 text-indigo-500" /> Download
                    </Button>
                  </td>
                </tr>
              ))}
              {mySlips.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-500">
                    No payslips generated yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Payslip Modal View details */}
      <AnimatePresence>
        {selectedSlip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setSelectedSlip(null)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl text-sm"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Payslip Detail</h3>
                  <p className="text-xs text-slate-500">{selectedSlip.month} {selectedSlip.year}</p>
                </div>
                <button onClick={() => setSelectedSlip(null)} className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="h-4 w-4 text-slate-500" />
                </button>
              </div>

              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <p className="text-[11px] text-slate-500 font-semibold uppercase">Employee Name</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{selectedSlip.employeeName}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 font-semibold uppercase">Department</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{selectedSlip.department}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-2">
                  <div>
                    <h5 className="font-bold text-indigo-600 uppercase text-xs mb-2">Earnings</h5>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Basic</span>
                        <span>₹{Math.round(selectedSlip.earnings.basic).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>HRA</span>
                        <span>₹{Math.round(selectedSlip.earnings.hra).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transport</span>
                        <span>₹{Math.round(selectedSlip.earnings.transport).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Medical</span>
                        <span>₹{Math.round(selectedSlip.earnings.medical).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between font-bold border-t border-slate-100 dark:border-slate-800 pt-1.5">
                        <span>Gross Total</span>
                        <span>₹{Math.round(selectedSlip.earnings.gross).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-bold text-rose-500 uppercase text-xs mb-2">Deductions</h5>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Provident Fund</span>
                        <span>₹{Math.round(selectedSlip.deductions.pf).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Professional Tax</span>
                        <span>₹{Math.round(selectedSlip.deductions.tax).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Insurance</span>
                        <span>₹{Math.round(selectedSlip.deductions.insurance).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between font-bold border-t border-slate-100 dark:border-slate-800 pt-1.5">
                        <span>Deductions Total</span>
                        <span>₹{Math.round(selectedSlip.deductions.total).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex justify-between items-center bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                  <div>
                    <p className="text-[11px] text-slate-500 font-semibold uppercase">Net Take-Home Pay</p>
                    <p className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                      ₹{Math.round(selectedSlip.net).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <Button onClick={() => handleDownload(selectedSlip)}>
                    <Download className="h-4 w-4 mr-1.5" /> Download Payslip
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default EmpPayroll;
