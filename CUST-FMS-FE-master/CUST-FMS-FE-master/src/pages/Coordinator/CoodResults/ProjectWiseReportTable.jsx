import React from 'react';

const ProjectWiseReportTable = ({ data, onViewDetails, onViewResults, onExport }) => {
    if (!data || data.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>No projects found for this term</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <div className="flex justify-end p-2 bg-white border-b border-gray-200">
                <button 
                    onClick={onExport}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium text-sm transition-colors flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Export to Excel
                </button>
            </div>
            <table id="project-wise-table" className="w-full text-sm text-center bg-white">
                <thead className="text-xs text-indigo-900 uppercase bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 border-b">Sr. No.</th>
                        <th className="px-4 py-3 border-b">Project Name</th>
                        <th className="px-4 py-3 border-b">Project Members</th>
                        <th className="px-4 py-3 border-b bg-blue-50">Project Details</th>
                        <th className="px-4 py-3 border-b bg-indigo-50">Part I Status</th>
                        <th className="px-4 py-3 border-b bg-purple-50">Part II Status</th>
                        <th className="px-4 py-3 border-b bg-orange-50">Exam Details</th>
                    </tr>
                </thead>
                <tbody className="text-indigo-950">
                    {data.map((project, index) => (
                        <tr key={project.projectId || index} className="hover:bg-gray-50 border-b">
                            {/* Sr. No. */}
                            <td className="px-4 py-3 font-semibold">{index + 1}</td>

                            {/* Project Name */}
                            <td className="px-4 py-3 text-left">
                                <div className="font-semibold text-indigo-900">{project.projectName}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                    <span className="font-medium">Type:</span> {project.projectType}
                                </div>
                            </td>

                            {/* Project Members */}
                            <td className="px-4 py-3 text-left">
                                <ul className="space-y-1">
                                    {project.groupMembers && project.groupMembers.length > 0 ? (
                                        project.groupMembers.map((member, idx) => (
                                            <li key={member.studentId || idx} className="text-xs">
                                                <span className="font-medium text-indigo-800">{member.name}</span>
                                                <span className="text-gray-500 ml-1">({member.registrationNumber})</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-xs text-gray-400 italic">No members</li>
                                    )}
                                </ul>
                            </td>

                            {/* Project Details Button */}
                            <td className="px-4 py-3 bg-blue-50">
                                <button
                                    onClick={() => onViewDetails(project)}
                                    className="px-4 py-2 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition font-semibold"
                                >
                                    View Details
                                </button>
                            </td>

                            {/* Part I Status */}
                            <td className="px-4 py-3 bg-indigo-50">
                                {project.projectPassPartI === 'PASS' ? (
                                    <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-bold text-xs inline-block">
                                        ✓ PASS
                                    </span>
                                ) : (
                                    <span className="px-4 py-2 rounded-full bg-red-100 text-red-700 font-bold text-xs inline-block">
                                        ✗ FAIL
                                    </span>
                                )}
                            </td>

                            {/* Part II Status */}
                            <td className="px-4 py-3 bg-purple-50">
                                {project.projectPassPartII === 'PASS' ? (
                                    <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-bold text-xs inline-block">
                                        ✓ PASS
                                    </span>
                                ) : (
                                    <span className="px-4 py-2 rounded-full bg-red-100 text-red-700 font-bold text-xs inline-block">
                                        ✗ FAIL
                                    </span>
                                )}
                            </td>

                            {/* Exam Details Button */}
                            <td className="px-4 py-3 bg-orange-50">
                                <button
                                    onClick={() => onViewResults(project)}
                                    className="px-4 py-2 bg-orange-600 text-white text-xs rounded-md hover:bg-orange-700 transition font-semibold"
                                >
                                    View Results
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProjectWiseReportTable;
