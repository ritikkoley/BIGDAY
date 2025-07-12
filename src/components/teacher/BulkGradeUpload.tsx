import React, { useState } from 'react';
import { TeacherSubject, StudentRecord } from '../../types/teacher';
import { Upload, Download, FileSpreadsheet, AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface BulkGradeUploadProps {
  students: StudentRecord[];
  subjects: TeacherSubject[];
  onUpload: (file: File, examData: any) => Promise<void>;
  onCancel: () => void;
}

export const BulkGradeUpload: React.FC<BulkGradeUploadProps> = ({
  students,
  subjects,
  onUpload,
  onCancel
}) => {
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.id || '');
  const [examData, setExamData] = useState({
    examName: '',
    maxMarks: 100,
    examDate: '',
    term: 'Term 1',
    academicYear: '2024-25'
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          file.type === 'application/vnd.ms-excel') {
        setUploadedFile(file);
        setError(null);
      } else {
        setError('Please upload a valid Excel file (.xlsx or .xls)');
      }
    }
  };

  const downloadTemplate = () => {
    // Create CSV template data
    const headers = ['Student ID', 'Student Name', 'Email', 'Marks Obtained', 'Remarks', 'Feedback'];
    const rows = students.map(student => [
      student.rollNumber,
      student.name,
      student.email,
      '', // Empty for marks
      '', // Empty for remarks
      ''  // Empty for feedback
    ]);

    // Convert to CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `grades_template_${examData.examName || 'exam'}_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = async () => {
    if (!uploadedFile) {
      setError('Please upload an Excel file');
      return;
    }

    if (!examData.examName || !examData.examDate) {
      setError('Please fill in all exam details');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      await onUpload(uploadedFile, examData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const selectedSubjectData = subjects.find(s => s.id === selectedSubject);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium text-apple-gray-600 dark:text-white">
          Bulk Grade Upload
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-apple-gray-400 hover:text-apple-gray-600 dark:hover:text-apple-gray-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Exam Details */}
      <div className="apple-card p-6">
        <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4">
          Exam Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
            >
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
              Exam Name
            </label>
            <input
              type="text"
              value={examData.examName}
              onChange={(e) => setExamData({ ...examData, examName: e.target.value })}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
              placeholder="e.g., Mid Term Exam"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
              Maximum Marks
            </label>
            <input
              type="number"
              value={examData.maxMarks}
              onChange={(e) => setExamData({ ...examData, maxMarks: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
              Exam Date
            </label>
            <input
              type="date"
              value={examData.examDate}
              onChange={(e) => setExamData({ ...examData, examDate: e.target.value })}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
              Term
            </label>
            <select
              value={examData.term}
              onChange={(e) => setExamData({ ...examData, term: e.target.value })}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
            >
              <option value="Term 1">Term 1</option>
              <option value="Term 2">Term 2</option>
              <option value="Term 3">Term 3</option>
              <option value="Annual">Annual</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-apple-gray-600 dark:text-white mb-2">
              Academic Year
            </label>
            <input
              type="text"
              value={examData.academicYear}
              onChange={(e) => setExamData({ ...examData, academicYear: e.target.value })}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-apple-gray-200 dark:border-apple-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
              placeholder="e.g., 2024-25"
              required
            />
          </div>
        </div>
      </div>

      {/* Template Download */}
      <div className="apple-card p-6">
        <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4">
          Step 1: Download Template
        </h3>
        <p className="text-apple-gray-500 dark:text-apple-gray-400 mb-4">
          Download the Excel template with student information pre-filled. Enter marks in the "Marks Obtained" column.
        </p>
        <button
          onClick={downloadTemplate}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Download Template ({students.length} students)</span>
        </button>
      </div>

      {/* File Upload */}
      <div className="apple-card p-6">
        <h3 className="text-lg font-medium text-apple-gray-600 dark:text-white mb-4">
          Step 2: Upload Completed File
        </h3>
        <div className="border-2 border-dashed border-apple-gray-300 dark:border-apple-gray-600 rounded-lg p-8 text-center">
          <FileSpreadsheet className="w-12 h-12 text-apple-gray-400 mx-auto mb-4" />
          <div className="space-y-2">
            <p className="text-apple-gray-600 dark:text-white font-medium">
              Upload your completed Excel file
            </p>
            <p className="text-sm text-apple-gray-400 dark:text-apple-gray-300">
              Supports .xlsx and .xls files
            </p>
          </div>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
            id="excel-upload"
          />
          <label
            htmlFor="excel-upload"
            className="inline-flex items-center space-x-2 mt-4 px-4 py-2 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Choose File</span>
          </label>
        </div>

        {uploadedFile && (
          <div className="mt-4 flex items-center space-x-2 text-green-600 dark:text-green-400">
            <CheckCircle2 className="w-5 h-5" />
            <span>File uploaded: {uploadedFile.name}</span>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center space-x-2 text-red-500 dark:text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end space-x-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-apple-gray-600 dark:text-apple-gray-300 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-700 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!uploadedFile || isUploading || !examData.examName || !examData.examDate}
          className="flex items-center space-x-2 px-4 py-2 bg-apple-blue-500 text-white rounded-lg hover:bg-apple-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>Upload Grades</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};