
import { Autocomplete, Chip, CircularProgress, Grid, IconButton, Slider, Stack, TextField } from "@mui/material";
import React from "react";
import { Adress } from "../../models/adress.model";
import AdressesApi from "../services/adressesAPI.service";
import { ChipData } from "./chipData.model";
import './Search.css'
import { GasType } from "../../models/gasType.enum";
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import { connect } from "react-redux";
import { updateRadius, updateSelectedCity, updateSelectedGas } from "../../store/slices/stationFilter";

class Search extends React.Component<{
    stationFilter:any,
    dispatch:any,
    isOnFirstPage: boolean
}, {adresses: Adress[], chipData:ChipData[], city_loading: boolean, city_value: Adress | null}>{

    public defaultRadiusValue = this.props.stationFilter.radius;

    private adressesApi: AdressesApi = new AdressesApi();
    private searchTerms: String = "";
    private gazSelected: GasType[] = [GasType.DIESEL, GasType.SP95, GasType.SP98, GasType.ETHANOL, GasType.GPL];
    private auto_complete_timeout: NodeJS.Timeout | null = null;

    constructor(props : any){
        super(props);
        this.state = {
            adresses: [],
            chipData:[
                { key: 0, label: GasType.SP95, color: 'primary' },
                { key: 1, label: GasType.SP98, color: 'primary' },
                { key: 2, label: GasType.DIESEL, color: 'primary' },
                { key: 3, label: GasType.GPL, color: 'primary' },
                { key: 4, label: GasType.ETHANOL, color: 'primary' },
            ],
            city_loading: false,
            city_value: null
        };

        this.props.dispatch(updateRadius(this.defaultRadiusValue));
        this.onSelectCity = this.onSelectCity.bind(this);
        this.onUserCityInput = this.onUserCityInput.bind(this);
        this.onSelectGaz = this.onSelectGaz.bind(this);
        this.onRadiusChange = this.onRadiusChange.bind(this);
        this.handleGpsClick = this.handleGpsClick.bind(this);
    }

    componentDidMount() {
        if (this.props.stationFilter.selectedGas.length > 0) {
            let chipData = [
                { key: 0, label: GasType.SP95, color: 'default' },
                { key: 1, label: GasType.SP98, color: 'default' },
                { key: 2, label: GasType.DIESEL, color: 'default' },
                { key: 3, label: GasType.GPL, color: 'default' },
                { key: 4, label: GasType.ETHANOL, color: 'default' },
            ];
            this.gazSelected = [];
            this.props.stationFilter.selectedGas.forEach((gas: GasType) => {
                this.gazSelected.push(gas);
                if (gas === GasType.SP95) chipData[0].color = 'primary';
                else if (gas === GasType.SP98) chipData[1].color = 'primary';
                else if (gas === GasType.DIESEL) chipData[2].color = 'primary';
                else if (gas === GasType.GPL) chipData[3].color = 'primary';
                else if (gas === GasType.ETHANOL) chipData[4].color = 'primary';
            });
            this.setState({ chipData });
        }
        if (this.props.stationFilter.selectedCity != null) {
            this.setState({ city_value: this.props.stationFilter.selectedCity });
        }
    }

    /**
     * Method called when user select city in autocomplete 
     * Call the updateCity method from parent view
     * @param e the event
     * @param newAdress the new adress
     */
    onSelectCity(e:any, newAdress: any){
        this.props.dispatch(updateSelectedCity(JSON.stringify(newAdress)));
    }

    /**
     * Method trigger when user start typing in autocomplete
     * Perform API call to retrieve city proposition
     * @param e 
     */
    onUserCityInput(e:any){

        this.setState({ city_loading: true });

        if (this.auto_complete_timeout != null) clearTimeout(this.auto_complete_timeout);

        this.auto_complete_timeout = setTimeout(() => {
            this.searchTerms = e.target.value;
            if(this.searchTerms) {
                this.adressesApi.getAdresses(this.searchTerms).then((adresses: Adress[])=>{
                    this.setState({adresses : adresses});
                    this.setState({ city_loading: false });
                }).catch((e)=>{
                    console.log(e);
                    this.setState({ city_loading: false });
                });
            } else {
                this.setState({ city_loading: false });
            }
        }, 500);

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
        this.props.dispatch(updateSelectedGas(this.gazSelected));
    }


    /**
     * Method trigger when radius is changed
     * Call the updateRadius method from parent view
     * @param data the event from the slider change
     */
    onRadiusChange(event:any, value:any){
        this.props.dispatch(updateRadius(value));
    }

    /**
     * Get coordinates from user position and update redux state
     */
    private updateCityWithUserPosition() {
        if (navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition((position) =>
            {
                this.setState({ city_loading: true });
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;
                this.adressesApi.getAddressFromPosition([latitude, longitude]).then((address: string) => {
                    this.setState({ city_loading: false, city_value: new Adress(latitude, longitude, address) });
                    this.props.dispatch(updateSelectedCity(JSON.stringify(this.state.city_value)));
                });
            }, () => {
                this.setState({ city_loading: false });
            });
        }
    }

    /**
     * Method trigger when user click on GPS button
     */
    public handleGpsClick() {
        this.updateCityWithUserPosition();
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
                    <Stack direction="row" sx={{ position: 'relative' }}>
                        <Autocomplete
                            options={this.state.adresses}
                            onChange={this.onSelectCity}
                            value={this.state.city_value}
                            sx={{ width: '100%' }}
                            renderInput={(params) => 
                            <TextField onChange={this.onUserCityInput} {...params} label="Adresse" sx={{ background: 'white'}}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                <React.Fragment>
                                    {this.state.city_loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                                ),
                            }}/>}
                        />
                        <IconButton color="secondary" className="gps-icon" onClick={this.handleGpsClick}>
                            <GpsFixedIcon fontSize="large"/>
                        </IconButton>
                    </Stack>
                    <Slider defaultValue={this.defaultRadiusValue} aria-label="Rayon" valueLabelDisplay="auto" onChangeCommitted={this.onRadiusChange}
                    color="secondary"/>
                    <Stack direction="row" spacing={1} sx={{ marginTop: '10px'}} justifyContent="center">
                    {this.state.chipData.map((data, index) => {
                        return (
                            <Chip key={'chip_'+index} className="chip" label={data.label} color={data.color} 
                                onClick={() => this.onSelectGaz(data)}
                                />
                        );
                    })}
                    </Stack>
                </Grid>
                <Grid item xs={1} sm={3}></Grid>
            </Grid>
        );
    }

}

const mapStateToProps = (state: any) => {
    return {
      stationFilter: state.stationFilter
    }
  }

export default connect(mapStateToProps)(Search);
