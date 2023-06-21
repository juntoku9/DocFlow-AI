import React, { useState, useEffect, useRef, useCallback } from "react";
import { Row, Col, Card, Badge, Form, ButtonGroup, Modal, Image, Spinner, Container, Table, OverlayTrigger, Tooltip, Alert } from 'react-bootstrap';
import { Loading } from '@geist-ui/react';
import { ENTROPY_BACKEND_ADDRESS } from '../globals/address';

import Navigation from '../components/Navigation/Navigation';
import { ArrowLeft } from 'react-bootstrap-icons';
import { Dropzone } from '../components1/vendor/Dropzone';

import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getHeader, buildHeader } from '../functions/headers';
import { ThemeProvider, createTheme, Box, Button as MuiButton } from '@mui/material';
import moment from 'moment';
import MaterialReactTable from 'material-react-table';
import TableComponent from './TableComponent'
import ChatBox from './ChatBox'

import { Document, Page, pdfjs } from 'react-pdf';

import { Viewer } from '@react-pdf-viewer/core';
import { highlightPlugin, RenderHighlightTargetProps, MessageIcon } from '@react-pdf-viewer/highlight';
import { searchPlugin } from '@react-pdf-viewer/search';
import { getFilePlugin, DownloadIcon } from '@react-pdf-viewer/get-file';
import VerticalSidebar from './Toolbar';
import SubscriptionPopup from './SubModel'
// Import the styles
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';
import '@react-pdf-viewer/search/lib/styles/index.css';

import { Button, Link, Collapse, Spacer, Text, useTheme, Page as GeistPage, Grid } from '@geist-ui/react';

import { useAuth0 } from "@auth0/auth0-react";
import { RefreshCw, Plus, Filter, Delete } from '@geist-ui/icons'

// solve the worker problem
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


const ChatPage = () => {
    // auth related 
    const [isPageLoading, setPageLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [fileSize, setFileSize] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [showPdfRender, setShowPdfRender] = useState(null);
    const [isUploadingFile, setIsUploadingFile] = useState(false);
    // TODO: This rerender method is messay, can we just jump in the page? 
    const [pdfViewerKey, setPdfViewerKey] = useState(0);
    const [uploadedPDF, setUploadedPDF] = useState(null);
    const [usage, setUsage] = useState(null);
    const [bambooCredit, setBambooCredit] = useState(null);
    const [currentAddress, setWalletAddress] = useState(null);
    const [authToken, setAuthToken] = useState(null);
    const [currentFileInfo, setCurrentFileInfo] = useState({file: null, fileID: null, pdfURL:null, sourceInfo: null, status: null });
    const [planDetail, setPlanDetail] = useState({usage: null, bambooCredit: null, currentSubscription: null, chatUsage: null, fileCount:null });
    const [pdfStartPage, setPdfStartPage] = useState(0);

    const [sourceHighlight, setSourceHighlight] = useState("");
    const [selectedRow, setSelectedRow] = useState(null);
    const [rowSelection, setRowSelection] = useState({});

    const [isHiddenParent, setIsHiddenParent] = useState(false);
    
    // disable message sending when qa in progress 
    const [disableMessageSending, setDisableMessageSending] = useState(false);
    
    const fileInputRef = useRef(null);
    const pdfViewer = useRef(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    // auth related 
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
      

    useEffect( () => {
        if (authToken){
            // fetchPlanStatus(true);
            // list the initial message 
            // welcome message is not needed
            // const welcomeMsg="welcome to PandaGPT, please upload a file or click on the file title from the right side to start chatting"
            // setMessages((prevMessages) => [...prevMessages, {"side": "bot", "message": welcomeMsg}])
        }
        // this.fetchPlanStatus();
    }, [authToken, user?.sub]);

    // setup polling for file processing status 
    // useEffect(() => {          
    //     if (authToken){
    //         listUploadedFiles();
    //         // setup the polling interval for file updates 
    //         // TODO: Make this a subscription based data view in the future     
    //         const interval = setInterval(listUploadedFiles, 5*1000);
    //         return () => clearInterval(interval);
    //     }
    //   }, []);

    const postSendQuestion = (currentQuestion) => {
        setDisableMessageSending(true)
        const requestOptions = {
            method: 'POST',
            // mode: 'no-cors',
            headers: buildHeader(getT),
            body: JSON.stringify({ question: currentQuestion,
                sub: user.sub,
                })
          };
          fetch(`${ENTROPY_BACKEND_ADDRESS}/api/edu/qa`, requestOptions)
            .then(response => response.json())
            .then(response => {
              setMessages((prevMessages) => {
                const newMessages = [...prevMessages];
                newMessages.pop();
                return newMessages;
              });
              
            if (response.error_msg) {
                setMessages((prevMessages) => [...prevMessages, {"side": "bot", "message": response.error_msg}])
            }
            else{
                setMessages((prevMessages) => [...prevMessages, {"side": "bot", "message": response.answer, "sources": response.sources}])
                // update plan status 
                fetchPlanStatus()
            }
            // allow message sending again 
            setDisableMessageSending(false)
            });
      }

    const handleOnSendMessage = (message) => {
        // clear the messages  
        if (disableMessageSending) {
            toast.warning("Please wait for the previous question to be answered", {
                autoClose: 3000,
                position: toast.POSITION.TOP_CENTER
            });
            return 
        }
        setMessages((prevMessages) => [...prevMessages, {"side": "user", "message": message}])
        if (currentFileInfo.status == "processing"){
            setMessages((prevMessages) => [...prevMessages, {"side": "bot", "message": "file is still being processed, it should take a few minutes, please come back and refresh later", "type":"errorMsg"}])
            return 
        }
        const loadingItem = {"side": "bot", "message": (<>Panda is searching for answer<Loading/></>)}
        setMessages((prevMessages) => [...prevMessages, loadingItem])
        postSendQuestion(message)
      };

    function escapeRegExp(string) {
        // replacedString = string.replace(/\n/g, " ");
        let replacedString = string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
        // replace /n with space for matching
        // replacedString = replacedString.replace(/\n/g, " ");
        return replacedString
      }
      
    const editPDFSourceInfo=(source)=>{
        console.log("i am clicked", source)
        setCurrentFileInfo((prevSource)=>({...prevSource, sourceInfo: source}));
        if (source){
            // build regex 
            // const escapedString = RegExp.escape(inputString);
            var regexMatch = escapeRegExp(source.startText) + '(.*)' + escapeRegExp(source.endText)
            const re = new RegExp(regexMatch);
            setSourceHighlight(re)
        }
        setShowPdfRender(true)
        // if the pdf is currently not in context, show it 
        setPdfViewerKey(pdfViewerKey+1)
    }

    const renderChatSection=()=>{
        return (
            <Box>
            <ChatBox
                chatName={currentFileInfo.file}
                messages={messages}
                setMessages={setMessages}
                handleOnSendMessage={handleOnSendMessage}
                currentFileInfo={currentFileInfo}
                editPDFSourceInfo={editPDFSourceInfo}
                user={user}
                authToken={authToken}
            />
            </Box>
            )
    }


    const postFetchBillingSession=()=>{
        // toast.warning('We will release payment option soon, to get more bamboos, please join our Discord server', {
        //     position: "bottom-right",
        //     autoClose: 8000,
        //     hideProgressBar: false,
        //     closeOnClick: true,
        //     pauseOnHover: true,
        //     draggable: true,
        //     });

        // return 
        // postContent
        const requestOptions = {
            method: 'POST',
            // mode: 'no-cors',
            headers: buildHeader(authToken),
            body: JSON.stringify({ 
                sub: user.sub
            })
        };
        fetch(`${ENTROPY_BACKEND_ADDRESS}/api/user/view_billing_history`, requestOptions)
            .then(response => response.json())
            .then(response => {
                if (response.error_msg){
                    toast.error(response.error_msg, {
                        position: "bottom-right",
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        })
                }
                else{
                    console.log(response)
                    window.open(response.url, '_blank')    
                }
                // set the chat history to messages 
                // this.setState({analyticsDetail:response, visitHistory:response.visit_history})
            });
    }


    const loadChatHistory=(fileID)=>{
        const requestOptions = {
            method: 'POST',
            // mode: 'no-cors',
            headers: buildHeader(authToken),
            body: JSON.stringify({ 
                sub: user.sub,
                file_id: fileID
            })
        };
        fetch(`${ENTROPY_BACKEND_ADDRESS}/api/chat/history`, requestOptions)
            .then(response => response.json())
            .then(response => {
                setMessages(response)
            });
    }


    const fetchPlanStatus=(forceRefresh)=>{
        // postContent
        const urlParams = new URLSearchParams(window.location.search);
        var refreshPlan = urlParams.get('refresh_plan');
        const url = new URL(window.location.href);
        url.searchParams.delete('refresh_plan');
        window.history.replaceState(null, null, url);
        
        if (forceRefresh) {
            refreshPlan = true 
        }
    
        const requestOptions = {
            method: 'POST',
            // mode: 'no-cors',
            headers: buildHeader(authToken),
            body: JSON.stringify({ sub: user.sub, refresh: refreshPlan
            })
        };
        fetch(`${ENTROPY_BACKEND_ADDRESS}/api/user/plan_status`, requestOptions)
            .then(response => response.json())
            .then(response => {
              console.log(response)
                setPlanDetail({usage: response.usage, bambooCredit: response.bamboo_credit,
                   chatUsage: response.chat_usage, fileCount: response.file_count, currentSubscription: response.current_subscription})
                // this.setState({uploadedFiles:response['files']})
                // this.setState({analyticsDetail:response, visitHistory:response.visit_history})
            });
    }
    
    // helper function for setting the context
    const SetCurrentChat=(item, showPdf)=>{
        // setCurrentFileInfo({file:item.title, fileID:item.id, pdfURL: item.presigned_url, sourceInfo: null, status:item.status})
        setShowPdfRender(showPdf);
        // loadChatHistory(item.id);
        // Generate a UUID v4

    }
        
    useEffect(()=>{
        // set the first as default 
        if (uploadedFiles && uploadedFiles.length>0 ) {
            if (currentFileInfo.file==null) {
                SetCurrentChat(uploadedFiles[0], false)
            }
            // update current file info 
            else{
                console.debug("current file is ", currentFileInfo)
                // potentially update the current file info 
                const sameIdItem = uploadedFiles.find(item => item.id === currentFileInfo.fileID);
                if (sameIdItem && sameIdItem.status!=currentFileInfo.status){
                    console.log("update current file info")
                    // setCurrentFileInfo((prevSource)=>({...prevSource, status: sameIdItem.status}));
                    SetCurrentChat(sameIdItem, false)
                }
            }
        }
    }, [uploadedFiles])

    useEffect(()=>{
        if (currentFileInfo && currentFileInfo.sourceInfo) {
            if (currentFileInfo.sourceInfo!=null){
                setPdfStartPage(currentFileInfo.sourceInfo['page'])
            }
        }
    }, [currentFileInfo])

    const [message, setMessage] = React.useState('');
    const [notes, setNotes] = React.useState([]);
    

    return (
        <>
                <Navigation />
                <div className="main-content">
                    <SubscriptionPopup 
                        authToken={authToken} 
                        user={user} 
                        modalIsOpen={modalIsOpen}
                        setModalIsOpen={setModalIsOpen}
                        planDetail ={planDetail}
                    />
                    <ToastContainer/>
                    <Row>
                        <Col xl={2}>
                            {/* {renderSideBar()} */}
                            <VerticalSidebar 
                                authToken={authToken} 
                                user={user} 
                                currentPDF={uploadedPDF} 
                                isUploadingFile={isUploadingFile}
                                setIsHiddenParent={setIsHiddenParent}
                                planDetail={planDetail}
                                setModalIsOpen={setModalIsOpen}
                                />
                        </Col>
                        <Col xl={5}>
                            {renderChatSection()}
                        </Col>
                        <Col xl={5 }>
                            {/* {showPdfRender? renderPdfPage():renderFiles()} */}
                        </Col>
                    </Row>
                </div>
            </>
    )
    
}




export default ChatPage;
