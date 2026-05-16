import React, { useState, useEffect } from 'react';
import CardOneButton from '../../../../../Components/Cards/CardOnebutton';
import LoadingSpinner from '../../../../../Components/LoadingSpinner/LoadingSpinner';
import CoodAddQuestionsCard from './CooAddQuestionsCard';
import CoodAddedQuestionsTable from './CoodAddedQuestionsTable';
import { initFlowbite } from 'flowbite';

const CoodAddQuestions = (props) => {
    const { handleSaveQuestion } = props;
    const [showAddQuestionCard, setShowAddQuestionCard] = useState(false);
    const [loadingSpinner, setLoadingSpinner] = useState(false);
    const [addedQuestions, setAddedQuestions] = useState([]);
    const [editQuestion, setEditQuestion] = useState(null);

    const saveQuestion = (data) => {
        if (editQuestion) {
            updateQuestionForCLO(editQuestion._id, data.shortCode, data.question, data.marks);
        } else {
            AddQuestions(data.shortCode, data.question, data.marks);
        }
        fetchQuestions();
        setShowAddQuestionCard(false);
        setEditQuestion(null);
    };

    const handleAddQuestion = () => {
        setShowAddQuestionCard(true);
        setEditQuestion(null);
    };

    const handleAddQuestionClose = () => {
        setShowAddQuestionCard(false);
        setEditQuestion(null);
    };

    const AddQuestions = async (shortCode, question, marks) => {
        try {
            setLoadingSpinner(true);
            const nkey = localStorage.getItem('key');
            const token = JSON.parse(nkey);
            const apiUrl = `/api/QuesForClo/addQuesForClo`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ shortCode, question, marks }),
            });

            if (response.ok) {
                console.log('Question created successfully');
                window.location.reload();
            } else {
                console.log('Failed to create question');
            }
        } catch (error) {
            console.error('Error creating question:', error);
        } finally {
            setLoadingSpinner(false);
        }
    };

    const updateQuestionForCLO = async (id, shortCode, question, marks) => {
        console.log("Updation Of Question of CLO func calleddddddddddddddddddddddddddd");
        try {
            setLoadingSpinner(true);
            const nkey = localStorage.getItem('key');
            const token = JSON.parse(nkey);
            const apiUrl = `/api/QuesForClo/updateQuestion/${id}`;

            const response = await fetch(apiUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ shortCode, question, marks }),
            });

            if (response.ok) {
                console.log('Question updated successfully');
                window.location.reload();
            } else {
                console.log('Failed to update question');
            }
        } catch (error) {
            console.error('Error updating question:', error);
        } finally {
            setLoadingSpinner(false);
        }
    };

    const fetchQuestions = async () => {
        try {
            setLoadingSpinner(true);
            const nkey = localStorage.getItem('key');
            const token = JSON.parse(nkey);
            const response = await fetch(`/api/QuesForClo/getAllQuestions`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            const cloData = data.questionsForCLO.map((item, index) => ({
                index: index + 1,
                ...item,
            }));
            setAddedQuestions(cloData);
        } catch (error) {
            console.error('Error fetching data:', error.message);
        } finally {
            setLoadingSpinner(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const handleDeleteClick = async (id) => {
        console.log(id, "Deleting Question");
        try {
            setLoadingSpinner(true);
            const nkey = localStorage.getItem('key');
            const token = JSON.parse(nkey);
            const apiUrl = `/api/QuesForClo/deleteQuestion/${id}`;

            const response = await fetch(apiUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                console.log('Question deleted successfully');
                window.location.reload();
            } else {
                console.log('Failed to delete question');
            }
        } catch (error) {
            console.error('Error deleting question:', error);
        } finally {
            setLoadingSpinner(false);
        }
    };

    const handleEditClick = (question) => {
        setEditQuestion(question);
        setShowAddQuestionCard(true);
    };

    useEffect(() => {
        initFlowbite();
        const indicator = document.getElementById('scroll-indicator');
        if (indicator) {
            const tabName = 'CoodManageQuestions';
            const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
            const topOffset = selectedTab.offsetTop;
            indicator.style.top = `${topOffset}px`;
        }
    }, []);

    return (
        <>
            {loadingSpinner ? (
                <LoadingSpinner />
            ) : (
                <div className='bg-slate-100 w-full h-full'>
                    <div className="mx-10 pt-12 flex flex-col gap-3">
                        <div className='grid grid-cols-1, grid-flow-col w-[21%]'>
                            <div id="cardOneButton ">
                                <CardOneButton title={"Questions for CLOs"} butText={"Add"} onClick={handleAddQuestion} />
                            </div>
                        </div>
                        {showAddQuestionCard && (
                            <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30 z-50'>
                                <CoodAddQuestionsCard 
                                    savequestionClick={saveQuestion} 
                                    onclose={handleAddQuestionClose} 
                                    editQuestion={editQuestion} 
                                />
                            </div>
                        )}
                        <CoodAddedQuestionsTable 
                            data={addedQuestions} 
                            handleEditClick={handleEditClick} 
                            handleDelClick={handleDeleteClick} 
                            accordionId={6} 
                        />
                    </div>
                </div>
            )}
        </>
    );
}

export default CoodAddQuestions;
