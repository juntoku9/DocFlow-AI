import React from 'react';
import {Row, Col, Breadcrumb, Image, Media, Button} from 'react-bootstrap';
import { Link } from "react-router-dom";
import Navigation from '../components/Navigation/Navigation';
import Footer from './Footer/Footer'
import * as Icon from 'react-feather';

// User Images
import user1 from '../assets/img/user/user1.jpg';
import user2 from '../assets/img/user/user2.jpg';
import user3 from '../assets/img/user/user3.jpg';
import user4 from '../assets/img/user/user4.jpg';
import user5 from '../assets/img/user/user5.jpg';

// Post Image 
import postImageOne from '../assets/img/post/post-img.jpg';
import postImageTwo from '../assets/img/post/post-img2.jpg';
import postImageThree from '../assets/img/post/post-img3.jpg';

class Profile extends React.Component {
    state = {
        sideMenu: true
    };

    // Toggle side bar menu
    _onSideMenu = (active) => {
        this.setState({sideMenu: active});
    }

    render() {
        return (
            <div className="page-wrapper"> 
                {/* Navigation */}
                <Navigation onClick={this._onSideMenu} />
                {/* End Navigation */}
                
                <div className={`main-content d-flex flex-column ${this.state.sideMenu ? '' : 'hide-sidemenu'}`}>
                    {/* Breadcrumb */}
                    <div className="main-content-header">
                        <Breadcrumb>
                            <h1>Profile</h1>
                            <Link to="/dashboard" className="breadcrumb-item">
                                Dashboard
                            </Link>
                            <Breadcrumb.Item active>Profile</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    {/* End Breadcrumb */}

                    {/* Profile area */}
                    <Row>
                        <Col lg={12}>
                            <div className="profile-header mb-4">
                                <Image 
                                    src={user1} 
                                    alt="Profle" 
                                    roundedCircle 
                                />
                                <h3 className="name mt-3">Runde Yang</h3>
                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>

                                <div className="profile-stats">
                                    <Link to="#">
                                        <strong>587</strong> Posts 
                                    </Link>
                                    <Link to="#">
                                        <strong>963</strong> Following 
                                    </Link>
                                    <Link to="#">
                                        <strong>576</strong> Followers
                                    </Link>
                                </div>
                            </div>
                        </Col>

                        <Col lg="3">
                            <div className="profile-left-content">
                                <div className="card mb-4">
                                    <div className="card-body">
                                        <div className="card-header">
                                            <h5 className="card-title">Info</h5>
                                        </div>
                                        <ul className="info">
                                            <li> 
                                                <Icon.MapPin 
                                                    className="icon"
                                                /> 
                                                Location: Canada
                                            </li>
                                            <li> 
                                                <Icon.Edit 
                                                    className="icon"
                                                /> 
                                                Language: English
                                            </li>
                                            <li> 
                                                <Icon.Calendar 
                                                    className="icon"
                                                /> 
                                                Joined: Joined March 2019
                                            </li>
                                            <li> 
                                                <Icon.Aperture 
                                                    className="icon"
                                                /> 
                                                Birthday: Born March 2, 1995
                                            </li>
                                            <li> 
                                                <Icon.Phone 
                                                    className="icon"
                                                /> 
                                                Phone: +0 (123) 456 7892
                                            </li>
                                            <li> 
                                                <Icon.Mail 
                                                    className="icon"
                                                /> 
                                                Email: example@gmail.com
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col lg="6">
                            <div className="profile-middle-content mb-4">
                                {/* Post card */}
                                <div className="post-card">
                                    <Media>
                                        <Image
                                            width={50}
                                            height={50}
                                            className="mr-3"
                                            src={user1} 
                                            roundedCircle
                                            alt="User"
                                        />
                                        <Media.Body>
                                            <h5>
                                                <Link to="">
                                                    There are many variations of passages of Lorem Ipsum
                                                </Link>
                                            </h5>
                                            <p>
                                                Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque
                                                ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at,
                                                tempus viverra turpis.
                                            </p>
                                            <Link to="">
                                                <Image
                                                    src={postImageOne} 
                                                    alt="Post Image" 
                                                />
                                            </Link>
                                            <div className="feed-back mt-3">
                                                <Link to="">
                                                    <Icon.MessageSquare 
                                                        className="icon"
                                                    /> 
                                                    897
                                                </Link>
                                                <Link to="">
                                                    <Icon.ThumbsUp 
                                                        className="icon"
                                                    /> 
                                                    897
                                                </Link>
                                                <Link to="">
                                                    <Icon.Share2 
                                                        className="icon"
                                                    /> 
                                                    897
                                                </Link>
                                            </div>
                                        </Media.Body>
                                    </Media>
                                </div>
                                {/* End post card */}

                                {/* Post card */}
                                <div className="post-card">
                                    <Media>
                                        <Image
                                            width={50}
                                            height={50}
                                            className="mr-3"
                                            src={user1} 
                                            roundedCircle
                                            alt="User"
                                        />
                                        <Media.Body>
                                            <h5>
                                                <Link to="">
                                                    There are many variations of passages of Lorem Ipsum
                                                </Link>
                                            </h5>
                                            <p>
                                                Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque
                                                ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at,
                                                tempus viverra turpis.
                                            </p>
                                            <Link to="">
                                                <Image
                                                    src={postImageTwo} 
                                                    alt="Post Image" 
                                                />
                                            </Link>
                                            <div className="feed-back mt-3">
                                                <Link to="">
                                                    <Icon.MessageSquare 
                                                        className="icon"
                                                    /> 
                                                    897
                                                </Link>
                                                <Link to="">
                                                    <Icon.ThumbsUp 
                                                        className="icon"
                                                    /> 
                                                    897
                                                </Link>
                                                <Link to="">
                                                    <Icon.Share2 
                                                        className="icon"
                                                    /> 
                                                    897
                                                </Link>
                                            </div>
                                        </Media.Body>
                                    </Media>
                                </div>
                                {/* End post card */}

                                {/* Post card */}
                                <div className="post-card">
                                    <Media>
                                        <Image
                                            width={50}
                                            height={50}
                                            className="mr-3"
                                            src={user1} 
                                            roundedCircle
                                            alt="User"
                                        />
                                        <Media.Body>
                                            <h5>
                                                <Link to="">
                                                    There are many variations of passages of Lorem Ipsum
                                                </Link>
                                            </h5>
                                            <p>
                                                Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque
                                                ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at,
                                                tempus viverra turpis.
                                            </p>
                                            <Link to="">
                                                <Image
                                                    src={postImageThree} 
                                                    alt="Post Image" 
                                                />
                                            </Link>
                                            <div className="feed-back mt-3">
                                                <Link to="">
                                                    <Icon.MessageSquare 
                                                        className="icon"
                                                    /> 
                                                    897
                                                </Link>
                                                <Link to="">
                                                    <Icon.ThumbsUp 
                                                        className="icon"
                                                    /> 
                                                    897
                                                </Link>
                                                <Link to="">
                                                    <Icon.Share2 
                                                        className="icon"
                                                    /> 
                                                    897
                                                </Link>
                                            </div>
                                        </Media.Body>
                                    </Media>
                                </div>
                                {/* End post card */}
                            </div>
                        </Col>
                    
                        <Col lg="3">
                            <div className="profile-right-content">
                                <div className="card mb-4">
                                    <div className="card-body">
                                        <div className="card-header">
                                            <h5 className="card-title">Connect</h5>
                                        </div>

                                        <div className="connecting-list">
                                            {/* Card */}
                                            <Media>
                                                <Link to="">
                                                    <Image 
                                                        width={35} 
                                                        height={35} 
                                                        className="mr-2" 
                                                        src={user1} 
                                                        roundedCircle 
                                                        alt="User" 
                                                    />
                                                </Link>

                                                <Media.Body>
                                                    <h5>
                                                        <Link to="">
                                                            Amber Gibs
                                                        </Link>
                                                    </h5>
                                                    <Button 
                                                        variant="outline-primary rounded"
                                                    >
                                                        Follow
                                                    </Button>
                                                </Media.Body>
                                            </Media> 
                                            {/* End Card */}  

                                            {/* Card */}
                                            <Media>
                                                <Link to="">
                                                    <Image 
                                                        width={35} 
                                                        height={35} 
                                                        className="mr-2" 
                                                        src={user2} 
                                                        roundedCircle 
                                                        alt="User" 
                                                    />
                                                </Link>

                                                <Media.Body>
                                                    <h5>
                                                        <Link to="">
                                                            Carl Roland
                                                        </Link>
                                                    </h5>
                                                    <Button 
                                                        variant="outline-primary rounded"
                                                    >
                                                        Follow
                                                    </Button>
                                                </Media.Body>
                                            </Media> 
                                            {/* End Card */}  

                                            {/* Card */}
                                            <Media>
                                                <Link to="">
                                                    <Image 
                                                        width={35} 
                                                        height={35} 
                                                        className="mr-2" 
                                                        src={user3} 
                                                        roundedCircle 
                                                        alt="User" 
                                                    />
                                                </Link>

                                                <Media.Body>
                                                    <h5>
                                                        <Link to="">
                                                            Paul Wilson
                                                        </Link>
                                                    </h5>
                                                    <Button 
                                                        variant="outline-primary rounded"
                                                    >
                                                        Follow
                                                    </Button>
                                                </Media.Body>
                                            </Media> 
                                            {/* End Card */} 

                                            {/* Card */}
                                            <Media>
                                                <Link to="">
                                                    <Image 
                                                        width={35} 
                                                        height={35} 
                                                        className="mr-2" 
                                                        src={user4} 
                                                        roundedCircle 
                                                        alt="User" 
                                                    />
                                                </Link>

                                                <Media.Body>
                                                    <h5>
                                                        <Link to="">
                                                            Alice Jenkins
                                                        </Link>
                                                    </h5>
                                                    <Button 
                                                        variant="outline-primary rounded"
                                                    >
                                                        Follow
                                                    </Button>
                                                </Media.Body>
                                            </Media> 
                                            {/* End Card */}

                                            {/* Card */}
                                            <Media>
                                                <Link to="">
                                                    <Image 
                                                        width={35} 
                                                        height={35} 
                                                        className="mr-2" 
                                                        src={user5} 
                                                        roundedCircle 
                                                        alt="User" 
                                                    />
                                                </Link>

                                                <Media.Body>
                                                    <h5>
                                                        <Link to="">
                                                            Lauren Cox
                                                        </Link>
                                                    </h5>
                                                    <Button 
                                                        variant="outline-primary rounded"
                                                    >
                                                        Follow
                                                    </Button>
                                                </Media.Body>
                                            </Media> 
                                            {/* End Card */} 
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    {/* End Profile area */}

                    {/* Footer  */}    
                    <div className="flex-grow-1"></div>
                    <Footer />
                    {/* End Footer  */}
                </div>
            </div>
        );
    }
}

export default Profile;