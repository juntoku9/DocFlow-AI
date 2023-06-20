
import { Component } from 'react';
import AppRouter from './routes/AppRouter';
import { BrowserRouter } from "react-router-dom";
import { Route, Redirect } from "react-router-dom";

import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";
import { ENTROPY_FRONTEND_ADDRESS } from './globals/address';
import {AUDIENCE} from './globals/auth';
import { ClerkProvider } from "@clerk/clerk-react";

const App =()=> {
    // fetch the default team id for the user
    return (
        <BrowserRouter>
            <AppRouter />
        </BrowserRouter>
        )
}

export default App;
 