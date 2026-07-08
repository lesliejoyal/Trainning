import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { studentAPI } from '../services/api';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

export const StudentForm = ({ student, onClose }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: student || {
      rollNumber: '',
      name: '',
      department: '',
      course: '',
      year: '',
      semester: '',
      section: '',
      gender: '',
      dob: '',
      email: '',
      phone: '',
      address: '',
      parentName: '',
      parentPhone: '',
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response = student
        ? await studentAPI.update(student.studentId, data)
        : await studentAPI.create(data);

      if (response.success) {
        toast.success(
          student
            ? 'Student updated successfully'
            : 'Student created successfully'
        );
        reset();
        onClose();
      } else {
        toast.error(response.message || 'Operation failed');
      }
    } catch (error) {
      toast.error('Error saving student');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-bold">
            {student ? 'Edit Student' : 'Add New Student'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Basic Information */}
          <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Roll Number *</label>
                <input
                  type="text"
                  {...register('rollNumber', { required: 'Roll number is required' })}
                  className="input"
                  placeholder="CSE001"
                />
                {errors.rollNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.rollNumber.message}</p>
                )}
              </div>

              <div>
                <label className="label">Name *</label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="input"
                  placeholder="Student Name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="label">Department *</label>
                <select
                  {...register('department', { required: 'Department is required' })}
                  className="input"
                >
                  <option value="">Select Department</option>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="ECE">ECE</option>
                  <option value="MECH">MECH</option>
                </select>
                {errors.department && (
                  <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>
                )}
              </div>

              <div>
                <label className="label">Course</label>
                <input
                  type="text"
                  {...register('course')}
                  className="input"
                  placeholder="B.Tech"
                />
              </div>

              <div>
                <label className="label">Year *</label>
                <select
                  {...register('year', { required: 'Year is required' })}
                  className="input"
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
                {errors.year && (
                  <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>
                )}
              </div>

              <div>
                <label className="label">Semester</label>
                <select
                  {...register('semester')}
                  className="input"
                >
                  <option value="">Select Semester</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                  <option value="3">Semester 3</option>
                  <option value="4">Semester 4</option>
                  <option value="5">Semester 5</option>
                  <option value="6">Semester 6</option>
                  <option value="7">Semester 7</option>
                  <option value="8">Semester 8</option>
                </select>
              </div>

              <div>
                <label className="label">Section</label>
                <select
                  {...register('section')}
                  className="input"
                >
                  <option value="">Select Section</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>

              <div>
                <label className="label">Gender</label>
                <select
                  {...register('gender')}
                  className="input"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="label">Date of Birth</label>
                <input
                  type="date"
                  {...register('dob')}
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  {...register('email')}
                  className="input"
                  placeholder="student@example.com"
                />
              </div>

              <div>
                <label className="label">Phone</label>
                <input
                  type="tel"
                  {...register('phone')}
                  className="input"
                  placeholder="9876543210"
                />
              </div>

              <div className="md:col-span-2">
                <label className="label">Address</label>
                <textarea
                  {...register('address')}
                  className="input"
                  placeholder="Street, City, State"
                  rows="2"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Parent Information */}
          <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
            <h3 className="font-semibold mb-4">Parent Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Parent Name</label>
                <input
                  type="text"
                  {...register('parentName')}
                  className="input"
                  placeholder="Parent Name"
                />
              </div>

              <div>
                <label className="label">Parent Phone</label>
                <input
                  type="tel"
                  {...register('parentPhone')}
                  className="input"
                  placeholder="9876543210"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-1 disabled:opacity-50"
            >
              {loading ? 'Saving...' : student ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
