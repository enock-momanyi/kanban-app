
import { DragEvent, Ref, useEffect, useRef, useState } from "react";
import Column from "./Column";
import Button from '@mui/material/Button';
import { useQuery, useMutation } from "@apollo/client";
import GET_COLUMNS from '../graphql/queries/getColumn.gql'
import ADD_COLUMN from '../graphql/queries/addColumn.gql'
import DELETE_COLUMN from '../graphql/queries/deleteColumn.gql'
import MOVE_CARD from '../graphql/queries/moveCard.gql'
import { Alert, Box, Breadcrumbs, Link } from "@mui/material";
import InputComponent from "./InputComponent";
import { AddColumnFeed, CardInt } from "../interfaces/types";


const Board = () => {
    const [columns, setColumns] = useState([])
    const [showColumn, setShowColumn] = useState<Boolean>(true);
    const [is5columns, setIs5Columns] = useState<Boolean>(false);
    const [message, setMessage] = useState<String>(null)
    const columnTitleRef= useRef<HTMLInputElement>()

    const {data, loading, error,refetch} = useQuery(GET_COLUMNS)
    const [addAColumn] = useMutation(ADD_COLUMN,{
        onCompleted: (dt:{addColumn:AddColumnFeed}) => {
            setMessage(null)
            refetch();
            //setColumns([...columns,dt.addColumn])
        },
        onError: () => {
            setMessage("Network offline. Unable to add column in the database!")
        }
    })
    const [deleteAColumn] = useMutation(DELETE_COLUMN,{
        onCompleted:()=>{
            setMessage(null)
            refetch()
        },
        onError: () => {
            setMessage("Network offline, unable to delete column.")
        }
    })
    const [moveACard] = useMutation(MOVE_CARD, {
        onCompleted: (dat:{changeCardColumnId:AddColumnFeed[]}) => {
            setMessage(null)
          setColumns(dat.changeCardColumnId.map((newCard: AddColumnFeed) => {
            return { id:newCard.id,columnTitle: newCard.columnTitle, cards: newCard.cards}
          }));
        },
        onError: () => {
            setMessage("Network offline!")
        }
      });
      
    useEffect(() => {
        if(data){
            setColumns(data.columns)
        }
    },[data])

    if(error){
        console.log(error)
        return null
    }

    function expandAddColumn(){
        setShowColumn(!showColumn);
    }
    function addColumn(e: { preventDefault: () => void; }){
        e.preventDefault()
        const titleValue = columnTitleRef?.current?.value;
        if(!titleValue) return
        try{
        addAColumn({variables: {columnTitle:titleValue}})
        }catch(error){
            console.log(error)
            return
        }
        //setColumns([...columns, <Column columnTitle={titleValue} />])
        columnTitleRef.current.value = ''
        expandAddColumn()
        if(columns.length === 4){
            setIs5Columns(true)
        }
    }
    function deleteColumn(columnId: String){
        deleteAColumn({variables:{columnId}})
        //setColumns(columns.filter((col) => col.id.toString() !== columnId))
    }
    function updateAddCardState(columnId: String,newCard: CardInt){
        const updatedColumns= columns.slice()
        setColumns(updatedColumns.map((col)=>{
            if(col.id === columnId){
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
    const handleOnDrop = (e: DragEvent<HTMLDivElement>, columnId: String) => {
        e.preventDefault()
        const cardId = e.dataTransfer.getData("cardId")
        moveACard({variables:{
            cardId,newColumnId: columnId
        }})
    }
    const handleOnDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }
    return(
        
        <div>
            <h2 style={{marginBottom:"5px"}}>Kanban</h2>
            <Breadcrumbs separator=">" sx={{mb:"30px"}}>
                <Link key="1" underline="hover" sx={{color:"black"}}>
                Dashboard
                </Link>
                <Link key="2" underline="hover" sx={{color:"grey"}}>
                Kanban
                </Link>
            </Breadcrumbs>
            {message && <Alert severity="error">{message}</Alert>}
            <Box sx={{display:"flex"}}>
       {columns.map((cl,i) => {
                   
                return(
                <Box 
                    key={cl.id}
                    sx={{position:"relative", mr:"20px"}}
                    onDragOver={(e) => handleOnDragOver(e)}
                    onDrop={(e)=> handleOnDrop(e,cl.id)}
                    >
                    <Column
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

        <Box>
            {
                showColumn && !is5columns &&
                <Button onClick={expandAddColumn} variant="outlined" sx={{backgroundColor:"white", border:"none"}}>Add Column</Button>
            }
            { !showColumn &&
            <InputComponent label="Name" inputRefVar={columnTitleRef} cancelFunc={expandAddColumn} addFunc={(e) => addColumn(e)} />
}
        </Box>
        </Box>
        </div>
    )
}

export default Board