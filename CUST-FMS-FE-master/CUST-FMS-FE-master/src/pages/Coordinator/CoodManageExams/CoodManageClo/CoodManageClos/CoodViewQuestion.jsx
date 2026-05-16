import React from 'react'
import Simple from '../../../../../Components/Buttons/Simple'
const CoodViewQuestion = (props) => {
    const {question, onclose} = props

    console.log(question, "Dataaaa")
  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full sm:w-3/4 md:w-1/2 lg:w-2/5 xl:w-1/3 2xl:w-1/4 mx-auto">
    <h2 className="text-center font-bold text-xl mb-4">Description</h2>
    <div className='border border-gray-400 w-full h-auto min-h-6 rounded-2xl' >
        <p className="text-gray-700 text-base p-4">{question.question}</p>

    </div>

    <div className="grid grid-cols-1 mt-5">
        <div className="col-span-1 flex justify-center">
            {/* Cancel Button color can be adjusted */}
            <Simple text="Cancel" onClick={onclose} />
        </div>
    </div>
</div>

  )
}

export default CoodViewQuestion
