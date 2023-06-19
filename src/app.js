
import { Component } from 'react';
import AppRouter from './routes/AppRouter';
import { BrowserRouter } from "react-router-dom";
import { Route, Redirect } from "react-router-dom";

import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";
import { ENTROPY_FRONTEND_ADDRESS } from './globals/address';
import {AUDIENCE} from './globals/auth';


const App =()=> {
    // fetch the default team id for the user
    return (
        <Auth0Provider
        domain="dev-fhr8no8jly5egzzi.us.auth0.com"
        clientId="xSSswTK0wzFnPuuKQT7VfamnAeDtwB8O"
        authorizationParams={{
          audience: AUDIENCE,
          redirect_uri: `${ENTROPY_FRONTEND_ADDRESS}/invoice`
        }}
      >        
        <BrowserRouter basename='/'>
            <AppRouter />
        </BrowserRouter>
        </Auth0Provider>
        )
}

export default App;
 