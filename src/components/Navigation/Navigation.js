import React, { useEffect } from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { Container, Dropdown, Nav, Navbar, Image, Button, Row, Col } from 'react-bootstrap';
import { useAuth0 } from "@auth0/auth0-react";
import { ENTROPY_FRONTEND_ADDRESS, ENTROPY_BACKEND_ADDRESS } from '../../globals/address';
import {postCreateUser} from "../../functions/login";

const Navigation =()=> {
  const [signedIn, setSignedIn] = React.useState(false);
  const { loginWithRedirect } = useAuth0();
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const { logout } = useAuth0();

  const renderLogo=()=> {
    return (
      <Navbar.Brand style={{"height": "30rem" }} className="mt-3">
        <Image className="navbar-brand-img" src="/img/logos/app_logo_brand.png" alt="..." />
      </Navbar.Brand>
    );
  }

  useEffect(() => {
    const getUserMetadata = async () => {      
      try {
        const accessToken = await getAccessTokenSilently();
        //set the access token to the header
        postCreateUser(user.email, user.sub, accessToken)
      } catch (e) {
        console.log(e.message);
      }
    };
  
    getUserMetadata();
  }, [getAccessTokenSilently, user?.sub]);


  const renderFooter=()=> {
    return (
      <>
        <div className="navbar-user d-none d-md-flex" style={{ "margin-right": "10px" }}>
          {/* {this.renderWalletSection()} */}
          <Row>
            <Col xl={6}>
          <Button href="https://discord.gg/rjeAj2DFY6" target="_blank"
            variant="primary" size="lg" style={{
            backgroundColor: '#7289DA',
            borderColor: '#7289DA',
          }}>
            <strong>Discord</strong>
          </Button>
          </Col>
          <Col xl={6}>
            {isAuthenticated? 
            <Button 
           variant="white" className="text-nowrap" size="lg" onClick={() => logout({ logoutParams: { returnTo: `${ENTROPY_FRONTEND_ADDRESS}/chat` }})}> <strong>Sign Out </strong>
           </Button>:
           <Button 
           variant="white" className="text-nowrap" size="lg" onClick={() => loginWithRedirect()}> <strong>Sign In </strong>
           </Button>
           }
          </Col>
          </Row>
        </div>
      </>
    );
  }



    return (
      <>
      <Navbar style={{ position: 'fixed', top: 0, width: '100%', zIndex: 101, height: '80px' }}>
          <Container fluid className='px-5'>
              <div className='d-flex flex-row' style={{"margin-left": "20px"}}>
                <div className='px-3'>
                 {renderLogo()}
                </div>
              </div>
            {renderFooter()}
          </Container>
        </Navbar>
      </>
    );
}

export default withRouter(Navigation);
