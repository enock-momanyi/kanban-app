
import { useEffect, useRef, useState } from "react";
import Column from "./Column";
import Button from '@mui/material/Button';
import { useQuery, useMutation } from "@apollo/client";
import GET_COLUMNS from '@/graphql/queries/getColumn.gql'
import ADD_COLUMN from '@/graphql/queries/addColumn.gql'
import DELETE_COLUMN from '@/graphql/queries/deleteColumn.gql'
import MOVE_CARD from '@/graphql/queries/moveCard.gql'
import { Box, Breadcrumbs, Link } from "@mui/material";
import InputComponent from "./InputComponent";


const Board = () => {
    const [columns, setColumns] = useState([])
    const [showColumn, setShowColumn] = useState(true);
    const [is5columns, setIs5Columns] = useState(false);
    const columnTitleRef = useRef()

    const {data, loading, error,refetch} = useQuery(GET_COLUMNS)
    const [addAColumn, {datam}] = useMutation(ADD_COLUMN,{
        onCompleted: (dt) => {
            console.log(dt)
            refetch();
            //setColumns([...columns,dt.addColumn])
        }
    })
    const [deleteAColumn, {datad}] = useMutation(DELETE_COLUMN,{
        onCompleted:()=>{
            refetch()
        }
    })
    const [moveACard, { datamc }] = useMutation(MOVE_CARD, {
        onCompleted: (dat) => {
          setColumns((prevColumns) => {
            // Find the column corresponding to the new column ID
            const updatedColumns = prevColumns.map((col) => {
              if (col.id === dat.changeCardColumnId.newColumnId) {
                // Update the cards array of this column
                return {
                  ...col,
                  cards: [
                    // Keep the existing cards except the one moved
                    ...col.cards.filter((card) => card.id !== dat.changeCardColumnId.cardId),
                    // Add the moved card to this column
                    // Assuming dat.changeCardColumnId.newCard is the new card object
                    dat.changeCardColumnId.newCard,
                  ],
                };
              }
              return col;
            });
            return updatedColumns;
          });
        },
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
    function addColumn(e){
        e.preventDefault()
        const titleValue = columnTitleRef.current.value;
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
    function deleteColumn(columnId){
        deleteAColumn({variables:{columnId}})
        //setColumns(columns.filter((col) => col.id.toString() !== columnId))
    }
    function updateAddCardState(columnId,newCard){
        const updatedColumns= columns.slice()
        setColumns(updatedColumns.map((col)=>{
            if(col.id === columnId){
                return {...col,cards:[...col.cards,newCard]}
            }
            return col
        }))
    }
    function clearCardState(columnId){
        const updatedColumns= columns.slice()
        setColumns(updatedColumns.map((col)=>{
            if(col.id === columnId){
                return {...col,cards:[]}
            }
            return col
        }))
    }
    const handleOnDrop = (e, columnId) => {
        e.preventDefault()
        const cardId = e.dataTransfer.getData("cardId")
        moveACard({variables:{
            cardId,newColumnId: columnId
        }})
    }
    const handleOnDragOver = (e) => {
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