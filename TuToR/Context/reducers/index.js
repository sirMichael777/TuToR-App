import {combineReducers} from "redux"
import userAuthReducer from "./UserAuthReducer";

const myReducer = combineReducers ({
    user: userAuthReducer
})

export default myReducer;