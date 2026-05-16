import React from 'react';
import Table from './SupTablewWthinCard';
import { baseUrl } from '../../../Components/config/config';

const SupFYPReports = (props) => {
    const { reportData, handleViewClick, downloadClick } = props;

    const modifiedData = reportData.map((item, index) => ({
        ...item,
        index: index + 1 // Assuming you want to start the index from 1
    }));
console.log(modifiedData)

    const Click01 = () => {
        handleViewClick()


        
    // Create a new <a> element
    const link = document.createElement('a');
    link.href = `${baseUrl}/${modifiedData[0].file.replace(/\\/g, '/')}`;
    link.download = `file_${modifiedData[0].file}.pdf`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    }
    const Click02 = () => {
        downloadClick()

    }


    return (
        <>
        <div className='border-b my-12'>
            <h1 className='text-2xl'>FYP Reports</h1>
        </div>
            <div className='bg-white w-full h-full rounded-md '>
                <Table
                    groupData={modifiedData} headers={[
                        { text: 'Serial no', colSpan: 1 },
                        { text: 'FYP Title', colSpan: 1 },
                        { text: 'Exam', colSpan: 1 },
                        { text: 'Status', colSpan: 1 },
                        { text: 'Uploaded by', colSpan: 1 },
                        { text: 'Uploaded At', colSpan: 1 },
                        { text: 'File', colSpan: 1 },

                    ]}
                    buttons={[
                        // {
                        //     text: 'View',
                        //     click: Click01, // initialized with click handler function
                        // },
                        {
                            text: 'Download',
                            click: Click02, // initialized with click handler function
                        },
                    ]}
                    fields={['index', 'fyp', 'examtype', 'status', 'uploadedby', 'fileupload', 'file']}
                />
            </div>
        </>
    )
}

export default SupFYPReports
