import React from 'react';
import Map from '../../modules/map/Map';
import { Station } from '../../models/station.model';
import Search from '../../modules/search/Search';
import List from '../../modules/list/List';

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

  render() {
    return (
      <div className="App">
        <Search updateStations={this.updateStations}></Search>
        <Map stations={this.state.stations}></Map>
        {/* <List stations={this.stations}></List> */}
      </div>
    );
  }
}

export default MainView;