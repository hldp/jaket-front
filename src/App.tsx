import React from 'react';
import './App.css';
import MainView from './pages/mainView/MainView';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/system';


require('react-leaflet-markercluster/dist/styles.min.css');

class App extends React.Component<{},{}> {

  private theme: any;

  constructor(props:any){
    super(props);
    this.theme = createTheme({
      palette: {
        primary: {
          main: "#FECC00"
        },
        secondary: {
          main: "#8DA9C4"
        }
      }
    });
  }

  render() {
    return (
      <ThemeProvider theme={this.theme}>
        <div className="App">
          <MainView></MainView>
        </div>
      </ThemeProvider>
    );
  }
  
}

export default App;