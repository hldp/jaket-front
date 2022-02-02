
import { Autocomplete, Box, Chip, CircularProgress, Grid, Slider, Stack, TextField } from "@mui/material";
import React from "react";
import { Adress } from "../../models/adress.model";
import { Station } from "../../models/station.model";
import AdressesApi from "../services/adressesAPI.service";
import { ChipData } from "./chipData.model";
import stations from '../../mock-data/stations';
import './Search.css'
import { GazType } from "../../models/gazType.enum";


class Search extends React.Component<{
    updateStations: (stations: Station[]) => void;
    updateRadius: (radius: number)=> void;
    updateSelectedGaz: (selectedGaz: GazType[]) => void;
    updateCity: (city: Adress) => void;
}, {adresses: Adress[], chipData:ChipData[]}>{

    private adressesApi: AdressesApi = new AdressesApi();
    private searchTerms: String = "";
    private loading: boolean = false;
    private gazSelected: GazType[] = [GazType.DIESEL, GazType.SP95, GazType.SP98, GazType.ETHANOL, GazType.GPL];

    constructor(props : any){
        super(props);
        this.state = {adresses: [], chipData:[
            { key: 0, label: GazType.SP95, color: 'primary' },
            { key: 1, label: GazType.SP98, color: 'primary' },
            { key: 2, label: GazType.DIESEL, color: 'primary' },
            { key: 3, label: GazType.GPL, color: 'primary' },
            { key: 4, label: GazType.ETHANOL, color: 'primary' },
        ]};

        this.onSelectCity = this.onSelectCity.bind(this);
        this.onUserCityInput = this.onUserCityInput.bind(this);
        this.onSelectGaz = this.onSelectGaz.bind(this);
        this.onRadiusChange = this.onRadiusChange.bind(this);
    }

    componentDidMount() {
        this.props.updateStations(stations);
    }

    /**
     * Method called when user select city in autocomplete 
     * Call the updateCity method from parent view
     * @param e the event
     * @param newAdress the new adress
     */
    onSelectCity(e:any, newAdress: any){
        this.props.updateCity(newAdress);
    }

    /**
     * Method trigger when user start typing in autocomplete
     * Perform API call to retrieve city proposition
     * @param e 
     */
    onUserCityInput(e:any){

        this.searchTerms = e.target.value;

        if(this.searchTerms){

            this.loading= true;
            this.adressesApi.getAdresses(this.searchTerms).then((adresses: Adress[])=>{

                this.setState({adresses : adresses});
                this.loading = false;
            }).catch((e)=>{
                console.log(e);
                this.loading = false;
            });
        }

    }

    /**
     * Remove or add the gaz selected and change the color of the corresponding chip
     * Call the updateSelectedGaz method from parent view
     * @param data the event from user click
     */
    onSelectGaz(data: any){
        // Todo : filtrer les recherches par les carburant choisis
        this.state.chipData.forEach(chip => {
            if(chip.key === data.key){
                if(chip.color==="default"){
                    chip.color = "primary";
                    this.gazSelected.push(chip.label)
                }else{
                    chip.color = "default";
                    this.gazSelected.splice(this.gazSelected.indexOf(chip.label),1);
                }
            }
        });

        this.setState({chipData : this.state.chipData})
        this.props.updateSelectedGaz(this.gazSelected);
    }


    /**
     * Method trigger when radius is changed
     * Call the updateRadius method from parent view
     * @param data the event from the slider change
     */
    onRadiusChange(data:any){
        this.props.updateRadius(data.target.value)
    }

    /**
     * The component render method
     * @returns 
     */
    render(): React.ReactNode {
        return (
            <Grid container spacing={2}>
                <Grid item xs={1} sm={3}></Grid>
                <Grid item xs={10} sm={6} alignItems="center" style={{ height: "100%" }}>
                    <Grid style={{ height: "100%" }}>
                    <Autocomplete
                        options={this.state.adresses}
                        onChange={this.onSelectCity}

                        sx={{ width: '100%' }}
                        renderInput={(params) => 
                        <TextField onChange={this.onUserCityInput} {...params} label="Adresse" sx={{ background: 'white'}}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                            <React.Fragment>
                                {this.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                            ),
                        }}/>}
                    />
                    <Slider defaultValue={10} aria-label="Rayon" valueLabelDisplay="auto" onChange={this.onRadiusChange}
                    sx={{ color: "#fecc00" }}
                    />
                    <Stack direction="row" spacing={1} sx={{ marginTop: '10px'}} justifyContent="center">
                    {this.state.chipData.map((data, index) => {
                        return (
                            <Chip key={'chip_'+index} className="chip" label={data.label} color={data.color} 
                                onClick={() => this.onSelectGaz(data)}
                                /* sx={{ background: '#fecc00', color: 'black' }} */
                                />
                        );
                    })}
                    </Stack>
                    </Grid>
                </Grid>
                <Grid item xs={1} sm={3}></Grid>
            </Grid>
        );
    }

}
export default Search;