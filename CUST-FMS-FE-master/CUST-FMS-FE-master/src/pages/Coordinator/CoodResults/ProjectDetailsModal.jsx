import React from 'react';

const ProjectDetailsModal = ({ project, onClose }) => {
    if (!project) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-indigo-600 text-white px-6 py-4 rounded-t-lg flex justify-between items-center sticky top-0">
                    <h2 className="text-xl font-bold">Project Details</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-indigo-700 rounded-full p-2"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Project Name */}
                    <div>
                        <h3 className="text-2xl font-bold text-indigo-900 border-b-2 border-indigo-200 pb-2">
                            {project.projectName}
                        </h3>
                    </div>

                    {/* Project Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Project Type */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Project Type</label>
                            <p className="text-indigo-900 font-medium">{project.projectType || 'N/A'}</p>
                        </div>

                        {/* Platform */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Platform</label>
                            <p className="text-indigo-900 font-medium">{project.platform || 'N/A'}</p>
                        </div>

                        {/* Supervisor */}
                        <div className="bg-gray-50 p-4 rounded-lg col-span-1 md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Supervisor</label>
                            <p className="text-indigo-900 font-medium">{project.supervisor || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Group Members */}
                    <div className="bg-indigo-50 p-4 rounded-lg">
                        <label className="block text-sm font-semibold text-indigo-800 mb-3">Group Members</label>
                        <ul className="space-y-2">
                            {project.groupMembers && project.groupMembers.length > 0 ? (
                                project.groupMembers.map((member, index) => (
                                    <li key={member.studentId || index} className="flex items-center bg-white p-3 rounded-md shadow-sm">
                                        <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                                            {index + 1}
                                        </span>
                                        <div>
                                            <p className="font-semibold text-indigo-900">{member.name}</p>
                                            <p className="text-sm text-gray-600">{member.registrationNumber}</p>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li className="text-gray-500 italic">No members found</li>
                            )}
                        </ul>
                    </div>

                    {/* Final Document (Part II) */}
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <label className="block text-sm font-semibold text-purple-800 mb-2">Final Document (Part II)</label>
                        {project.hasPartIIDocument ? (
                            <a
                                href={project.finalDocument}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Download Document
                            </a>
                        ) : (
                            <p className="text-gray-500 italic">Document not submitted yet</p>
                        )}
                    </div>
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

export default ProjectDetailsModal;
