import React from 'react';
import { Button, Col, Form, Row, Image, Container, Spinner, Card } from 'react-bootstrap';
import { ENTROPY_FRONTEND_ADDRESS } from '../../globals/address';
class MagicCallback extends React.Component {
    constructor(props) {
        super(props);

        // this is already set in the props, do we have to reset in the state?
        this.state = {
            loginSuccessful: false,
        };
    }

    async componentDidMount() {
        const url = new URL(window.location.href);
        if (url.searchParams.get("magic_credential")) {
            this.setState({ loginSuccessful: true })
        }
    }

    renderSignInError = () => {
        if (this.state.signInError) {
            return (<p className="text-center" style={{ color: "#AF0606" }}>{"Please log in first to proceed"}</p>)
        }
        else {
            return (<></>)
        }
    }

    renderSignInForm() {
        if (!this.state.loginSuccessful) {
            return (
                <>
                    <Card>
                        <Card.Body>
                            <Card.Title><h3>Pending login page</h3></Card.Title>
                            <Card.Text>
                                Please wait for a sec till the login request to be filled
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </>
            );
        }

        return (
            <>
                <Card>
                    <Card.Body>
                        <Card.Title><h3>Back to login page</h3></Card.Title>
                        <Card.Text>
                            Email login successful! Please go back to the tab where you login originally :)
                        </Card.Text>

                        <Card.Text>
                            If you lost that tab, please click here to get back and re-login: <a href={`${ENTROPY_FRONTEND_ADDRESS}/login`}>Go back to login</a>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </>
        );
    }


    render() {
        return (
            <div className="d-flex align-items-center min-vh-100 bg-auth border-top border-top-2 border-primary"
                style={{
                    "background-image": `url(${"/img/gradient.jpg"})`,
                    "background-position": "center",
                    "background-repeat": "no-repeat",
                    "background-size": "cover",
                    "height": "100%"
                }}
            >
                <Container>
                    <Row className="justify-content-center">
                        <Col xs={12} md={5} xl={5} className="my-5">
                            {this.renderSignInForm()}
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default MagicCallback;
