import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import ButbgPrimary from '../../../../Components/Buttons/ButbgPrimary';
import ButbgGray from '../../../../Components/Buttons/ButbgGray';

const CoodManagePassFailCriteria = ({ onClose, onSave, termData, existingData }) => {
    const [selectedTerm, setSelectedTerm] = useState('');
    const [passingCriteria, setPassingCriteria] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (existingData) {
            // Format for react-select
            const termOption = {
                value: existingData.term?._id,
                label: existingData.term?.sessionTerm
            };
            setSelectedTerm(termOption);
            setPassingCriteria(existingData.passingCriteria || '');
        }
    }, [existingData]);

    const validateForm = () => {
        const newErrors = {};

        if (!selectedTerm) {
            newErrors.term = 'Please select a term';
        }

        if (!passingCriteria) {
            newErrors.passingCriteria = 'Please enter passing criteria';
        } else if (isNaN(passingCriteria)) {
            newErrors.passingCriteria = 'Passing criteria must be a number';
        } else if (passingCriteria < 0 || passingCriteria > 100) {
            newErrors.passingCriteria = 'Passing criteria must be between 0 and 100';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validateForm()) {
            onSave({
                term: selectedTerm.value,
                passingCriteria: parseFloat(passingCriteria),
                _id: existingData?._id
            });
        }
    };

    const handleTermChange = (selectedOption) => {
        setSelectedTerm(selectedOption);
        if (errors.term) {
            setErrors({ ...errors, term: '' });
        }
    };

    const handleCriteriaChange = (e) => {
        setPassingCriteria(e.target.value);
        if (errors.passingCriteria) {
            setErrors({ ...errors, passingCriteria: '' });
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    {existingData ? 'Edit Pass/Fail Criteria' : 'Set Pass/Fail Criteria'}
                </h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                    ×
                </button>
            </div>

            <div className="space-y-4">
                {/* Term Selection */}
                <div>
                    <label className="block text-md font-semibold text-gray-700 mb-2">
                        Select Term <span className="text-red-500">*</span>
                    </label>
                    <Select
                        options={termData}
                        value={selectedTerm}
                        onChange={handleTermChange}
                        placeholder="Select Term"
                        isDisabled={existingData} // Can't change term when editing
                        className={`${errors.term ? 'border-red-500' : ''}`}
                    />
                    {errors.term && (
                        <p className="text-red-500 text-sm mt-1">{errors.term}</p>
                    )}
                </div>

                {/* Passing Criteria Input */}
                <div>
                    <label className="block text-md font-semibold text-gray-700 mb-2">
                        Passing Criteria (out of 100) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        value={passingCriteria}
                        onChange={handleCriteriaChange}
                        placeholder="e.g., 50"
                        min="0"
                        max="100"
                        step="0.01"
                        className={`bg-white border ${errors.passingCriteria ? 'border-red-500' : 'border-gray-300'} text-black text-sm rounded-2xl block w-full p-2.5`}
                    />
                    {errors.passingCriteria && (
                        <p className="text-red-500 text-sm mt-1">{errors.passingCriteria}</p>
                    )}
                    <p className="text-gray-500 text-xs mt-1">
                        Enter the minimum percentage required for a student to pass
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
                <ButbgGray text="Cancel" onClick={onClose} />
                <ButbgPrimary text="Save" onClick={handleSave} />
            </div>
        </div>
    );
};

export default CoodManagePassFailCriteria;
