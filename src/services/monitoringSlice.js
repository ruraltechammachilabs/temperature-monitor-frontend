import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  temperature: 0,
  humidity: 0,
  smoke: 0
}

export const monitorSlice = createSlice({
  name: 'monitor',
  initialState,
  reducers: {
    setThreshold: (state, action) => {
        state.temperature = action.payload.Temperature
        state.humidity = action.payload.Humidity
        state.smoke = action.payload.Smoke
    }
    // set: (state) => {
    //   state.value = 
    // },
    // decrement: (state) => {
    //   state.value -= 1
    // },
    // incrementByAmount: (state, action) => {
    //   state.value += action.payload
    // },
  },
})

// Action creators are generated for each case reducer function
export const { setThreshold } = monitorSlice.actions

export default monitorSlice.reducer