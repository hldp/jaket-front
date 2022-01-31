
import { Autocomplete, Chip, CircularProgress, Stack, TextField } from "@mui/material";
import React from "react";
import { Adress } from "../../models/adress.model";
import { Station } from "../../models/station.model";
import AdressesApi from "../services/adressesAPI.service";
import { ChipData } from "./chipData.model";
import stations from '../../mock-data/stations';
import './Search.css'


class Search extends React.Component<{
    updateStations: (stations: Station[]) => void;
}, {adresses: Adress[], chipData:ChipData[]}>{

    private adressesApi: AdressesApi = new AdressesApi();
    private searchTerms: String = "";
    private loading: boolean = false;

    constructor(props : any){
        super(props);
        this.state = {adresses: [], chipData:[
            { key: 0, label: 'SP95', color: 'primary' },
            { key: 1, label: 'SP98', color: 'primary' },
            { key: 2, label: 'Diesel', color: 'primary' },
            { key: 3, label: 'GPL', color: 'primary' },
            { key: 4, label: 'Ethanol', color: 'primary' },
        ]};

        this.onSelectCity = this.onSelectCity.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSelectGaz = this.onSelectGaz.bind(this);
    }

    componentDidMount() {
        this.props.updateStations(stations);
    }

    onSelectCity(e:any, newValue: any){
        
        // TODO : recentrer la carte sur la ville
        console.log(e.target);
        console.log(newValue)
    
    }

    onChange(e:any){

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

    onSelectGaz(data: any){
        // Todo : filtrer les recherches par les carburant choisis
        
        

        this.state.chipData.forEach(chip => {
            if(chip.key === data.key){
                if(chip.color==="default"){
                    chip.color = "primary";
                }else{
                    chip.color = "default";
                }
            }
        });

        this.setState({chipData : this.state.chipData})

        //console.log(data)

    }

    render(): React.ReactNode {
        return (
            <div className="searchComponent" >
                <Autocomplete
                options={this.state.adresses}
                onChange={this.onSelectCity}

                sx={{ width: 320 }}
                renderInput={(params) => 
                <TextField onChange={this.onChange} {...params} label="Adresse" 
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
                <div className="chipDiv">
                    <Stack direction="row" spacing={1}>
                    {this.state.chipData.map((data, index) => {
                        return (
                            <Chip key={'chip_'+index} className="chip" label={data.label} color={data.color} onClick={() => this.onSelectGaz(data)}/>
                        );
                    })}
                    </Stack>
                </div>
            </div>
        );
    }

}
export default Search;