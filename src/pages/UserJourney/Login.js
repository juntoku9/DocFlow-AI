import React from 'react';
import { Button, Col, Form, Row, Image, Container, Spinner, Card } from 'react-bootstrap';
import { ENTROPY_BACKEND_ADDRESS } from '../../globals/address';
import { MAGIC, MAGIC_TEST } from '../../globals/magic';
import { postCreateUser, sessionLoggedIn, createLoginSession, getDidCreateIfNotExistsOrExpired } from '../../functions/login';
import { METAMASK_LOGIN, LOGIN_TYPE, EMAIL_LOGIN } from '../../globals/cookie';
import Cookies from 'js-cookie';
import Navigation from '../../components/Navigation/Navigation';
import { ToastContainer, toast } from 'react-toastify';

import { Link } from 'react-router-dom'
class Login extends React.Component {
  constructor(props) {
    super(props);

    // this is already set in the props, do we have to reset in the state?
    this.state = {
      emailAddress: null,
      password: null,
      signInMethod: null,
      signInError: null,
      // sign in guard 
      skipFirst: true,
      filteredParamKeys: ["forwardPath", "provider", "notloggedIn", "state"],
      forwardSearchPath: "",
      forwardSearchParams: ""
    };
  }

  async componentDidMount() {
    // access toekn
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;

    const updatingState = {
      forwardSearchPath: this.getForwardPathOrDefault(searchParams),
      forwardSearchParams: this.getForwardSearchParamsOrDefault(searchParams)
    };

    // Handle social signin 
    if (url.searchParams.get("provider")) {
      await this.handleSocialRedirectCallback();
      updatingState.waitForRedirect = true;
    }


    if (url.searchParams.get("notloggedIn")) {
      console.log("Got sign in error")
      updatingState.signInError = true;
    }
    const loggedIn = await sessionLoggedIn();

    if (loggedIn) {
      const idToken = await getDidCreateIfNotExistsOrExpired();
      updatingState.authHeader = idToken;
    }
    // // get the default team id
    this.setState(updatingState, this.ionViewCanEnter);
  }

  async ionViewCanEnter() {
    const loggedIn = await sessionLoggedIn();
    if (loggedIn) {
      if (Cookies.get(LOGIN_TYPE) !== METAMASK_LOGIN) {
        try {
          const status = await MAGIC.user.isLoggedIn();
          if (status) {
            this.props.history.push(this.getRedirectUrlFromForward());
          }
        } catch (e) {
          console.log("No one has signed in from our record");
        }
      } else {
        this.props.history.push(this.getRedirectUrlFromForward());
      }
    }
  }

  getRedirectUrlFromForward = () => {
    // console.log("search path", this.state.forwardSearchPath);
    // console.log("search param", this.state.forwardSearchParams);
    return `${this.state.forwardSearchPath}${this.state.forwardSearchParams}`;
  }

  getForwardSearchParamsOrDefault = (urlSearchParams) => {
    // trim out
    // forwardPath, provider, notloggedIn, state
    let hasForwardingParams = false;
    const postProcessedForwardParams = new URLSearchParams();
    for (const [key, value] of urlSearchParams) {
      if (!this.state.filteredParamKeys.includes(key)) {
        postProcessedForwardParams.append(key, value);
        hasForwardingParams = true;
      }
    }
    if (!hasForwardingParams) {
      return "";
    }
    console.debug("Will forward url search params: ", postProcessedForwardParams.toString());
    return `?${postProcessedForwardParams.toString()}`;
  }

  getForwardPathOrDefault = (urlSearchParams) => {
    if (!urlSearchParams.has("forwardPath")) {
      return "/chat";
    }
    return urlSearchParams.get("forwardPath");
  }

  handleLoginWithEmail = async () => {
    // Trigger Magic link to be sent to user
    var didToken = await MAGIC.auth.loginWithMagicLink({
      email: this.state.emailAddress,
      redirectURI: new URL('/callback', window.location.origin).href, // optional redirect back to your app after magic link is clicked
    });  
    
    // Validate didToken with server
    const res = await fetch(`${ENTROPY_BACKEND_ADDRESS}/api/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': didToken,
      },
    });

    if (res.status === 200) {
      try {
        const user = await MAGIC.user.getMetadata();
        await createLoginSession(user.email, EMAIL_LOGIN);
        await postCreateUser(user.email, user.publicAddress);
      } catch (e) {
        console.log(e);
      }
      this.props.history.push(this.getRedirectUrlFromForward());
    }
  }

  handleLoginWithGoogle = async () => {
    await MAGIC.oauth.loginWithRedirect({
      provider: 'google',
      redirectURI: this.createSocialRedirectUrl()
    });
  }

  handleLoginWithDiscord = async () => {
    await MAGIC.oauth.loginWithRedirect({
      provider: 'discord',
      redirectURI: this.createSocialRedirectUrl()
    });
  }

  createSocialRedirectUrl = () => {
    if (this.state.forwardSearchParams == "") {
      return `${window.location.href}?forwardPath=${this.state.forwardSearchPath}`
    } else {
      return `${window.location.href}${this.state.forwardSearchParams}&forwardPath=${this.state.forwardSearchPath}`;
    }
  }

  handleSocialRedirectCallback = async () => {
    const result = await MAGIC.oauth.getRedirectResult();
    if (result) {
      await createLoginSession(
        result.magic.userMetadata.publicAddress,
        result.oauth.provider);
      await postCreateUser(result.magic.userMetadata.email, result.magic.userMetadata.publicAddress);
    }
  }

  // TODO: separate the function out for reusability
  // promptSignMessage = async () => {
  //   const message = "Wecome to Clay, you are going to enter the metaverse for the future of commerce"
  //   if (!window.ethereum) {
  //     throw new Error("No crypto wallet found. Please install it.");
  //   }
  //   await window.ethereum.send("eth_requestAccounts");
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   const signer = provider.getSigner();
  //   const signature = await signer.signMessage(message);
  //   const address = await signer.getAddress();

  //   const signerAddr = await ethers.utils.verifyMessage(message, signature);
  //   if (signerAddr !== address) {
  //     console.log("sign in with metamask failed");
  //     return false;
  //   }
  //   // upon success check user status

  //   await createLoginSession(
  //     address,
  //     METAMASK_LOGIN,
  //     7);
  //   await postCreateUser(address);

  //   console.log("sign in with metamask succeeded");
  //   // Sign out magic if user switch to use metamask
  //   const signedInwithMagic = await MAGIC.user.isLoggedIn();
  //   if (signedInwithMagic) {
  //     await MAGIC.user.logout();
  //   }
  //   this.props.history.push(this.getRedirectUrlFromForward());
  // };

  renderSignInError = () => {
    if (this.state.signInError) {
      return (<p className="text-center" style={{ color: "#AF0606" }}>{"Please log in first to proceed"}</p>)
    }
    else {
      return (<></>)
    }
  }

  renderWaitingForRedirect = () => {
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;

    if (searchParams.get("provider")) {
      toast.success('Login succeeded, redirecting', {
        position: "bottom-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });        

      // return (<>
      //   <Row>
      //     <Col><p className="text-center" style={{ color: "#0C78CC" }}>{"Login succeeded, redirecting "}</p></Col>
      //   </Row>
      //   <Row className="justify-content-center">
      //   <Col md={{ span: 2 }}><Spinner animation="border" variant="primary" /></Col>
      //   </Row>
      // </>)
    }
    return (<></>)
  }

  renderSignInForm() {


    return (
      <>
            {this.renderSignInError()}
            {this.renderWaitingForRedirect()}
            <h1 className="display-4 text-center mb-3">Sign In</h1>
            <Row>
              
                <Form.Label className="mt-5" style={{fontSize: '1.5em'}}><strong>Email</strong></Form.Label>
                <Form.Control style={{"height": "5rem", fontSize: '1.5em'}} size="lg" type="email" placeholder="name@address.com" onChange={(event) => { this.setState({ emailAddress: event.target.value }) }} />
              
              <Button className="mt-5" style={{"height": "5rem", fontSize: '1.5em'}} variant="dark" onClick={this.handleLoginWithEmail}>
                <h2 className="mt-3">Sign in With Email</h2>
              </Button>
            </Row>
            <hr className="mt-mb-3"/>
            <Row>
              <Button variant="white"
                onClick={this.handleLoginWithGoogle}
                style={{"height": "5rem", fontSize: '1.5em', "background-color": "#DB4A39"}}
                >
                <Image src={"/img/logos/white-google-logo.png"}
                  style={{ "height": "1.5em" }} />
                  <h2 style={{"color": "white"}}>Sign in with Google</h2>

              </Button>
            </Row>
            {/* <Row>
              <Button variant="white"
                className="btn-pill mb-3"
                onClick={this.handleLoginWithDiscord}>
                <Image src={"/img/logos/discord-logo.png"}
                  style={{ "height": "1.5em" }} />{"Sign in with Discord"}
              </Button>
            </Row> */}

            {/* <hr className="mt-3 mb-3" /> */}
            <br />
            {/* By signing up or signing in, you are agreeing to Levels.fyi’s Terms of Use and Privacy Policy. */}


            {/* <Row className="justify-content-center">
              <Col md={{ span: 4, offset: 0 }}>
                <Card.Link href="/privacy-policy">Privacy Policy</Card.Link>
              </Col>
              <Col md={{ span: 4, offset: 1 }}><Card.Link href="/privacy-policy">Terms of Use</Card.Link></Col>
            </Row> */}
      </>
    );
  }


  render() {
    return (
      <div className="main-content">
      <Navigation hideFooter={true}/>
        <Container>
        <ToastContainer/>
          <Row className="justify-content-center">
            <Col xs={12} md={5} xl={6} className="my-5">
              {this.renderSignInForm()}
            </Col>
          </Row>

        </Container>
      </div>
    );
  }
}

export default Login;
