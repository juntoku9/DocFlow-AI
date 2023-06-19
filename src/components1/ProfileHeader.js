// import Link from 'next/link';
// import { useRouter } from 'next/router';
import { Button, Col, Container, Nav, Row, Placeholder, Card } from 'react-bootstrap';
import { Avatar } from './Avatar';
import { Header }  from './Header';
import { Link } from "react-router-dom";

import { NavLink } from 'react-router-dom';



export default function ProfileHeader({ ...props }) {
//   const router = useRouter();

  return (
    <Header {...props}>
      <Header.ImageTop src={props.background_url}
                 style={{"cursor":"pointer"}}
                 alt="" />
      <Container fluid>
        <Header.Body className="mt-n5 mt-md-n6">
          <Row className="justify-content-center">
            <Col className="d-flex justify-content-center">
                <Header.AvatarTop size="xxl">
                  <Avatar.Image
                    alt=""
                    src={props.logo_url}
                    className="border border-4 border-body"
                    onLoad={() => console.log("ssss")}
                    style={{"cursor":"pointer"}}
                  />
                </Header.AvatarTop>
            </Col>
            {/* <Col xs={12} md="auto" className="mt-2 mt-md-0 mb-md-3">
              <Button onClick={props.editAction} variant="white" className="d-block d-md-inline-block w-100 lift">Edit Profile</Button>
            </Col> */}
          </Row>
          <Row className='mt-3'>
            <Col className="d-flex justify-content-center">
                {/* <Header.Pretitle>Brand</Header.Pretitle> */}
                <Header.Title>{props.name}</Header.Title>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col className="d-flex justify-content-center">
                <p>{props.description}</p>
            </Col>
          </Row>
        </Header.Body>
      </Container>
    </Header>
  );
}
