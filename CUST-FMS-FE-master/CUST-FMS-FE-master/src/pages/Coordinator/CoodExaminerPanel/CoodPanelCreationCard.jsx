import React, { useState, useRef, useEffect } from 'react';
import Simple from '../../../Components/Buttons/Simple';
import Select from 'react-select';

const CoodPanelCreationCard = ({ onclose, saveExaminerPanel, optionsData, Program, Department, Term, Faculty, panelDetails, editMode }) => {
    const [department, setDepartment] = useState('');
    const [program, setProgram] = useState('');
    const [term, setTerm] = useState('');
    const [panelCode, setPanelCode] = useState('');
    const [panelMemCount, setPanelMemCount] = useState(1);
    const [panelMembers, setpanelMembers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]); // Track selected members
    const [errors, setErrors] = useState({});
    const [panelId, setPanelId] = useState('');
    const [termId, setTermId] = useState('');

    const cardRef = useRef(null);


    console.log("Checking Termmmmmmmmmmmmmmmmmmmmmmmmmmmmmm", Term);

    console.log("Editing Modeeeeeeeeeeeeeeeeeeeeeee", editMode);
    console.log("PanelDetails tooooooooooo edit", panelDetails);
    console.log("Faculty Detailsssssssssss", Faculty);

    useEffect(() => {
        console.log("Inside setting UseEFfect");
        if (panelDetails && editMode && panelDetails.PanelMembers)  {
            console.log("Inside If inside setting UseEffect");
            setDepartment({ label: panelDetails.department.departmentName, value: panelDetails.department._id });
            // setProgram({ label: panelDetails.program, value: panelDetails.program });
            setTerm({ label: panelDetails.term, value: panelDetails.term._id });
            setPanelCode(panelDetails.panelCode);
            setPanelMemCount(panelDetails.PanelMembers.length);
            setPanelId(panelDetails._id);
            setpanelMembers(panelDetails.PanelMembers.map(member => {
                // console.log("Member Label:", member.member);
                // console.log("Member Value:", member._id);
    
                return {
                    label: member.member, // Adjust based on how your member object is structured
                    value: member._id,
                };
            }));
            setSelectedMembers(panelDetails.PanelMembers);
        }
    }, [panelDetails, editMode]);

    console.log("Termmmmmmmmm", term);
    console.log("PanelCode", panelCode);
    console.log("Panel Member Count", panelMemCount);
    console.log("Panel Members", panelMembers);

    const handlePanelMemCountChange = (e) => {
        const raw = e.target.value;
        // Allow the field to be temporarily empty while typing
        if (raw === '' || raw === '-') {
            setPanelMemCount(raw);
            return;
        }
        const count = parseInt(raw, 10);
        // Guard against NaN or non-positive numbers
        if (isNaN(count) || count < 1) {
            setPanelMemCount(1);
            setpanelMembers(new Array(1).fill(null));
        } else {
            // Preserve already-selected members when count changes
            const prevSelectedPanelMembers = panelMembers.slice(0, count);
            setPanelMemCount(count);
            const newSlots = count - prevSelectedPanelMembers.length;
            setpanelMembers([
                ...prevSelectedPanelMembers,
                ...(newSlots > 0 ? new Array(newSlots).fill(null) : []),
            ]);
        }
    };

    const handleMemberChange = (index, selectedOption) => {
        const newMembers = [...panelMembers];
        const newSelectedMembers = [...selectedMembers];

        // Update selected members list
        if (selectedOption) {
            if (newMembers[index]) {
                // Replace old selection
                const oldSelectionIndex = newSelectedMembers.indexOf(newMembers[index]);
                if (oldSelectionIndex > -1) {
                    newSelectedMembers.splice(oldSelectionIndex, 1);
                }
            }
            newSelectedMembers.push(selectedOption);
        } else {
            // Remove deselected member
            const oldSelectionIndex = newSelectedMembers.indexOf(newMembers[index]);
            if (oldSelectionIndex > -1) {
                newSelectedMembers.splice(oldSelectionIndex, 1);
            }
        }

        newMembers[index] = selectedOption;
        setpanelMembers(newMembers);
        setSelectedMembers(newSelectedMembers);
        // Clear member error when user selects an option
        if (errors[`panelMember${index}`]) {
            setErrors(prevErrors => ({ ...prevErrors, [`panelMember${index}`]: '' }));
        }
    };

    const handleSubmit = () => {
        const isValid = validateForm();
        if (isValid) {
            // Check for duplicate panel members across all fields
            const selectedMembersString = panelMembers.filter(member => member !== null).map(member => JSON.stringify(member));
            const uniquePanelMembers = new Set(selectedMembersString);
    
            if (uniquePanelMembers.size !== selectedMembersString.length) {
                alert('Please select each panel member only once.');
                return; // Exit the function early if there are duplicate panel members
            }
            
            if (panelMembers.filter(member => member !== null).length < 2) {
                alert('Please select at least two panel members.');
            } else {
               
                if(editMode){
                    console.log("penalDetails Checking in edit Mode", panelDetails);
                }

                const data = {
                    department: department.value,
                    program: program.value,
                    term: term.value,
                    panelCode,
                    panelId,
                    panelMembers: panelMembers.filter(member => member !== null)
                };
                console.log("Data to pass save", data);
                saveExaminerPanel(data);
                setDepartment('');
                setProgram('');
                setTerm('');
                setPanelCode('');
                setPanelMemCount(1);
                setpanelMembers([]);
                setSelectedMembers([]); // Reset selected members
                setErrors({});
                onclose();
            }
        }
    };
    

    const validateForm = () => {
        const errors = {};
        if (!department || !department.value) {
            errors.department = 'Department is required';
        }
        if (!term || !term.value) {
            errors.term = 'Term is required';
        }
        if (!panelCode) {
            errors.panelCode = 'Panel Code is required';
        } else if (panelCode.trim() === '') {
            errors.panelCode = 'Panel Code cannot be empty';
        }
        // Validate panel members
        panelMembers.forEach((member, index) => {
            if (!member) {
                errors[`panelMember${index}`] = `Panel Member ${index + 1} is required`;
            }
        });
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // console.log(Faculty, "Dekh lo");

    // Filter faculty based on selected department
    const filteredFaculty = department ? Faculty.filter(faculty => faculty.department === department.label) : [];
    const data = filteredFaculty.map(faculty => ({
        ...faculty
    }));

    useEffect(() => {
        console.log("Filtered Faculty:", filteredFaculty);
        console.log("Select options data:", data);
    }, [department, Faculty, filteredFaculty, data]);

    const handleTermChange = (selectedOption) => {
        console.log("Checking Term", selectedOption)
        setTerm(selectedOption);
        // Clear term error when user selects an option
        if (errors.term) {
            setErrors(prevErrors => ({ ...prevErrors, term: '' }));
        }
    };

    const handleDepartmentChange = (selectedOption) => {
        setDepartment(selectedOption);
        // Clear department error when user selects an option
        if (errors.department) {
            setErrors(prevErrors => ({ ...prevErrors, department: '' }));
        }
    };

    // const handleProgramChange = (selectedOption) => {
    //     setProgram(selectedOption);
    //     // Clear program error when user selects an option
    //     if (errors.program) {
    //         setErrors(prevErrors => ({ ...prevErrors, program: '' }));
    //     }
    // };

    const handlePanelCodeChange = (e) => {
        setPanelCode(e.target.value);
        // Clear panelCode error when user starts typing
        if (errors.panelCode) {
            setErrors(prevErrors => ({ ...prevErrors, panelCode: '' }));
        }
    };

    const handleClickOutside = (event) => {
        if (cardRef.current && !cardRef.current.contains(event.target)) {
            onclose();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    return (
        <div className="fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30">
            <div className="bg-white shadow-md rounded-lg p-6 w-[30%] h-[78%] overflow-y-auto relative" /*ref={cardRef}*/>
                <button className="absolute top-2 right-2 text-gray-600 focus:outline-none" onClick={() => onclose()}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div>
                    <h4 className='flex justify-center text-indigo-950 my-6 text-2xl'>Panel Creation</h4>
                    <form>
    <div className="my-4">
        <label htmlFor='department' className="block text-md font-semibold text-gray-700">Department
            <Select
                id='departmentDropdown'
                name='departmentDropdown'
                className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                options={Department}
                isSearchable
                onChange={handleDepartmentChange}
                value={department}
                placeholder='Select or type Department'
            />
            {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
        </label>
    </div>
    {/* <div className="my-4">
        <label htmlFor='program' className="block text-md font-semibold text-gray-700">Program
            <Select
                id='programDropdown'
                name='programDropdown'
                className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                options={Program}
                isSearchable
                onChange={handleProgramChange}
                value={program}
                placeholder='Select or type Program'
            />
            {errors.program && <p className="text-red-500 text-sm">{errors.program}</p>}
        </label>
    </div> */}
    <div className="my-4">
        <label htmlFor='term' className="block text-md font-semibold text-gray-700">Term
            <Select
                id='termDropdown'
                name='termDropdown'
                className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                options={Term}
                isSearchable
                onChange={handleTermChange}
                value={term}
                placeholder='Select or type Term'
            />
            {errors.term && <p className="text-red-500 text-sm">{errors.term}</p>}
        </label>
    </div>
    <div className="my-4">
        <label htmlFor='panelCode' className="block text-md font-semibold text-gray-700">Panel Code
            <input
                id='panelCode'
                name='panelCode'
                type="text"
                value={panelCode}
                onChange={handlePanelCodeChange}
                className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                placeholder={'P00'}
            />
            {errors.panelCode && <p className="text-red-500 text-sm">{errors.panelCode}</p>}
        </label>
    </div>
    <div className="my-4">
        <label htmlFor='panelMem' className="block text-md font-semibold text-gray-700">Panel Members
            <input
                id='panelMem'
                name='panelMem'
                type="number"
                value={panelMemCount}
                onChange={handlePanelMemCountChange}
                className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                placeholder={'Enter Panel Members'}
            />
            {errors.panelMembers && <p className="text-red-500 text-sm">{errors.panelMembers}</p>}
        </label>
    </div>
    {/* {[...Array(panelMemCount)].map((_id, index) => (
        <div key={index} className="my-4">
            <label htmlFor={`panelMember${index}`} className="block text-md font-semibold text-gray-700">Panel Member {index + 1}

                <Select
                    id={`panelMember${index}`}
                    name={`panelMember${index}`}
                    className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                    options={data.filter((option) => {
                        console.log('Option:', option);
                        return !selectedMembers.includes(option);
                    }).map((option) => ({
                        value: option,
                        label: `${option.label} - ${option.program?.programTitle}`,
                    }))}
                    isSearchable
                    onChange={(selectedOption) => handleMemberChange(index, selectedOption)}
                    value={panelMembers[index]}
                    placeholder='Select or type'
                />
            </label>
        </div>
    ))} */}

{[...Array(typeof panelMemCount === 'number' && panelMemCount > 0 ? panelMemCount : 0)].map((_id, index) => (
    <div key={index} className="my-4">
        <label htmlFor={`panelMember${index}`} className="block text-md font-semibold text-gray-700">
            Panel Member {index + 1}
            <Select
                id={`panelMember${index}`}
                name={`panelMember${index}`}
                className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                options={data
                    .filter((option) => {
                        // Check if the option is a faculty member or coordinator and not already selected
                        const eligibleRoles = ['faculty', 'coordinator'];
                        const isEligible = eligibleRoles.includes(option.role?.toLowerCase());
                        return isEligible && !selectedMembers.includes(option);
                    })
                    .map((option) => ({
                        value: option,
                        label: `${option.label} ${option.program ? `- ${option.program?.programTitle}` : ''}`,
                    }))}
                isSearchable
                onChange={(selectedOption) => handleMemberChange(index, selectedOption)}
                value={panelMembers[index]}
                placeholder="Select or type"
            />
        </label>
    </div>
))}
    <div className="col-span-1 flex justify-center my-2">
    <Simple text={editMode ? 'Update' : 'Save'} type="button" onClick={handleSubmit} />
    </div>
</form>
                </div>
            </div>
        </div>
    );
};

export default CoodPanelCreationCard;
