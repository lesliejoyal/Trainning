import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { attendanceAPI } from '../services/api';
import toast from 'react-hot-toast';
import { FileText, Download, Filter } from 'lucide-react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

export const Reports = () => {
  const [reports, setReports] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    startDate: format(new Date(new Date().setDate(new Date().getDate() - 30)), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    department: '',
    year: '',
    semester: '',
    section: '',
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateReport = async () => {
    try {
      setLoading(true);
      const response = await attendanceAPI.getReports(filters);

      if (response.success) {
        setReports(response.data);
        setSummary(response.summary);
        toast.success('Report generated successfully');
      } else {
        toast.error('Failed to generate report');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Error generating report');
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (reports.length === 0) {
      toast.error('No data to export');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(reports);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Report');

    const filename = `attendance_report_${format(new Date(), 'yyyy-MM-dd_HHmmss')}.xlsx`;
    XLSX.writeFile(workbook, filename);
    toast.success('Report exported successfully');
  };

  const exportToCSV = () => {
    if (reports.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = [
      'Roll Number',
      'Student Name',
      'Department',
      'Year',
      'Total Days',
      'Present Days',
      'Absent Days',
      'Attendance %',
    ];

    const rows = reports.map((report) => [
      report.rollNumber,
      report.name,
      report.department,
      report.year,
      report.totalDays,
      report.presentDays,
      report.absentDays,
      report.attendancePercentage,
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach((row) => {
      csv += row.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_report_${format(new Date(), 'yyyy-MM-dd_HHmmss')}.csv`;
    a.click();
    toast.success('CSV exported successfully');
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Attendance Reports
        </h1>

        {/* Filters */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Date Range */}
            <div>
              <label className="label">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="label">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="input"
              />
            </div>

            {/* Department */}
            <div>
              <label className="label">Department</label>
              <select
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                className="input"
              >
                <option value="">All Departments</option>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="MECH">MECH</option>
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="label">Year</label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="input"
              >
                <option value="">All Years</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            {/* Semester */}
            <div>
              <label className="label">Semester</label>
              <select
                value={filters.semester}
                onChange={(e) => handleFilterChange('semester', e.target.value)}
                className="input"
              >
                <option value="">All Semesters</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>

            {/* Section */}
            <div>
              <label className="label">Section</label>
              <select
                value={filters.section}
                onChange={(e) => handleFilterChange('section', e.target.value)}
                className="input"
              >
                <option value="">All Sections</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>
          </div>

          <button
            onClick={generateReport}
            disabled={loading}
            className="btn btn-primary w-full md:w-auto disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>

        {/* Summary */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Students</p>
              <p className="text-2xl font-bold mt-2">{summary.totalStudents}</p>
            </div>
            <div className="card p-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Present</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {summary.totalPresent}
              </p>
            </div>
            <div className="card p-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Absent</p>
              <p className="text-2xl font-bold text-red-600 mt-2">{summary.totalAbsent}</p>
            </div>
          </div>
        )}

        {/* Export Buttons */}
        {reports.length > 0 && (
          <div className="flex gap-4">
            <button
              onClick={exportToExcel}
              className="btn btn-primary flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export to Excel
            </button>
            <button
              onClick={exportToCSV}
              className="btn btn-secondary flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export to CSV
            </button>
          </div>
        )}

        {/* Report Table */}
        {reports.length > 0 && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Roll Number
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Department</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Year</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">Total Days</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">Present</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">Absent</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">
                      Attendance %
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {reports.map((report, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm">{report.rollNumber}</td>
                      <td className="px-6 py-4 text-sm font-medium">{report.name}</td>
                      <td className="px-6 py-4 text-sm">{report.department}</td>
                      <td className="px-6 py-4 text-sm">{report.year}</td>
                      <td className="px-6 py-4 text-center text-sm">{report.totalDays || 0}</td>
                      <td className="px-6 py-4 text-center text-sm text-green-600 font-medium">
                        {report.presentDays || 0}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-red-600 font-medium">
                        {report.absentDays || 0}
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-semibold">
                        {report.attendancePercentage || 0}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && reports.length === 0 && (
          <div className="card p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No reports generated yet. Use filters and click "Generate Report" to create one.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Reports;
