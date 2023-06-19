import React from 'react';
import { Route, Redirect } from "react-router-dom";
import ChatPage from '../pages/ChatPage.js'
import BuildPractice from '../pages/BuildPractice.js'

import { useAuth0 } from '@auth0/auth0-react';
import VocabPractice from '../pages/VocabPractice.js';
import InvoicePage from '../pages/Invoice.js';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { isAuthenticated, isLoading } = useAuth0();
    if (isLoading){
        return (<></>)
    }
    return (
      <Route {...rest} render={props => (
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to={{
            pathname: '/login',
            state: { from: props.location }
          }} />
        )
      )} />
    );
  };

const Login = () => {
    console.log("in login")
    const { loginWithRedirect, loginWithPopup } = useAuth0();
    loginWithRedirect();
    return null;
}


class AppRouter extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Route exact path="/" render={() => (
                    <Redirect to="/login" />
                )} />                
                <Route exact path="/login" component={Login} />
                {/* <PrivateRoute path="/chat" component={ChatPage} />
                <PrivateRoute path="/build" component={BuildPractice} />
                <PrivateRoute path="/vocab" component={VocabPractice} /> */}
                <PrivateRoute path="/invoice" component={InvoicePage} />


            </React.Fragment>
        )
    }
}

export default AppRouter;
