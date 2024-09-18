import { configureStore } from '@reduxjs/toolkit'
import monitorReducer from '../services/monitoringSlice'

export const store = configureStore({
  reducer: {
    monitor: monitorReducer,
  },
})