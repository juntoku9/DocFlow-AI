import React, { useState, useEffect, useRef, useCallback } from "react";
import { BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";

import { useAuth0 } from '@auth0/auth0-react';
import InvoicePage from '../pages/Invoice.js';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  SignIn,
  SignUp,
  UserButton,
} from "@clerk/clerk-react";
import { useAuth, useUser } from "@clerk/clerk-react";

// const PrivateRoute = ({ component: Component, ...rest }) => {
//     const { isAuthenticated, isLoading } = useAuth0();
//     if (isLoading){
//         return (<></>)
//     }
//     return (
//       <Route {...rest} render={props => (
//         isAuthenticated ? (
//           <Component {...props} />
//         ) : (
//           <Redirect to={{
//             pathname: '/login',
//             state: { from: props.location }
//           }} />
//         )
//       )} />
//     );
//   };

// const Login = () => {
//     console.log("in login")
//     const { loginWithRedirect, loginWithPopup } = useAuth0();
//     loginWithRedirect();
//     return null;
// }


// class AppRouter extends React.Component {
//     render() {
//         return (
//           <BrowserRouter basename='/'>

//             <React.Fragment>
//                 <Route exact path="/" render={() => (
//                     <Redirect to="/login" />
//                 )} />                
//                 <Route exact path="/login" component={Login} />
//                 {/* <PrivateRoute path="/chat" component={ChatPage} />
//                 <PrivateRoute path="/build" component={BuildPractice} />
//                 <PrivateRoute path="/vocab" component={VocabPractice} /> */}
//                 {/* <Route path="/invoice" component={InvoicePage} /> */}
//                 <Route
//                   path="/invoice"
//                   element={
//                   <>
//                     <SignedIn>
//                       <InvoicePage />
//                     </SignedIn>
//                     <SignedOut>
//                       <RedirectToSignIn />
//                   </SignedOut>
//                   </>
//                   }
//                 />


//             </React.Fragment>
//           </BrowserRouter>
//         )
//     }
// }

function PublicPage() {
  return (
    <>
      <h1>Public page</h1>
      <a href="/protected">Go to protected page</a>
    </>
  );
}
const HomePage = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  
  useEffect(() => {
    if (isSignedIn) {
      navigate('/invoice');  // Redirect to Invoice page if the user is signed in
    } else {
      navigate('/sign-in'); // Redirect to Sign-in page if the user is not signed in
    }
  }, [isSignedIn, navigate]);
  
  return null;
}

function ClerkProviderWithRoutes() {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={"pk_test_cHJvdWQtbGFicmFkb3ItNjIuY2xlcmsuYWNjb3VudHMuZGV2JA"}
      navigate={(to) => navigate(to)}
    >
      <Routes>
      <Route
        path="*"
        element={<SignIn routing="path" path="/sign-in" />}
      />
      <Route
          path="/"
          element={<HomePage routing="path" path="/" />}
        />
        <Route
          path="/sign-in/*"
          element={<SignIn routing="path" path="/sign-in" />}
        />
        <Route
          path="/sign-up/*"
          element={<SignUp routing="path" path="/sign-up" />}
        />
        <Route
          path="/invoice"
          element={
          <>
            <SignedIn>
              <InvoicePage/>
            </SignedIn>
             <SignedOut>
              <RedirectToSignIn />
           </SignedOut>
          </>
          }
        />
      </Routes>
    </ClerkProvider>
  );
}


export default ClerkProviderWithRoutes;
