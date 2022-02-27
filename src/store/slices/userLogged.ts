import {createSlice} from '@reduxjs/toolkit'

export const userLoggedSlice = createSlice({
  name: 'userLogged',
  initialState: {
    isLogged : false,
    token: null,
  },
  reducers: {

    updateIsLogged: (state, action)=>{
        state.isLogged = action.payload;
    },

    updateToken: (state, action)=>{
      state.token = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { updateIsLogged, updateToken } = userLoggedSlice.actions

export default userLoggedSlice.reducer