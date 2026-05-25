import React, { useEffect, useState } from 'react';
import Simple from "../Buttons/Simple";

// RequestCard component
const RequestCard = (props) => {

  const { reqType, onRegisterNow, TechReqExist } = props;
  console.log("Tech req exist inside card", TechReqExist);

  const [techReq, setTechReq] = useState(false);

  useEffect (() => {
  setTechReq(true);
  }, [TechReqExist])

  console.log("Checking teh stsatus", techReq);

  return (
    <>
      <div className='bg-primary h-44 max-h-44 max-w-sm rounded-lg shadow-md'>
        <div className='text-white pt-5 px-6 h-28'>
          {/* <p className='font-normal'>{techReq ? 'Edit Request' : 'My Request'}</p> */}

          <p className='font-semibold mt-1 text-xl leading-tight break-words'>{reqType}</p>
        </div>
        <div className='text-right mt-1 mr-6'>
          <Simple text={'Request'} onClick={onRegisterNow} />
        </div>
      </div>
    </>
  );
};


export default RequestCard;
