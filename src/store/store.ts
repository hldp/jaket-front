import { configureStore } from '@reduxjs/toolkit'
import stationFilterReducer from './slices/stationFilter'

function loadFromLocalStorage() {
  try {
    const serialisedState = localStorage.getItem("persistantState");
    if (serialisedState === null) return undefined;
    return JSON.parse(serialisedState);
  } catch (e) {
    console.warn(e);
    return undefined;
  }
}

export default configureStore({
  reducer: {
    stationFilter: stationFilterReducer,
  },
  preloadedState: loadFromLocalStorage()
})