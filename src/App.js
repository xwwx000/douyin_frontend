import IndexRouter from './router/IndexRouter'
import { Provider } from 'react-redux'
import {store,persistor} from './redux/store'
import { PersistGate } from 'redux-persist/es/integration/react'
import './App.css'
function App() {
  return <Provider store={store}>
    {/* <PersistGate loading={null} persistor={persistor}> */}
    <IndexRouter></IndexRouter>
    {/* </PersistGate> */}
  </Provider>
}
export default App