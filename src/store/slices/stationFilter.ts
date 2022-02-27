import {createSlice} from '@reduxjs/toolkit'

export const stationFilterSlice = createSlice({
  name: 'stationFilter',
  initialState: {
    selectedCity : null,
    selectedGas: [] ,
    radius: 10,
  },
  reducers: {

    updateSelectedCity: (state, action)=>{
        state.selectedCity = JSON.parse(action.payload);
    },

    updateSelectedGas: (state, action)=>{
      state.selectedGas = JSON.parse(JSON.stringify(action.payload));
    },

    updateRadius: (state, action)=>{
      state.radius = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { updateSelectedCity, updateRadius, updateSelectedGas } = stationFilterSlice.actions

export default stationFilterSlice.reducer