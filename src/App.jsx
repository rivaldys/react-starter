import { Router } from '@/router'
import { store } from '@/services'
import { Provider } from 'react-redux'

const App = () =>
{
    return (
        <Provider store={store}>
            <Router />
        </Provider>
    )
}

export default App