import React, { useState, useEffect, useRef, useCallback } from "react";
import { Row, Col, Form, Badge, ButtonGroup, Modal, Image, Spinner, Container, OverlayTrigger, Tooltip, Alert } from 'react-bootstrap';
import { Loading } from '@geist-ui/react';
import { ENTROPY_BACKEND_ADDRESS } from '../globals/address';

import Navigation from '../components/Navigation/Navigation';

import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getHeader, buildHeader } from '../functions/headers';
import { ThemeProvider, createTheme, Box, Button as MuiButton } from '@mui/material';
import moment from 'moment';

import { Button, Link, Collapse, Spacer, Text, useTheme, 
    Page as GeistPage, Grid, Input, Textarea, Card, Divider, Table, Pagination, Checkbox, Select, Radio } from '@geist-ui/react';
import { useAuth0 } from "@auth0/auth0-react";
import Question from '../components/Question'


const VocabPractice = () => {
    // auth related 
    const [inputText, setInputText] = useState('')
    const [authToken, setAuthToken] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [sourceBook, setSourceBook] = useState("french_a1");
    const [tableUpdateKey, setTableUpdateKey] = useState(0);

    const [answers, setAnswers] = useState([]);
    const [explanations, setExplanations] = useState([]);
    const [loadingStatus, setLoadingStatus] = useState([]);
    const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [currentWord, setCurrentWord] = useState(null);
    const [currentInfo, setCurrentInfo] = useState(null);


    const getPageData = () => {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return vocab.slice(startIndex, endIndex);
      };
      
    // vocab 
    const [vocab, setVocab] = useState([]);

    const [word, setWord] = useState([]);

    const handleInputChange = (event, index) => {
        const updatedQuestions = [...answers];
        updatedQuestions[index] = event.target.value;
        setAnswers(updatedQuestions);
        // console.log(answers)
      };
      
    const showAnswer = (index) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].showAnswer = true;
        setQuestions(updatedQuestions);
      };
      

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
  
    const handleSubmit = (event) => {
      event.preventDefault()
      console.log(`Submitted text: ${inputText}`)
    }

    useEffect(() => {
        if (isAuthenticated){
            loadVocab();
        }
      }, [authToken]);
    
  
    const loadVocab=()=>{
        const requestOptions = {
            method: 'POST',
            // mode: 'no-cors',
            headers: buildHeader(authToken),
            body: JSON.stringify({ 
                word: word, 
                source_book: sourceBook
            })
        };
        fetch(`${ENTROPY_BACKEND_ADDRESS}/api/edu/load_vocab_list`, requestOptions)
            .then(response => response.json())
            .then(response => {
                // set the questions
                if (response.result){
                    console.log(response.result)
                    setVocab(response.result);
                }
                
            });
    }

    const generateQuiz=()=>{
        // clear all the states 
        setQuestions([])
        setAnswers([])
        setExplanations([])
        setLoadingStatus([])
    
        if (currentWord == null){
            alert("choose a word")
            return;
        }
        setIsGeneratingQuiz(true);
        const requestOptions = {
            method: 'POST',
            // mode: 'no-cors',
            headers: buildHeader(authToken),
            body: JSON.stringify({ 
                word: currentWord,
                difficulty: "easy", 
                source_book: sourceBook
            })
        };
        fetch(`${ENTROPY_BACKEND_ADDRESS}/api/edu/generate_questions`, requestOptions)
            .then(response => response.json())
            .then(response => {
                console.log(response)
                // set the questions
                setQuestions(response.result)
                console.log("set question succeeded")
                setIsGeneratingQuiz(false)
            });
    }

    const updateVocabState=(vocab_id, state)=>{
        // clear all the states     
        const requestOptions = {
            method: 'POST',
            // mode: 'no-cors',
            headers: buildHeader(authToken),
            body: JSON.stringify({ 
                vocab_id: vocab_id,
                state: state
            })
        };
        fetch(`${ENTROPY_BACKEND_ADDRESS}/api/edu/update_vocab_state`, requestOptions)
            .then(response => response.json())
            .then(response => {
                console.log(response)
            });
    }


    const postCorrectStudent= async (index)=>{
        const updatedStatus = [...loadingStatus];
        updatedStatus[index] = true;
        setLoadingStatus(updatedStatus);
    
        const requestOptions = {
            method: 'POST',
            // mode: 'no-cors',
            headers: buildHeader(authToken),
            body: JSON.stringify({ 
                student_sentence: answers[index], 
                target_sentence: questions[index][0]
            })
        };
        // fetch(`${ENTROPY_BACKEND_ADDRESS}/api/edu/generate_correction`, requestOptions)
        //     .then(response => response.json())
        //     .then(response => {
        //         console.log(response)
        //         // set the questions
        //         const updatedQuestions = [...answers];
        //         updatedQuestions[index] = response.result;
        //         setExplanations(updatedQuestions);
        
        //         console.log("set question succeeded")
        //         const updatedStatus = [...loadingStatus];
        //         updatedStatus[index] = false;
        //         setLoadingStatus(updatedStatus);
        
        //     });

            try {
                const response = await fetch(
                    `${ENTROPY_BACKEND_ADDRESS}/api/edu/generate_correction`,
                  requestOptions
                );
            
                if (!response.ok) {
                  throw new Error("Network response was not ok");
                }
                if (response.body === null) {
                  console.log("there is no valid response")
                  //show the error on a diaglog pop           
                  return;
                }
                const reader = response.body.getReader();
                const decoder = new TextDecoder("utf-8");
            
                let result = "";
                let chunk = await reader.read();
            
                while (!chunk.done) {
                  const chunkText = decoder.decode(chunk.value, { stream: true });
                  result += chunkText;
                    // Check if the previous interpretation state is undefined and initialize it with an empty string
                    const updatedQuestions = [...answers];
                    updatedQuestions[index] = result;
                    setExplanations(updatedQuestions);
          
                  chunk = await reader.read();
                }

                const updatedStatus = [...loadingStatus];
                updatedStatus[index] = false;
                setLoadingStatus(updatedStatus);
        
            
                // setIsLoading(false);
              } catch (error) {
                console.error("Error in fetch: ", error);
                alert("error in interpretation result " + error);
          
                // setIsLoading(false);
                const updatedStatus = [...loadingStatus];
                updatedStatus[index] = false;
                setLoadingStatus(updatedStatus);
        
              }
                  
    }


    const renderVocabAction = (value, rowData, index) => {
        return (
          <Button type="success" auto scale={1/3} font="12px" 
            onClick={()=>{
                setCurrentWord(rowData['word'] + "  " +rowData['meaning']); 
                setCurrentInfo(rowData);
            }}>Load</Button>
        )
      }

      const renderCheckVocab = (value, rowData, index) => {
        // assuming you have an updateVocabState function defined somewhere
        // and this function takes two parameters: id and the new state
        const handleChange = (event) => {
            console.log(event.target.checked);
            // should also update hte state in the forntend 
            rowData.state = event.target.checked? "known" : "unknown";
            updateVocabState(rowData['id'], event.target.checked? "known" : "unknown");
        }
    
        return (
            <Checkbox
                type={"success"}
                checked={rowData.state == "known"? true: false}  // assuming `value` is the current state of the checkbox
                onChange={handleChange}
            />
        );
    }
        
    useEffect(() => {
        // This function will be called after the 'sourceBook' state is updated.
        loadVocab();
        setTableUpdateKey(tableUpdateKey+1);
      }, [sourceBook]); // Specify 'sourceBook' as a dependency to trigger the effect whenever it changes.

      useEffect(() => {
        // This function will be called after the 'sourceBook' state is updated.
        setTableUpdateKey(tableUpdateKey+1);
      }, [vocab]); // Specify 'sourceBook' as a dependency to trigger the effect whenever it changes.
    
    const renderExtraColumns = () =>{
        if (vocab.length>0){
            const keys = Object.keys(vocab[0].additional_fields);
            console.log(keys)
            const columns = [];
            for (let key of keys) {
                columns.push(<Table.Column prop={key} label={key} width={150} />)
            }
            return columns;     
        }
        else{
            return (<></>)
        }
    }

    return (
        <>
            <Navigation />
            <div className="main-content">
                <ToastContainer/>
                <Row className="justify-content-center">
                    <Col xl={5}>
                    <Card>
                        <Text h3>Settings</Text>
                        <Spacer />
                        <Row>
                        {/* <Col>
                            <Text>Radio Buttons:</Text>
                            <Radio.Group
                            // value={radioValue}
                            onChange={(e) => console.log("1")}
                            >
                            <Radio value="option1">Option 1</Radio>
                            <Radio value="option2">Option 2</Radio>
                            <Radio value="option3">Option 3</Radio>
                            </Radio.Group>
                        </Col> */}
                        {/* <Spacer /> */}
                        <Col>
                            <Text>Sentence Difficulty:</Text>
                            <Select
                            value={"choice1"}
                            onChange={(value) => console.log("1")}
                            >
                            <Select.Option value="choice1">Easy</Select.Option>
                            <Select.Option value="choice2">Medium</Select.Option>
                            <Select.Option value="choice3">Hard</Select.Option>
                            </Select>
                        </Col>
                        <Spacer />
                        <Col>
                            <Text>Checkbox:</Text>
                            <Checkbox
                            checked={true}
                            onChange={(e) => console.log("1")}
                            >
                            Check me
                            </Checkbox>
                        </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Text>Vocab Book</Text>
                                <Select
                                value={"choice1"}
                                onChange={(value) => {setSourceBook(value)}  }
                                >
                                <Select.Option value="french_a1">French A1</Select.Option>
                                <Select.Option value="japanese_zhongji_xinbian">Japanese N2</Select.Option>
                                </Select>
                            </Col>

                        </Row>
                    </Card>

                        <Card style={{"marginTop": "15px"}}>
                            <Text h3 > Vocab</Text>
                            <Table data={getPageData()} maxHeight={15} scroll key={tableUpdateKey}>
                                <Table.Column prop="word" label="Vocab" />
                                <Table.Column prop="meaning" label="Meaning" />
                                {renderExtraColumns()}
                                <Table.Column prop="load" label="Load" width={150} render={renderVocabAction} />
                                <Table.Column prop="check" label="Check" width={150} render={renderCheckVocab} />
                            </Table>
                            <Pagination
                            page={page}
                            count={Math.ceil(vocab.length / itemsPerPage)}
                            limit={5}
                            onChange={(newPage) => setPage(newPage)}
                            />
                        </Card>
                    </Col>
                    <Col xl={7}>
                    <Text h1>Vocab Test</Text>
                    <Spacer y={2} />
                    <form onSubmit={handleSubmit}>
                    {
                        currentInfo?
                        (<div>
                        <Text h5>The word</Text>
                        <Text h1>{currentInfo.word}</Text>
                        <Row>
                            <Col>
                                <Text h5>Meaning</Text>
                                <Text h3>{currentInfo? currentInfo.meaning: ""}</Text>
                            </Col>
                            {
                                Object.entries(currentInfo.additional_fields).map(([key, value]) => (
                                    <Col>
                                        <Text h5>{key}</Text>
                                        <Text h3>{currentInfo? value: ""}</Text>
                                    </Col>
                                    ))
                            }
                        </Row>
                        <Spacer y={0.5} />
                        </div>) : (<></>)
                        }
                        <Spacer y={2} />
                        
                        <Button type="submit" type={"secondary"} size="large" auto onClick={generateQuiz}>
                            Generate Quiz
                        </Button>
                    </form>
                    <br/>
                    {isGeneratingQuiz && <Loading>Generating quiz</Loading>}
                    {questions.map((q, index) => (
                        <div key={index}>
                            <Card style={{ marginTop: "10px" }}>
                            <Grid.Container gap={2} alignItems="center">
                                <Grid xs={24} md={24}>
                                    <Text h3 >{q[1]}</Text>
                                    <Text h3>({q[2]})</Text>
                                </Grid>
                                <Grid xs={24} md={24}>
                                    <Textarea
                                        width="60%"
                                        placeholder="Type your answer"
                                        value={q.answer}
                                        onChange={(event) => handleInputChange(event, index)}
                                        style={{ resize: 'vertical', marginTop: "10px" }}
                                        rows={2}
                                    />
                                </Grid>
                                <Grid xs={24} md={24} justify="flex-start">
                                    <ButtonGroup>
                                        <Button ghost auto shadow onClick={() => showAnswer(index)}>Show Answer</Button>
                                        <Button ghost auto shadow style={{ marginLeft: "10px" }} onClick={() => postCorrectStudent(index)}>Correct Me</Button>
                                    </ButtonGroup>
                                </Grid>
                            </Grid.Container>
                            <Divider h="2px" my={2} />

                            {q.showAnswer && 
                                <Card type="warning">
                                    <Text>{"answer: " + q[0]}</Text>
                                </Card>
                                }
                            {loadingStatus[index]==true && <Loading style={{ whiteSpace: 'pre-wrap' }}>Loading</Loading>}
                            {explanations[index] && <Card type="cyan" style={{"marginTop": "5px"}}>
                            <div style={{ whiteSpace: 'pre-wrap' }}>
                                <Text>{explanations[index]}</Text>
                            </div>
                            </Card>}

                            </Card>
                        </div>
                    ))}

                    </Col>
                </Row>
            </div>
    </>
    )
    
}




export default VocabPractice;
