import { Provider } from 'react-redux'
import store from './services/store'
import Router from './routes'

const App = () =>
{
    return (
        <Provider store={store}>
            <Router />
        </Provider>
    )
}

export default App