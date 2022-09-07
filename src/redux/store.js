import {createStore,combineReducers} from 'redux'
import {persistStore,persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { CollapsedReducer } from './reducers/CollapsedReducer'
import { LoadingReducer } from './reducers/LoadingReducer'

//持久化配置
const persistConfig = {
    key:'xwwx',
    storage,
    blacklist:['LoadingReducer'] //黑名单 不会被持久化
}

//因为createStore只接收一个reducer,所以要合并为一个
const reducer = combineReducers({
    CollapsedReducer,
    LoadingReducer
})

const persistedReducer = persistReducer(persistConfig,reducer)

const store = createStore(persistedReducer)
const persistor = persistStore(store)

export {store,persistor}