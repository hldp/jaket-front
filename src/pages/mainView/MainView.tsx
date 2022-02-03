import React from 'react';
import Map from '../../modules/map/Map';
import { Station } from '../../models/station.model';
import Search from '../../modules/search/Search';
import AppBarCustom from '../../modules/appBar/AppBar';
import { Box, Button, ButtonGroup, Grid } from '@mui/material';
import './MainView.css';
import { GazType } from '../../models/gazType.enum';
import { Adress } from '../../models/adress.model';
import List from '../../modules/list/List';

class MainView extends React.Component<{},{ stations: Station[], radius: number, gazSelected: GazType[], citySelected: Adress, displayedElement: string }> {

  constructor(props: any) {
    super(props);
    this.state = {
        stations: [],
        radius: 10,
        gazSelected: [],
        citySelected: new Adress(0,0,"noCity"),
        displayedElement: 'map'
    }
    this.updateStations = this.updateStations.bind(this);        
    this.updateRadius = this.updateRadius.bind(this);
    this.updateSelectedGaz= this.updateSelectedGaz.bind(this);
    this.updateCity = this.updateCity.bind(this);
    this.buttonGroupMapClick = this.buttonGroupMapClick.bind(this);
    this.buttonGroupListClick = this.buttonGroupListClick.bind(this);
  }

  public updateStations(stations: Station[]): void {
    this.setState({ stations });
  }

  public updateRadius(radius:number): void{
    this.setState({radius})
  }

  public updateSelectedGaz(gazSelected: GazType[]): void{
    this.setState({gazSelected})
  }

  public updateCity(citySelected:Adress): void{
    this.setState({citySelected});
  }

  public buttonGroupMapClick() {
    this.setState({ displayedElement: 'map' })
  }

  public buttonGroupListClick() {
    this.setState({ displayedElement: 'list' })
  }

  render() {
    return (
      <Box component={Grid} container spacing={2}>
        <Box component={Grid} item xs={12}>
          <AppBarCustom></AppBarCustom>
        </Box>
        <Box component={Grid} item xs={12} sx={{ paddingBottom: 2 }} className='search-container'>
          <Search updateStations={this.updateStations} updateRadius={this.updateRadius} updateSelectedGaz={this.updateSelectedGaz} updateCity={this.updateCity}></Search>
        </Box>
        <Box component={Grid} item xs={12} className='map-list-container'>
          <ButtonGroup variant="contained" className='button-group' aria-label="outlined primary button group">
            <Button onClick={this.buttonGroupMapClick}>Map</Button>
            <Button onClick={this.buttonGroupListClick}>List</Button>
          </ButtonGroup>
          {
            (this.state.displayedElement == 'map')?
            <Map stations={this.state.stations}></Map>:
            <List stations={this.state.stations}></List> 
          }
        </Box>
      </Box>
    );
  }
}

export default MainView;