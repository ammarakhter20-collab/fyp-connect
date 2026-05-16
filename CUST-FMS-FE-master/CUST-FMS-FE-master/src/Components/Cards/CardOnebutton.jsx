import React from 'react'
import Simple from '../Buttons/Simple';

const CardOnebutton = (props) => {
    const {title, butText, onClick, cardColour, textColour } = props;


    const bgDefault = cardColour || 'bg-primary';
    const textDefault = textColour || 'text-white';
  return (
    <>
    <div className={` flex flex-col ${bgDefault}  py-4 px-2 h-40 border rounded-xl `}>
      <p className={`${textDefault} text-2xl `}>{title}</p>

      <div className='mt-auto'>
        <Simple text={butText} onClick = {onClick} />
      </div>
    </div>
    </>
  )
}

export default CardOnebutton
