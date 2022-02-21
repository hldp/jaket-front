import React from 'react';
import './App.css';
import MainView from './pages/mainView/MainView';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/system';
import StationDetails from './pages/stationDetails/StationDetails';
import stations from './mock-data/stations';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomeView from './pages/homeView/homeView';

export const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

require('react-leaflet-markercluster/dist/styles.min.css');

function App() {

  const [mode, setMode] = React.useState<'light' | 'dark'>('light');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            main: mode == 'light' ? "#FECC00" : "#000000"
          },
          secondary: {
            main: mode == 'light' ? "#8DA9C4" : "#e9e9ab"
          }
        },
      }),
    [mode],
  );

  return (
    <BrowserRouter>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <div className="App">
            <Routes>
                <Route path="/" element={<HomeView></HomeView>} />
                <Route path="/home" element={<MainView></MainView>} />
                <Route path="/stationDetails/:id" element={ <StationDetails station={stations[0]}></StationDetails>}></Route>
            </Routes>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </BrowserRouter>
  );
}

export default App;