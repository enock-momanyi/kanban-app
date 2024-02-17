import { Box } from "@mui/material"
import { AddColumnFeed, CardInt, ColumnCardInt } from "../interfaces/types"
import ColumnComponent from "./Column"
import { useMutation } from "@apollo/client";

import DELETE_COLUMN from '../graphql/queries/deleteColumn.gql'
import MOVE_CARD from '../graphql/queries/moveCard.gql'
import { DragEvent } from "react";

export default function ColumnList({columns,setMessage,setColumns,refetch}:{columns:ColumnCardInt[],setMessage:Function,setColumns:Function, refetch:Function}){

    const [moveACard] = useMutation(MOVE_CARD, {
        onCompleted: (dat:{changeCardColumnId:AddColumnFeed[]}) => {
            setMessage(null)
          setColumns(dat.changeCardColumnId.map((newCard: AddColumnFeed) => {
            return { id:newCard.id,columnTitle: newCard.columnTitle, cards: newCard.cards}
          }));
        }
      });
      
    const [deleteAColumn] = useMutation(DELETE_COLUMN,{
        onCompleted:()=>{
            setMessage(null)
            refetch()
        },
        onError: () => {
            setMessage("Network offline, unable to delete column.")
        }
    })


    async function deleteColumn(columnId: String){
        try{
        await deleteAColumn({variables:{columnId}})
        }catch(error){
            setMessage("Network offline. Unable to add column in the database!")
        }
    }
    function updateAddCardState(columnId: String,newCard?: CardInt, cardText?: string){
        const updatedColumns= columns.slice()
        setColumns(updatedColumns.map((col: ColumnCardInt)=>{
            if(col.id === columnId){
                if(newCard === undefined){
                    const randomId = Math.floor(Math.random()*10000).toString()
                    return {...col,cards:[...col.cards,{id:randomId,columnId,cardText}]}
                }
                return {...col,cards:[...col.cards,newCard]}
            }
            return col
        }))
    }
    function clearCardState(columnId: String){
        const updatedColumns= columns.slice()
        setColumns(updatedColumns.map((col)=>{
            if(col.id === columnId){
                return {...col,cards:[]}
            }
            return col
        }))
    }
    const handleOnDrop = async (e: DragEvent<HTMLDivElement>, columnId: String) => {
        e.preventDefault()
        const cardId = e.dataTransfer.getData("cardId")
        try{
        await moveACard({variables:{
            cardId,newColumnId: columnId
        }})
    }catch(error){
        const columnCopy = columns.slice()
        let card!:CardInt
        columns.map((col)=>{
            card = col.cards.find((cd: CardInt)=>{
                return cd.id === cardId
            })
            if(card){
                setColumns(columnCopy.map((col:ColumnCardInt)=>{
                    if(card.columnId === col.id){
                        return {...col,cards: col.cards.filter((cd => cd.id !== card.id))}
                    }else if(col.id === columnId){
                        return {...col,cards:[...col.cards, {...card, columnId: columnId}]}
                    }
                    return col
                }))
                setMessage("Network offline!")
                return
            }
        })

    }
    }
    const handleOnDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }
    return (
        <>
        {columns.map((cl,i) => {
                   
            return(
            <Box 
                key={cl.id}
                sx={{position:"relative", mr:"20px"}}
                onDragOver={(e) => handleOnDragOver(e)}
                onDrop={(e)=> handleOnDrop(e,cl.id)}
                >
                <ColumnComponent
                key={cl.id}
                columnTitle={cl.columnTitle} columnId={cl.id} 
                cardSet={cl.cards} deleteColumn={deleteColumn}
                updateAddCardState={updateAddCardState}
                clearCardState={clearCardState}
                setMessage={setMessage}
                />
                </Box>
        )})
    }
    </>
    )
}