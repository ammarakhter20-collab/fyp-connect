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
      <div className='bg-primary h-44 max-h-44 max-w-sm rounded-lg'>
        <div className='text-white pt-5 pl-8 h-28 w-96 overflow-hidden'>
          {/* <p className='font-normal'>{techReq ? 'Edit Request' : 'My Request'}</p> */}

          <p className='font-semibold mt-1 text-2xl'>{reqType}</p>
        </div>
        <div className='text-right mt-3 mr-8'>
          <Simple text={'Request'} onClick={onRegisterNow} />
        </div>
      </div>
    </>
  );
};


export default RequestCard;
