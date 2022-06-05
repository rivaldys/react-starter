import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { About, Home, Login } from '../pages'

const Router = () =>
{
    return (
        <BrowserRouter>
            <Switch>
                <Route path='/' exact component={Home} />
                <Route path='/about' component={About} />
                <Route path='/login' component={Login} />
            </Switch>
        </BrowserRouter>
    )
}

export default Router