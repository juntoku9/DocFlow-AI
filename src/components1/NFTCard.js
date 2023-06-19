import React from 'react';
import { Badge, Button, Card, Col, Row } from 'react-bootstrap';
import { Avatar } from './Avatar';

export default function NFTCard({ ...props }) {
  return (
    <Card {...props}>
      <Card.Img variant="top" src="/img/covers/header-cover.jpg" alt="..." />
      <Card.Body>
        <Row className="align-items-center">
          <Col>
            <h4 className="mb-1">Banana NFT</h4>
            <Avatar as="a" size="xs" className="me-2">
                <Avatar.Image src="/img/avatars/profiles/avatar-1.jpg" className="rounded-circle" />
            </Avatar>
            <small className="text-muted">Jane Dow</small>
          </Col>
          <Col xs="auto">
            <Button
              variant="white"
              className='btn-pill'
              size="sm"
              href="https://themes.getbootstrap.com/preview/?theme_id=23273"
              target="_blank"
            >
              Buy
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
