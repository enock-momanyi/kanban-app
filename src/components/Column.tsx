
import { useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import CardComponent from "./card";
import ADD_CARD from '../graphql/queries/addCard.gql'
import CLEAR_COLUMN from '../graphql/queries/clearColumn.gql'
import RENAME_COLUMN from '../graphql/queries/renameColumn.gql'
import EDIT_CARD from '../graphql/queries/editCard.gql'
import { Box, CardActions } from "@mui/material";
import InputComponent from "./InputComponent";
import PositionedMenu from "./PositionedMenu";
import { AddCardFeed, AddColumnFeed, ColumnComponentProps } from "../interfaces/types";
const ColumnComponent = ({columnTitle, columnId, cardSet, deleteColumn,clearCardState, updateAddCardState, setMessage}:ColumnComponentProps) => {
    const [allowAddCard, setAllowAddCard] = useState<boolean>(false);
    const columnTitleRef = useRef<HTMLInputElement>()
    const [rename,setRename] = useState<boolean>(false);
    //mutation to handle the action of adding a card to  a column
    const [addACard] = useMutation(ADD_CARD, {
        onCompleted: (cd:{addCard:AddCardFeed}) => {
            if(cd.addCard.id){
            updateAddCardState(columnId,cd.addCard,undefined)
            }
        }
    })
    //mutation to handle the action of removing all cards in  a column
    const [clearAColumn] = useMutation(CLEAR_COLUMN, {
        onCompleted: ()=>{
            clearCardState(columnId)
            setMessage(null)
        },
        onError: () => {
            setMessage("Network offline! Cards not deleted.")
        }
    })
    //mutation to handle the action of renaming a column 
    const [renameAColumn] = useMutation(RENAME_COLUMN,{
        onCompleted: (rc:{renameColumn: AddColumnFeed}) => {
            columnTitle = rc.renameColumn.columnTitle
            setRename(false)
            setMessage(null)
        },
        onError: () => {
            setMessage("Network Offline! Cannot rename at this time.")
        }
    })
    //mutation to handle the action of editing a card in a column
    const [editACard] = useMutation(EDIT_CARD, {
        onCompleted: () => {
            setMessage(null)
        },
        onError: (err)=>{
            setMessage("Network Offline! Cannot edit the card at this time.")
        }
    })

    const cardTitle = useRef<HTMLInputElement>();
    async function addCard(e: { preventDefault: () => void; }){
        /**
         * Handles the add card functionality in a column by calling the addACard mutation
         */
        e.preventDefault()
        const titleValue = cardTitle?.current?.value;
        if(!titleValue) return
        try{
            await addACard({variables: {cardText: titleValue, columnId: columnId}})
        }catch(error){
            updateAddCardState(columnId, undefined,titleValue)
        }
        cardTitle.current.value = ''
        toggleCard()
    }
    function editCard(cardId: String, updatedText: String){
        /**
         * Update the contents for card with if:CardId
         */
        editACard({variables:{
            cardId,updatedText
        }})
    }
    function toggleCard(){
        /**
         * switch between showing the add card button and inputComponent for card details
         */
        setAllowAddCard(!allowAddCard);
    }
    function renameColumn(){
        /**
         * Give a column with id:columnId anew title
         */
        renameAColumn({variables:{columnId: columnId,columnTitle:columnTitleRef.current.value}})
    }
    function clearColumn(){
        /**
         * Removes all cards in a Column with a given id
         */
        clearAColumn({variables: {columnId}})
    }
    //items to be passed as a prop to the PositionedMenu component
    const DropDownItems = [
        {text:'Rename', func:() => {setRename(true)}},
        {text:'Clear',func:clearColumn},
        {text:'Delete', func:() => deleteColumn(columnId)}
    ]
    return(
        <Card>
           <CardContent sx={{mt:"10px"}}>
            <Box sx={{display:"flex", justifyContent:"space-evenly"}}>
                <input 
                    defaultValue={columnTitle} 
                    style={{border:"None", pointerEvents: rename? "auto" :"none", fontSize: 18, fontWeight: 500, width:"50%"}}
                    ref={columnTitleRef}
                    ></input>
                {
                    rename && 
                <Box>
                <Button onClick={()=>{setRename(false);columnTitleRef.current.value=columnTitle;}}>Cancel</Button>
                <Button onClick={renameColumn}>Rename</Button>
                </Box>
                }
            <PositionedMenu menuValues={DropDownItems} />
        </Box>
        <Box sx={{display:"flex", flexDirection:"column", alignItems:"center"}}>
        {
            cardSet.map(cd => (
                    <CardComponent key={cd.id} cardId={cd.id} cardText={cd.cardText} editText={editCard} />
            ))
        }
        </Box>
        <CardActions sx={{display:"flex", justifyContent:"center"}}>
        { !allowAddCard && <Button onClick={toggleCard}>Add Card</Button>}
        { allowAddCard &&
        <InputComponent label="Title" inputRefVar={cardTitle} cancelFunc={toggleCard} addFunc={(e) => addCard(e)} />
        }
        </CardActions>
            </CardContent> 
        </Card>
        
    )
}

export default ColumnComponent