import React from 'react';
import Map from '../../modules/map/Map';
import Search from '../../modules/search/Search';
import AppBarCustom from '../../modules/appBar/AppBar';
import { Box, Button, ButtonGroup, Grid } from '@mui/material';
import './MainView.css';
import { Adress } from '../../models/adress.model';
import List from '../../modules/list/List';
import { connect } from 'react-redux';

class MainView extends React.Component<{stationFilter:any, dispatch:any},{
  citySelected: Adress, 
  displayedElement: string}> {

  constructor(props: any) {
    super(props);
    this.state = {
        citySelected: new Adress(0,0,"noCity"),
        displayedElement: 'map'
    }
    this.buttonGroupMapClick = this.buttonGroupMapClick.bind(this);
    this.buttonGroupListClick = this.buttonGroupListClick.bind(this);
  }

  /**
   * Called when map btn is clicked
   */
  public buttonGroupMapClick() {
    this.setState({ displayedElement: 'map' })
  }

  /**
   * Called when list btn is clicked
   */
  public buttonGroupListClick() {
    this.setState({ displayedElement: 'list' })
  }

  render() {
    return (

      <Box component={Grid} container spacing={2}>
        <Box component={Grid} item xs={12}>
          <AppBarCustom></AppBarCustom>
        </Box>
        <Box component={Grid} item xs={12} sx={{ paddingBottom: 2 }} className='search-box'>
          <Search isOnFirstPage={false} ></Search>
        </Box>
        <Box component={Grid} item xs={12} className='map-list-container'>
          <ButtonGroup variant="contained" className='button-group' aria-label="outlined primary button group">
            <Button onClick={this.buttonGroupMapClick}>Map</Button>
            <Button onClick={this.buttonGroupListClick}>List</Button>
          </ButtonGroup>
          {
            (this.state.displayedElement === 'map')?
            <Map height='600px' enableStationPopup={true}></Map>:
            <List></List> 
          }
        </Box>
      </Box>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    stationFilter: state.stationFilter
  }
}
export default connect(mapStateToProps)(MainView);