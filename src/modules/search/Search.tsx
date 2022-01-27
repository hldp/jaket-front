
import { Autocomplete, Chip, CircularProgress, Slider, TextField } from "@mui/material";
import React from "react";
import { Adress } from "../../models/adress.model";
import AdressesApi from "../services/adressesAPI.service";
import './Search.css'


class Search extends React.Component<{}, {adresses: Adress[]}>{

    private adressesApi: AdressesApi = new AdressesApi();
    private searchTerms: String = "";
    private loading: boolean = false;
    private cityFound : Adress[] = [];


    constructor(props : any){
        super(props);
        this.state = {adresses: []};
        this.selectCity = this.selectCity.bind(this);
        this.onChange = this.onChange.bind(this);
        this.gazSelected = this.gazSelected.bind(this);
    }

    selectCity(e:any, newValue: any){
        
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

    gazSelected(e:any){
        // Todo : filtrer les recherches par les carburant choisis
        console.log(e.target.textContent)

    }

    render(): React.ReactNode {
        return (
            <div className="autocomplete" >
                <Autocomplete
                options={this.state.adresses}
                onChange={this.selectCity}

                sx={{ width: 300 }}
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
                <div className="chip">
                    <Chip label="SP95" variant="outlined" color="primary" onClick={this.gazSelected} />
                    <Chip label="SP98" variant="outlined" onClick={this.gazSelected} />
                    <Chip label="Diesel" variant="outlined" onClick={this.gazSelected} />
                    <Chip label="GPL" variant="outlined" onClick={this.gazSelected} />
                    <Chip label="Ethanol" variant="outlined" onClick={this.gazSelected} />
                </div>
            </div>
        );
    }

}
export default Search;