import React from 'react';
import { Container, Row, Col, Card, Badge, Image, Table, Form, Button } from 'react-bootstrap';
import Navigation from '../components/Navigation/Navigation';
import FeatherIcon from 'feather-icons-react';

import { AppContext } from '../context/AppContext.js';
import { getDidCreateIfNotExistsOrExpired } from '../functions/login';
import { getCurrentWalletAddress } from '../functions/walletUtils';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AnalyticsHeader from '../widgets/Analytics/AnalyticsHeader';
import AnalyticsConversions from '../widgets/Analytics/AnalyticsConversions';
import AnalyticsTrafficChannels from '../widgets/Analytics/AnalyticsTrafficChannels';

import { ENTROPY_BACKEND_ADDRESS } from '../globals/address';
import { getHeader } from '../functions/headers';
import {convertEpochToDate} from '../functions/utils';

import { Bar, Line } from 'react-chartjs-2';
import { CustomChart, ChartLegend } from '../components/Analytics/vendor/Chart';

class AnalyticsDashboard extends React.Component {
    state = {
        analyticsDetail: {},
        visitHistory: [],

        vistGraphDataSource: [] ,
        createdEssays:[],
        essayDetail: "select past essays to view"

    };

    async componentDidMount() {
        const userAddress = await getCurrentWalletAddress();
        const authHeader = await getDidCreateIfNotExistsOrExpired();
        this.setState({
            currentAddress: userAddress,
            authHeader: authHeader
        }, () => {
            // fetch analytics statistics
            this.fetchAnalyticsStatsHistory()
        });
    }

    fetchAnalyticsStatsHistory=()=>{
        // postContent
        const requestOptions = {
            method: 'POST',
            // mode: 'no-cors',
            headers: getHeader(this),
            body: JSON.stringify({ wallet_address: this.state.currentAddress
            })
        };
        fetch(`${ENTROPY_BACKEND_ADDRESS}/api/chat/list`, requestOptions)
            .then(response => response.json())
            .then(response => {
                console.log(response)
                this.setState({createdEssays:response['files']})
                // this.setState({analyticsDetail:response, visitHistory:response.visit_history})
            });
    }


    renderStatus=(status)=>{
        if (status==="success"){
            return (<Badge className="bg-success-soft rounded-pill">{status}</Badge>)
        }
        else{
            return (<Badge className="bg-danger-soft rounded-pill">{status}</Badge>)
        }
    }

    viewEssayDetail=(index)=>{
        this.setState()

    }

    renderVistHistory=()=>{
        // created airdorps
        let rows = this.state.createdEssays.map((item, index) => {
            return (
                <tr key={index}>
                    <td>{item.title}</td>
                    <td>{item.created_at}</td>
                </tr>
            );
        })
        return (
            <Table size="sm" key={this.state.tableUpdateKey}>
            <thead>
                <tr>
                    <th >File Name</th>
                    <th >Date</th>
                    <th >Status</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </Table>
        )

    }

    renderGraph=()=>{
        let labels = [];
        let data = [];

        this.state.vistGraphDataSource.map((item, index)=> {
            labels.push(item['date'])
            data.push(item['visits'])
        })

        // showing the successful verificaitons
        // {
        //   label: '2019',
        //   data: [15, 10, 20, 12, 7, 0, 8, 16, 18, 16, 10, 22],
        //   backgroundColor: '#d2ddec',
        //   hidden: this.state.hidden,
        // },
        const datasets = [
        {
            label: 'visit count',
            data: data,
        },
        ];

        const options = {
        scales: {
            y: {
            ticks: {
                callback: function (val) {
                return val;
                },
            },
            },
        },
        };

    return (
        <Card>
            <Card.Header>
            <h4 className="card-header-title">AI writer View</h4>
            </Card.Header>
            <Card.Body>
                <Form.Control disabled style={{"white-space": "pre-wrap", "word-wrap": "break-word"}} onpaste="return false;" as="textarea" rows={25} value={this.state.essayDetail} onChange={(event) => { this.setState({college_name:event.target.value}) }} />

            </Card.Body>
        </Card>
        );
    }

    render() {
        return (
            <>
                <Navigation />
                <div className="main-content">
                    {/* Navigation */}
                    <Container fluid style={{width: "80%"}}>
                        <Row className="mt-5">
                            <Col xs={12} xl={12}>
                                <Card>
                                <Card.Header>
                                    <h4 className="card-header-title">Uploaded Files</h4>
                                </Card.Header>
                                <Card.Body>
                                    {this.renderVistHistory()}
                                </Card.Body>
                                </Card>
                            </Col>
                            {/* <AnalyticsTrafficChannels /> */}
                        </Row>
                    </Container>
                    <ToastContainer />
                </div>
            </>
        );
    }
}

AnalyticsDashboard.contextType = AppContext;
export default AnalyticsDashboard;
