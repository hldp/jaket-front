import React from 'react';
import './App.css';
import SearchView from './pages/searchView/SearchView';
import {createTheme, ThemeOptions} from '@mui/material/styles';
import { ThemeProvider } from '@mui/system';
import StationDetails from './pages/stationDetails/StationDetails';
import stations from './mock-data/stations';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomeView from './pages/homeView/homeView';
import GasRefuelStats from "./pages/gasRefuelStats/GasRefuelStats";
import {PaletteMode} from "@mui/material";

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

    const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
        palette: {
            mode,
            ...(mode === 'light'
                ? {
                    primary: {
                        main: "#FECC00"
                    },
                    secondary: {
                        main: "#8DA9C4"
                    },
                }
                : {
                    primary: {
                        main: "#000000"
                    },
                    secondary: {
                        main: "#e9e9ab"
                    },
                }),
        },
    });

    const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

    return (
        <BrowserRouter>
            <ColorModeContext.Provider value={colorMode}>
                <ThemeProvider theme={theme}>
                    <div className="App">
                        <Routes>
                            <Route path="/" element={<HomeView/>} />
                            <Route path="/search" element={<SearchView/>} />
                            <Route path="/stationDetails/:id" element={<StationDetails station={stations[0]}/>}/>
                            <Route path="/gasRefuelStats" element={<GasRefuelStats/>}/>
                        </Routes>
                    </div>
                </ThemeProvider>
            </ColorModeContext.Provider>
        </BrowserRouter>
    );
}

export default App;