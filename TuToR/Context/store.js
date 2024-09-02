import { legacy_createStore as createStore} from 'redux'
import myReducer from "./reducers";

const Store = createStore(myReducer);

export default Store;