import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { Container, Dropdown, Nav, Navbar, NavDropdown, Image, Button } from 'react-bootstrap';
import FeatherIcon from 'feather-icons-react';

import * as Icon from 'react-feather';
import Auth from '@aws-amplify/auth';
import { Avatar } from '../../components1/Avatar';
import { Select } from '../../components1/vendor/Select';
import { AppContext } from '../../context/AppContext.js';
import { getCurrentTeamFromUrl, buildRedirectPath } from '../../context/UrlPathParser'

import { ENTROPY_BACKEND_ADDRESS, CLOUDFRONT_RESOURCE_PATH } from '../../globals/address';
import { ethers } from "ethers";


class NavigationVertical extends React.Component {
  constructor(props) {
    super(props);
  };

  state = {
    sessionToken: null,
    sideMenu: false,
    term: '',
    menuColor: false,
    fireRedirect: false,
    searchResult: [],
    allMeetingsSideBarAvtive: false,
    cloudfront_token: 0,
    user_info: {},
    teamsOptions: [],
    current_team_id: null,
    current_team_name: null,
    duckNotification: null, 
    profilePath: null 
  };

  componentWillMount(){
    if (this.props.show!=undefined && this.props.show===false) {
      // do nothing if not show 
      console.log(this.props.show)
      return; 
    }

    Auth.currentSession({ bypassCache: true }).then(session => {
      this.setState({
        session: session,
        cloudfront_token: session.accessToken.jwtToken,
        sessionToken: session.accessToken.jwtToken
      }, () => {
        console.log(Auth.user)
      });
    });
  }

  componentDidMount() {
  }

  checkActive = (match, location) => {
    if (!match) {
      return false;
    }
    return true;
  }

  renderDuckNotification = () => {
    if (this.context.notification === null) {
      return (<></>)
    }
    return (
      this.context.notification
    )
  }

  render() {
    if (this.props.show===false ){
      return (<></>)
    }
    // return (
    //   <>
    // <Container fluid className='px-5'>
    //     <Nav style={{"font-size": "18px"}} fill variant="pills"  defaultActiveKey="profile" className="flex-column ">
    //         <Nav.Link active>Profile</Nav.Link>
    //         <Nav.Link href="posts">Posts</Nav.Link>
    //         <Nav.Link href="assets">Assets</Nav.Link>
    //         <Nav.Link href="members">Members</Nav.Link>
    //         <Nav.Link href="settings">Settings</Nav.Link>
    //     </Nav>
    // </Container>      
    // </>
    // );
    return (
      <>
        <Navbar expand={"md"} className="navbar-vertical fixed-start">
          <Container fluid>
            <Navbar.Toggle />
            <Navbar.Collapse>
              <Nav>
                <NavLink to={"dasda"} className="nav-link">
                  <FeatherIcon icon="bold" size="17" />
                  Backend
                </NavLink>
              </Nav>
              {<hr className="navbar-divider" />}
              <Nav>
                <NavLink to={""} className="nav-link">
                  <FeatherIcon icon="book" size="17" />
                  Documentation
                </NavLink>
              </Nav>
              <div className="mt-auto mb-md-4" />
              {/* {this.renderFooter()} */}
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </>
    );

  }
}

NavigationVertical.contextType = AppContext;
export default withRouter(NavigationVertical);
