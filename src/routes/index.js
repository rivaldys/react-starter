import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { About, Contact, Home } from '../pages'

const Router = () =>
{
    return (
        <BrowserRouter>
            <Switch>
                <Route path='/' exact component={Home} />
                <Route path='/contact' component={Contact} />
                <Route path='/about' component={About} />
            </Switch>
        </BrowserRouter>
    )
}

export default Router