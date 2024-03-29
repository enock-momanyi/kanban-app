import { TextField } from '@mui/material';

import { DragEvent, useRef, useState } from 'react';
import { CardComponentProps } from '../interfaces/types';

const CardComponent = ({cardId, cardText, editText}:CardComponentProps) => {

    const [disableEdit, setDisableEdit] = useState<boolean>(true)

    const cardTextRef = useRef<HTMLInputElement>()

    const handleDoubleClick = () => {
        /**
         * allow a user to edit the card text when they double click a card
         */
        setDisableEdit(false)
    }

    const handleMouseLeave = () => {
        /**
         * Allow for the contents in the card input to be saved after onMouseLeave event
         */
        if(disableEdit){
            return
        }

        const updatedText = cardTextRef?.current?.value?.trim()
        if(updatedText !== "" && cardText !== updatedText){
            editText(cardId,updatedText)
        }
        setDisableEdit(true)
    }
    const handleOnDrag = (e: DragEvent<HTMLDivElement>) => {
        /**
         * set the caedId as the data to be tranferred on onDrag event
         */
        e.dataTransfer.setData("CardId",cardId)
    }

    return(
        <TextField 
            id='outlined-textarea'
            defaultValue={cardText} 
            variant='filled' 
            multiline
            rows={4}
            draggable
            inputRef={cardTextRef}
            onDoubleClick={handleDoubleClick}
            onMouseLeave={handleMouseLeave}
            disabled={disableEdit}
            onDragStart={(e) => handleOnDrag(e)}
            sx={{width:"90%"}}
            />
    )
}

export default CardComponent