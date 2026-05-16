import React from 'react';
import Remarks from '../Stdremark';
const EvaluationTable = ({ evaluationData, remarksData}) => {
  // Get keys (questions) from evaluationData
  const questions = Object.keys(evaluationData);

  // Calculate total score
  const totalScore = Object.values(evaluationData).reduce((acc, value) => acc + value, 0);

  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-center text-black bg-white   border-collapse border border-gray-300">
      <thead className="text-xs text-indigo-900 uppercase bg-gray-50    ">
                      <tr className='border-b text-center '>
              {questions.map((question, index) => (
                      <th key={index} scope="col" className={`px-6 py-3 ${question === "name" ? "w-72 text-left" : ""}`}>

                  {question}
                </th>
              ))}
              {/* <th scope="col" className="px-6 py-3">
                Total
              </th> */}
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-b hover:bg-gray-50 text-center font-normal ">
              {/* <td></td>
              <td></td> */}
              {questions.map((question, index) => (
      <td key={index} scope="col" className={`px-6 py-3 ${question === "name" ? "text-left" : ""}`}>
      {evaluationData[question]}
                </td>
              ))}
              {/* <td className="px-6 py-4">{totalScore}</td> */}
            </tr>
          </tbody>
        </table>
        <div> 
          {remarksData && (
            <div>
              <Remarks data={remarksData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvaluationTable;
