import React, { useState, useEffect, useRef, useCallback } from "react";
import { Row, Col, Form, Card, Badge, ButtonGroup, Modal, Image, Spinner, Container, Table, OverlayTrigger, Tooltip, Alert } from 'react-bootstrap';
import { Loading } from '@geist-ui/react';
import { ENTROPY_BACKEND_ADDRESS } from '../globals/address';

import Navigation from '../components/Navigation/Navigation';

import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getHeader, buildHeader } from '../functions/headers';
import { ThemeProvider, createTheme, Box, Button as MuiButton } from '@mui/material';
import moment from 'moment';

import { Button, Link, Collapse, Spacer, Text, useTheme, Page as GeistPage, Grid, Input } from '@geist-ui/react';
import { useAuth0 } from "@auth0/auth0-react";
import Question from '../components/Question'


const PracticeBuilderPage = () => {
    // auth related 
    const [inputText, setInputText] = useState('')
    const [authToken, setAuthToken] = useState(null);
    const [questions, setQuestions] = useState([]);


    const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const getUserMetadata = async () => {      
          try {
            const accessToken = await getAccessTokenSilently();
            //set the access token to the header
            setAuthToken(accessToken)
            // setUserMetadata(user_metadata);
          } catch (e) {
            console.log(e.message);
          }
        };
      
        getUserMetadata();
      }, [getAccessTokenSilently, user?.sub]);

    const handleInputChange = (event) => {
      setInputText(event.target.value)
    }
  
    const handleSubmit = (event) => {
      event.preventDefault()
      console.log(`Submitted text: ${inputText}`)
    }
  
    const generateQuiz=()=>{
        const requestOptions = {
            method: 'POST',
            // mode: 'no-cors',
            headers: buildHeader(authToken),
            body: JSON.stringify({ 
                sub: user.sub,
                source: inputText
            })
        };
        fetch(`${ENTROPY_BACKEND_ADDRESS}/api/edu/generate_quiz`, requestOptions)
            .then(response => response.json())
            .then(response => {
                console.log(response)
                // set the questions
                setQuestions(response.result)

            });
    }

    return (
        <>
            <Navigation />
            <div className="main-content">
                <ToastContainer/>
                <Row className="justify-content-center">
                    <Col xl={6}>
                    <Text h1>Create Reading Test</Text>
                    <Spacer y={2} />
                    <form onSubmit={handleSubmit}>
                        <div>
                        <Text h3>Enter Reading Material</Text>
                        <Spacer y={0.5} />
                        <Form.Control
                            as="textarea"
                            placeholder="Type something"
                            value={inputText}
                            onChange={handleInputChange}
                            style={{ resize: 'vertical' }}
                            rows={25}
                        />
                        </div>
                        <Spacer y={2} />
                        <Button type="submit" type={"secondary"} size="large" auto onClick={generateQuiz}>
                            Generate Quiz
                        </Button>
                    </form>
                    {questions.map((q, index) => (
                        <Question
                            key={index}
                            index={index}
                            question={q.question}
                            choices={q.choices}
                            answer={q.answer}
                            explanation={q.explanation}
                        />
                    ))}

                    </Col>
                </Row>
            </div>
    </>
    )
    
}




export default PracticeBuilderPage;
