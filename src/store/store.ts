import { configureStore } from '@reduxjs/toolkit'
import stationFilterReducer from './slices/stationFilter'

export default configureStore({
  reducer: {
    stationFilter: stationFilterReducer,
  },
})