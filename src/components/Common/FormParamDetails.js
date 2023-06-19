import React from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';
import FeatherIcon from 'feather-icons-react';


class FormParamDetails extends React.Component {
    state = {
        formParams: [],
    };

    componentDidMount() {
        console.log("render form detail....")
    }

    getCurrentParams() {
      return this.state.formParams;
    }

    addFormDetailItem=()=>{
        this.state.formParams.push([null, null])
        this.setState({formParams:this.state.formParams})
    }

    removeParam=(index)=>{
        this.state.formParams.splice(index, 1); // 2nd parameter means remove one item only
        this.setState({formParams:this.state.formParams})
    }


    handleChangeFormDetail=(event, pos)=>{
        const { name, value } = event.target;
        this.state.formParams[name][pos] = event.target.value;
        this.setState({formParams:this.state.formParams})
    }

    render(){
        // render the forms, iterate the values?
        // return form add chart
        let formItemComponent = []
        // for (var i=0; i<this.state.formParamsID; i++){
        Object.entries(this.state.formParams).forEach(([i, field]) => {
            formItemComponent.push(
                <>
                <Row>
                <Col>
                    <div className="form-group">
                      <Form.Control
                        type="text"
                        placeholder={"Membership Type"}
                        name={i}
                        onChange={(event) => {this.handleChangeFormDetail(event, 0)}}/>
                    </div>
                </Col>
                <Col>
                <Form.Control
                        type="text"
                        placeholder={"Platinum"}
                        name={i}
                        onChange={(event) => {this.handleChangeFormDetail(event, 1)}}
                    />
                </Col>
                <Col>
                    <Button variant="white" onClick={()=>this.removeParam(i)}>
                        <FeatherIcon icon="x-square" size="1em" />
                    </Button>
                </Col>
                </Row>
                </>
            )
        })
        return (
            <Row>
                <Row>
                    <Col className="d-flex justify-content-start">
                        <Button className="mt-mb-3 btn-pill" variant="dark"  onClick={this.addFormDetailItem}>Add</Button>
                    </Col>
                </Row>
                <Row className="mt-3">
                {formItemComponent}
                </Row> 
                
            </Row>
        )
    }
}

export default FormParamDetails;
