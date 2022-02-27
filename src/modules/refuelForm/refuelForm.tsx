import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { TextField, Button, Dialog, DialogTitle, DialogContent, FormControl, Select, MenuItem, DialogActions, Stack, InputAdornment } from "@mui/material";
import React from "react";
import { GasType } from "../../models/gasType.enum";
import { refuelAPI } from "../services/refuelAPI.service";
import './refuelForm.css';


class RefuelForm extends React.Component<{
    onClose: () => void;
    openSnackbar: (success: boolean, message: string) => void;
},{allGas: GasType[], selectedGas: GasType, refuelDate: Date, isFormValid:boolean}>{

    private refuelAPI : refuelAPI; 
    private price: number= 0;
    private quantity: number = 0; 

    constructor(props : any){
        super(props);
        this.refuelAPI = new refuelAPI();
        // Init state
        this.state = {
            allGas : [GasType.SP95, GasType.SP98, GasType.DIESEL, GasType.GPL, GasType.ETHANOL],
            selectedGas: GasType.SP95,
            refuelDate: new Date(),
            isFormValid: false
        }
        this.onGasSelected = this.onGasSelected.bind(this);
        this.onRefuelGas = this.onRefuelGas.bind(this);
        this.onPriceChange = this.onPriceChange.bind(this);
        this.onQuantityChange = this.onQuantityChange.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
    }


    public onChangeDate(e:any): void{
        this.setState({refuelDate : e});
        this.isFormValid();
    }

    public onRefuelGas(): void{
        const totalPrice = this.quantity * this.price;
        this.refuelAPI.postRefuel(this.state.selectedGas, this.quantity, this.state.refuelDate, totalPrice).subscribe((res)=>{
            if(res){
                this.props.openSnackbar(true, "Successfully refuel gas !");
                this.props.onClose();
                window.location.reload();
            }
        });
    }

    public onQuantityChange(e:any){
        this.quantity= e.target.value;
        this.isFormValid();
    }

    public onPriceChange(e:any):void{
        this.price= e.target.value;
        this.isFormValid();
    }
    
    public onGasSelected(e:any): void{
        this.setState({selectedGas: e.target.value})
        this.isFormValid();
    }

    public onCancel(){
        this.props.onClose();
    }

    private isFormValid(){
        if(this.quantity === 0 || this.price === 0){
            this.setState({isFormValid: false});
        }else{
            this.setState({isFormValid: true})
        }
    }


    /**
     * Render the component
     * @returns 
     */
    render(): React.ReactNode {
        return (
            <Dialog
            open={true}
            onClose={this.onCancel}
        >
            <DialogTitle>{"Add a refuel"}</DialogTitle>
            <DialogContent>
                
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
                    <Stack 
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={{ xs: 3, sm: 2, md: 4 }}
                    >
                        <Select
                            sx={{ m: 1, width: {xs: '100%', sm: '30%', md: '30%'} }}
                            labelId="gasLabel"
                            id="gasLabel-select"
                            value={this.state.selectedGas}
                            onChange={this.onGasSelected}
                            label="Gas"
                        >
                            {this.state.allGas.map((gas: GasType)=>{
                                return (
                                    <MenuItem key={gas} value={gas}>{gas}</MenuItem>
                                )
                            })};
                        </Select>
                        <TextField
                            sx={{ m: 1, width: {xs: '100%', sm: '30%', md: '30%'} }}
                            onChange={this.onPriceChange}
                            id="gas-price"
                            label="Price per liter"
                            type="number"
                            InputProps={{
                                endAdornment: <InputAdornment position="start">€</InputAdornment>,
                              }}
                        />

                        <TextField
                            sx={{ m: 1, width: {xs: '100%', sm: '30%', md: '30%'} }}
                            onChange={this.onQuantityChange}
                            id="quantiy"
                            label="Quantity"
                            type="number"
                            InputProps={{
                                endAdornment: <InputAdornment position="start">l</InputAdornment>,
                              }}
                        />  
                    </Stack>
                    <div className="datePicker">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Refuel Date"
                                value={this.state.refuelDate}
                                onChange={this.onChangeDate}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </div>
                    </FormControl>

            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={this.onCancel} >Cancel</Button>
                <Button variant="contained" disabled={!this.state.isFormValid} onClick={this.onRefuelGas}>Valid</Button>
            </DialogActions>
         </Dialog>
    );}

}
export default RefuelForm;