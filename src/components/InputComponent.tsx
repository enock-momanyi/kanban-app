import { Box, Card,TextField} from "@mui/material";
import Button from '@mui/material/Button';
import { InputComponentProps } from "../interfaces/types";
//Input component with an input field and receives props to handle add and cancel operations 
const InputComponent = ({label, inputRefVar, cancelFunc, addFunc}: InputComponentProps) => {
    return (
        <Card sx={{boxShadow:"none", p:"10px"}}>
        <Box >
        <TextField 
            inputRef={inputRefVar} 
            id="outlined-basic" 
            autoComplete="off"
            label={label} 
            variant="outlined"
            />
        </Box>
        <Box sx={{display:"flex", justifyContent:"space-between", m:"6px"}}>
            <Button onClick={cancelFunc}>Cancel</Button>
            <Button onClick={addFunc} variant="contained">Add</Button>
        </Box>
    </Card>
    )
}

export default InputComponent