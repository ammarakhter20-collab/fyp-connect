import React from 'react';

const ProjectExamResultsModal = ({ project, onClose }) => {
    if (!project) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-purple-600 text-white px-6 py-4 rounded-t-lg flex justify-between items-center sticky top-0">
                    <div>
                        <h2 className="text-xl font-bold">Exam Results</h2>
                        <p className="text-sm text-purple-100 mt-1">{project.projectName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-purple-700 rounded-full p-2"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-center bg-white border border-gray-200">
                            <thead className="text-xs text-indigo-900 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 border-b">Sr. No.</th>
                                    <th className="px-4 py-3 border-b">Reg. No.</th>
                                    <th className="px-4 py-3 border-b">Name</th>
                                    <th className="px-4 py-3 border-b bg-indigo-50">Part I Total</th>
                                    <th className="px-4 py-3 border-b bg-green-50">Part I Status</th>
                                    <th className="px-4 py-3 border-b bg-purple-50">Part II Total</th>
                                    <th className="px-4 py-3 border-b bg-green-50">Part II Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-indigo-950">
                                {project.groupMembers && project.groupMembers.length > 0 ? (
                                    project.groupMembers.map((student, index) => (
                                        <tr key={student.studentId || index} className="hover:bg-gray-50 border-b">
                                            <td className="px-4 py-3">{index + 1}</td>
                                            <td className="px-4 py-3 font-medium">{student.registrationNumber || 'N/A'}</td>
                                            <td className="px-4 py-3 text-left">{student.name || 'Unknown'}</td>
                                            <td className="px-4 py-3 bg-indigo-50 font-semibold">
                                                {student.totalPartI !== undefined ? student.totalPartI.toFixed(2) : '-'}
                                            </td>
                                            <td className="px-4 py-3 bg-green-50 font-semibold">
                                                {student.passFailPartI === 'PASS' ? (
                                                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                                                        PASS
                                                    </span>
                                                ) : student.passFailPartI === 'FAIL' ? (
                                                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                                                        FAIL
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 bg-purple-50 font-semibold">
                                                {student.totalPartII !== undefined ? student.totalPartII.toFixed(2) : '-'}
                                            </td>
                                            <td className="px-4 py-3 bg-green-50 font-semibold">
                                                {student.passFailPartII === 'PASS' ? (
                                                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                                                        PASS
                                                    </span>
                                                ) : student.passFailPartII === 'FAIL' ? (
                                                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                                                        FAIL
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500 italic">
                                            No student data available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary */}
                    {project.groupMembers && project.groupMembers.length > 0 && (
                        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold">Total Students:</span> {project.groupMembers.length}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectExamResultsModal;
