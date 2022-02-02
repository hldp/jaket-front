import React from 'react';
import Map from '../../modules/map/Map';
import { Station } from '../../models/station.model';
import Search from '../../modules/search/Search';
import List from '../../modules/list/List';
import AppBarCustom from '../../modules/appBar/AppBar';
import { Box, Grid } from '@mui/material';
import './MainView.css';

class MainView extends React.Component<{},{ stations: Station[] }> {

  constructor(props: any) {
    super(props);
    this.state = {
        stations: []
    }
    this.updateStations = this.updateStations.bind(this);
  }

  public updateStations(stations: Station[]): void {
    this.setState({ stations });
  }

  public handleLeftDrawerToggle() {

  };

  render() {
    return (
      <Box component={Grid} container spacing={2}>
        <Box component={Grid} item xs={12}>
          <AppBarCustom></AppBarCustom>
        </Box>
        <Box component={Grid} item xs={12} sx={{ paddingBottom: 2 }} className='search-container'>
          <Search updateStations={this.updateStations}></Search>
        </Box>
        <Box component={Grid} item xs={12} className='map-list-container'>
          <Map stations={this.state.stations}></Map>
          {/* <List stations={this.stations}></List> */}
        </Box>
      </Box>
    );
  }
}

export default MainView;