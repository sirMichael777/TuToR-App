import { configureStore } from '@reduxjs/toolkit'
import userAuthReducer from "./reducers/UserAuthReducer";

const Store = configureStore({ reducer: userAuthReducer() })

export default Store;