import React from 'react';
import logo from './logo.svg';
import './App.css';
import Map from './modules/map/Map';
import { Station } from './models/station.model';
import stations from './mock-data/stations';
import Search from './modules/search/Search';
import List from './modules/list/List';


require('react-leaflet-markercluster/dist/styles.min.css');

class App extends React.Component<{},{}> {

  private stations: Array<Station> = stations;

  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <Search></Search>
        {/* <Map stations={this.stations}></Map> */}
        <List stations={this.stations}></List>
      </div>
    );
  }
}

export default App;

/* <img src={logo} className="App-logo" alt="logo" />
<p>
  Edit <code>src/App.tsx</code> and save to reload.
</p>
<a
  className="App-link"
  href="https://reactjs.org"
  target="_blank"
  rel="noopener noreferrer"
>
  Learn React
</a>
<Timer defaultTimer={10}></Timer> */