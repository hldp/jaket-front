import React from 'react';
import './App.css';
import SearchView from './pages/searchView/SearchView';
import {createTheme, ThemeOptions} from '@mui/material/styles';
import { ThemeProvider } from '@mui/system';
import StationDetails from './pages/stationDetails/StationDetails';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomeView from './pages/homeView/homeView';
import GasRefuelStats from "./pages/gasRefuelStats/GasRefuelStats";
import {PaletteMode} from "@mui/material";

export const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

require('react-leaflet-markercluster/dist/styles.min.css');

function App() {
    // @ts-ignore
    const [mode, setMode] = React.useState< 'light' | 'dark'>(localStorage.getItem("MODE") || 'dark');
    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => {
                    const nextMode = prevMode === "light" ? "dark" : "light";
                    localStorage.setItem("MODE", nextMode);
                    return nextMode;
                });
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
                        main: "#00b0fe"
                    },
                }
                : {
                    primary: {
                        main: "#121212"
                    },
                    secondary: {
                        main: "#bb86fc"
                    },
                }),
        },
    });

    const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

    return (
        <BrowserRouter>
            <ColorModeContext.Provider value={colorMode}>
                <ThemeProvider theme={theme} >
                    <div className="App">
                        <Routes>
                            <Route path="/" element={<HomeView/>} />
                            <Route path="/search" element={<SearchView/>} />
                            <Route path="/stationDetails/:id" element={<StationDetails/>}/>
                            <Route path="/gasRefuelStats" element={<GasRefuelStats/>}/>
                        </Routes>
                    </div>
                </ThemeProvider>
            </ColorModeContext.Provider>
        </BrowserRouter>
    );
}

export default App;