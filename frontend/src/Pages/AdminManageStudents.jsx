import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  User, Mail, Phone, Calendar, FileText, GraduationCap,
  Edit, Trash2
} from 'lucide-react';
import SearchBar from '../Components/SearchBar';
import StudentForm from '../Components/StudentForm';
import { useTheme } from '../context/ThemeContect.jsx';

const StudentManagement = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:3000/api/students/');
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) =>
      `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (student) => {
    setCurrentStudent(student);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setCurrentStudent(null);
  };

  const handleSubmit = async (studentData) => {
    try {
      const response = await axios.put(`http://127.0.0.1:3000/api/students/${currentStudent.id}/`, studentData);
      setStudents(students.map(s => s.id === currentStudent.id ? response.data : s));
      setShowForm(false);
      setCurrentStudent(null);
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    setIsDeleting(true);
    try {
      await axios.delete(`http://127.0.0.1:3000/api/students/${id}/delete/`);
      setStudents(prev => prev.filter(student => student.id !== id));
    } catch (error) {
      console.error("Error deleting student:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-4 shadow-lg ${
                isDark
                    ? 'bg-gradient-to-br from-red-500 to-red-700'
                    : 'bg-gradient-to-br from-red-400 to-red-600'
            }`}>
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-4xl font-bold text-transparent bg-clip-text ${
                isDark
                    ? 'bg-gradient-to-r from-red-400 to-gray-400'
                    : 'bg-gradient-to-r from-red-600 to-gray-700'
            }`}>
              Student Management
            </h1>
          </div>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Manage your students
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto">
          <SearchBar onSearch={setSearchTerm} />
        </div>

        {/* Edit Form */}
        {showForm && (
            <StudentForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                mode="edit"
                initialData={currentStudent}
            />
        )}

        {/* Student Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                  <div
                      key={student.id}
                      className={`group rounded-2xl p-6 shadow-lg border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                          isDark
                              ? 'backdrop-blur-lg bg-gray-900/30 border-gray-700 hover:border-red-400/50'
                              : 'bg-white border-gray-200 hover:border-red-300 hover:shadow-red-100/50'
                      }`}
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110 ${
                            isDark
                                ? 'bg-gradient-to-br from-red-500 to-gray-600'
                                : 'bg-gradient-to-br from-red-400 to-red-600'
                        }`}>
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-3">
                          <h3 className={`text-base font-semibold leading-tight ${
                              isDark ? 'text-gray-100' : 'text-gray-900'
                          }`}>
                            {student.first_name} {student.last_name}
                          </h3>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block ${
                              isDark
                                  ? 'bg-red-500/20 text-red-300'
                                  : 'bg-red-100 text-red-600'
                          }`}>
                      Student
                    </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex space-x-1">
                        <button
                            onClick={() => handleEdit(student)}
                            title="Edit student"
                            className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                                isDark
                                    ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-400/10'
                                    : 'text-blue-500 hover:text-blue-600 hover:bg-blue-50'
                            }`}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleDelete(student.id)}
                            disabled={isDeleting}
                            title="Delete student"
                            className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 ${
                                isDark
                                    ? 'text-red-400 hover:text-red-300 hover:bg-red-400/10'
                                    : 'text-red-500 hover:text-red-600 hover:bg-red-50'
                            }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className={`h-px mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`} />

                    {/* Info rows */}
                    <div className="space-y-2.5 text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isDark ? 'bg-red-500/15' : 'bg-red-50'
                        }`}>
                          <Mail className={`w-3.5 h-3.5 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
                        </div>
                        <span className={`truncate ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {student.email}
                  </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isDark ? 'bg-red-500/15' : 'bg-red-50'
                        }`}>
                          <FileText className={`w-3.5 h-3.5 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
                        </div>
                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    CIN: <span className={`font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{student.cin}</span>
                  </span>
                      </div>

                      {student.phone_num && (
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                isDark ? 'bg-red-500/15' : 'bg-red-50'
                            }`}>
                              <Phone className={`w-3.5 h-3.5 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
                            </div>
                            <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>{student.phone_num}</span>
                          </div>
                      )}

                      {student.birth_date && (
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                isDark ? 'bg-red-500/15' : 'bg-red-50'
                            }`}>
                              <Calendar className={`w-3.5 h-3.5 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
                            </div>
                            <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      {new Date(student.birth_date).toLocaleDateString()}
                    </span>
                          </div>
                      )}
                    </div>

                    {/* Fields / Tags */}
                    <div className={`mt-4 pt-4 ${isDark ? 'border-t border-gray-700' : 'border-t border-gray-100'}`}>
                      <div className="flex items-center gap-1.5 mb-2">
                        <GraduationCap className={`w-3.5 h-3.5 ${isDark ? 'text-red-400' : 'text-red-500'}`} />
                        <span className={`text-xs font-medium uppercase tracking-wide ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>Fields</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {Array.isArray(student.fields) && student.fields.length > 0 ? (
                            student.fields.map((field, idx) => (
                                <span
                                    key={idx}
                                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                        isDark
                                            ? 'bg-red-600/20 text-red-300 border border-red-500/20'
                                            : 'bg-red-50 text-red-600 border border-red-200'
                                    }`}
                                >
                        {field}
                      </span>
                            ))
                        ) : (
                            <span className={`text-xs italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      No fields assigned
                    </span>
                        )}
                      </div>
                    </div>
                  </div>
              ))
          ) : (
              <div className="col-span-full text-center py-16">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                    isDark ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <GraduationCap className={`w-8 h-8 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
                <p className={`text-lg font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  No students found
                </p>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                  Try adjusting your search term
                </p>
              </div>
          )}
        </div>
      </div>
  );
};

export default StudentManagement;