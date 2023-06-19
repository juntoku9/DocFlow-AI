import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { Container, Dropdown, Nav, Navbar, Image, Button, Row, Col } from 'react-bootstrap';
import { Avatar } from '../../components1/Avatar';
import { AppContext } from '../../context/AppContext.js';
import { getHeader } from '../../functions/headers';
import { ENTROPY_BACKEND_ADDRESS } from '../../globals/address';
import { signOutUser } from "../../functions/login";
import { getCurrentWalletAddress } from '../../functions/walletUtils';
import { getDidCreateIfNotExistsOrExpired } from '../../functions/login'

class NavigationUser extends React.Component {
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

  async componentWillMount() {
    if (this.props.show != undefined && this.props.show === false) {
      // do nothing if not show 
      console.log(this.props.show)
      return;
    }
    const address = await getCurrentWalletAddress();
    const authHeader = await getDidCreateIfNotExistsOrExpired();
    // if got current address then fetch the createdNFTs
    this.setState({
      currentAddress: address,
      authHeader: authHeader
    }, () => {
      this.getUserDetail();
    })
    // update context for the current wallet address
    this.context.actions.updateWallet(address);

    // update the context 
    // this.context.actions.updateProfilePath(profilePath);
  }

  renderLogo() {
    return (
      <Navbar.Brand style={{ "cursor": "pointer" }} onClick={() => window.open("https://www.protol.xyz/", "_blank")} className="mt-3">
        <Image className="navbar-brand-img mt-2" src="/img/protol-white-logo.png" alt="..." height="60%" />
      </Navbar.Brand>
    );
  }

  getUserDetail = () => {
    const requestOptions = {
      method: 'POST',
      // mode: 'no-cors',
      headers: getHeader(this),
      body: JSON.stringify({
        wallet_address: this.state.currentAddress
      })
    };
    fetch(`${ENTROPY_BACKEND_ADDRESS}/api/user/detail/get`, requestOptions)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        // set the profile url         
        if (response.profile_url) {
          this.context.actions.updateProfilePath(response.profile_url);
        }
      });
  }

  // update the context and set a new team
  onChangeHandlerTeam = (tags) => {
    // simply change the url
    // set the tags
    // update context
    this.context.actions.updateTeam(tags['value']);
    this.context.actions.updateTeamName(tags['label']);
    this.props.history.push(`/${tags['value']}/function-table/`);

    window.location.reload();
  }

  renderWalletSection = () => {
    if (this.context.walletAddress) {
      return (
        <Button variant="white" className="mx-5" id="dropdown-basic">
          {this.context.walletAddress}
        </Button>
      )
    }
    return (
      <Dropdown>
        <Dropdown.Toggle variant="white" className="mx-5" id="dropdown-basic">
          Wallet Options
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => { this.props.history.push("/login") }}>
            Connect My Wallet
          </Dropdown.Item>
          {/* <Dropdown.Item onClick={() => { this.retrieveTokenInformationAndDisplayPopUp()}}>
          Build A Wallet                          
      </Dropdown.Item> */}
        </Dropdown.Menu>
      </Dropdown>
    )
  }

  renderFooter() {
    return (
      <>
        <div className="navbar-user d-none d-md-flex" style={{ "margin-right": "10px" }}>
          {this.renderWalletSection()}
          <Dropdown drop="start">
            <Dropdown.Toggle as={Avatar} size="sm" role="button">
              <Avatar.Image
                src={this.context.profilePath || "/img/gradient.png"}
                className="rounded-circle"
              />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <NavLink to={'/admin'} 
               className="nav-link">
                <Dropdown.Item onClick={(event)=>{this.props.history.push({pathname:"/admin"})}}>Profile</Dropdown.Item>
              </NavLink>
              <Dropdown.Divider />
              <NavLink to="/login" className="nav-link">
                <Dropdown.Item onClick={() => { signOutUser(this) }}>Sign Out</Dropdown.Item>
              </NavLink>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </>
    );
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
    if (this.props.show === false) {
      return (<></>)
    }
    // <Nav>
    //     <NavLink to={buildRedirectPath(this.state.current_team_id, '/api-create/')} className="nav-link">
    //       <FeatherIcon icon="link-2" size="17" />
    //       API Management
    //     </NavLink>
    // </Nav>
    // <Nav>
    //     <NavLink to={buildRedirectPath(this.state.current_team_id, '/create-integration-source/')} className="nav-link">
    //       <FeatherIcon icon="share-2" size="17" />
    //       Integrations
    //     </NavLink>
    // </Nav>
    // <Nav>
    //     <NavLink to={buildRedirectPath(this.state.current_team_id, '/create-event-schedule/')} className="nav-link">
    //       <FeatherIcon icon="clock" size="17" />
    //       Task Scheduling
    //     </NavLink>
    // </Nav>
    // <Nav>
    //   <NavLink to={buildRedirectPath(this.state.current_team_id, '/create-function-source/')} className="nav-link">
    //     <FeatherIcon icon="package" size="17" />
    //     Function
    //   </NavLink>
    // </Nav>
    // <Nav>
    //   <NavLink to={buildRedirectPath(this.state.current_team_id, '/function-table/')} className="nav-link">
    //     <FeatherIcon icon="book-open" size="17" />
    //     Function
    //   </NavLink>
    // </Nav>
    if (this.props.privateHomePage) {
      return (
        <>
          <Navbar>
            <Container fluid className='px-5'>
              {/* <div className='d-flex flex-row'>
                  <div className='px-3'>
                   {this.renderLogo()}
                  </div>
                </div> */}

              {/* <Nav>
                    <NavLink to={buildRedirectPath(this.state.current_team_id, '/models/')} className="nav-link">
                      <FeatherIcon icon="terminal" size="17" />
                      ML (beta)
                    </NavLink>
                  </Nav> */}
              <Row>
                <Col className="d-flex justify-content-end">
                  {this.renderFooter()}
                </Col>
              </Row>
            </Container>
          </Navbar>
        </>
      );


    }
    return (
      <>
        <Navbar>
          <Container fluid className='px-5'>
              <div className='d-flex flex-row'>
                <div className='px-3'>
                 {this.renderLogo()}
                </div>
                <Nav>
                  <NavLink to={'/explore-nft/'} className="mx-5 nav-link">
                    Shops
                  </NavLink>
                </Nav>
                <Nav>
                  <NavLink to={'/nft-collections'} className="mx-5 nav-link">
                    My Collection
                  </NavLink>
                </Nav>
              <Nav>
                <NavLink to={'/analytics'} className="mx-5 nav-link">
                  About
                </NavLink>
              </Nav>
              </div>
            {this.renderFooter()}
          </Container>
        </Navbar>
      </>
    );
  }
}

NavigationUser.contextType = AppContext;
export default withRouter(NavigationUser);
