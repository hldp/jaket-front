import React from 'react';
import './App.css';
import MainView from './pages/mainView/MainView';


require('react-leaflet-markercluster/dist/styles.min.css');

class App extends React.Component<{},{}> {

  render() {
    return (
      <div className="App">
        <MainView></MainView>
      </div>
    );
  }
  
}

export default App;