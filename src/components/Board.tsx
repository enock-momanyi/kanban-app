
import { DragEvent, Ref, useEffect, useRef, useState } from "react";
import Button from '@mui/material/Button';
import { useQuery, useMutation } from "@apollo/client";
import GET_COLUMNS from '../graphql/queries/getColumn.gql'
import ADD_COLUMN from '../graphql/queries/addColumn.gql'
import { Alert, Box, Breadcrumbs, Link } from "@mui/material";
import InputComponent from "./InputComponent";
import { AddColumnFeed, CardInt, ColumnCardInt, ColumnInt } from "../interfaces/types";
import ColumnList from "./ColumnList";


const Board = () => {
    const [columns, setColumns] = useState([])
    const [showColumn, setShowColumn] = useState<Boolean>(true);
    const [is5columns, setIs5Columns] = useState<Boolean>(false);
    const [message, setMessage] = useState<String>(null)
    const columnTitleRef= useRef<HTMLInputElement>()

    const {data, error,refetch} = useQuery(GET_COLUMNS,{
        onError:()=>{
            setMessage("network offline")
        }
    })
    const [addAColumn] = useMutation(ADD_COLUMN,{
        onCompleted: (dt:{addColumn:AddColumnFeed}) => {
            setMessage(null)
            refetch();
            //setColumns([...columns,dt.addColumn])
        }
    })

    useEffect(() => {
        if(data){
            setColumns(data.columns)
        }
        if(error){
            console.log(error)
            setMessage("Network offline!")
        }
    },[data])

    function expandAddColumn(){
        setShowColumn(!showColumn);
    }
    async function addColumn(e: { preventDefault: () => void; }){
        e.preventDefault()
        const titleValue = columnTitleRef?.current?.value;
        if(!titleValue) return
        try{
        await addAColumn({variables: {columnTitle:titleValue}})
        }catch(error){
            setColumns([...columns,{id:(columns.length+1).toString(), columnTitle:titleValue,cards:[]}])
            setMessage("Network offline. Unable to add column in the database!")
        }
        //setColumns([...columns, <Column columnTitle={titleValue} />])
        columnTitleRef.current.value = ''
        expandAddColumn()
        if(columns.length === 4){
            setIs5Columns(true)
        }
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
                <ColumnList columns={columns} setMessage={setMessage} setColumns={setColumns} refetch={refetch}/>

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