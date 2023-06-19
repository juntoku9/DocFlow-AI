import React, { useState, useEffect, useRef, forwardRef } from "react";
import { Card, Spacer, Button, Text, Divider, Spinner, Badge } from '@geist-ui/react';
import { Dropzone } from '../components1/vendor/Dropzone';
import { ENTROPY_BACKEND_ADDRESS } from '../globals/address';
import { getHeader, buildHeader } from '../functions/headers';
import { ToastContainer, toast } from 'react-toastify';

import { ArrowLeft, ArrowRight } from '@geist-ui/icons';

const VerticalSidebar = ({authToken, user, handleFileSelect, currentPDF, isUploadingFile, setIsHiddenParent, planDetail, setModalIsOpen}) => {
  const [isHidden, setIsHidden] = useState(false);

  const onDrop = (acceptedFiles) => {
    console.log(acceptedFiles);
  };

  const toggleSidebar = () => {
    setIsHidden(!isHidden);
    setIsHiddenParent(!isHidden);
  };

  const postCreateStripeSession=()=>{
    setModalIsOpen(true)
    
    return 
    const requestOptions = {
        method: 'POST',
        // mode: 'no-cors',
        headers: buildHeader(authToken),
        body: JSON.stringify({ 
            sub: user.sub
        })
    };
    fetch(`${ENTROPY_BACKEND_ADDRESS}/api/user/create-customer-portal-session`, requestOptions)
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

  return (
    <>
      <div
        style={{
          display: isHidden ? 'none' : 'block',
          width: '100%',
          height: '75vh',
          top: 0,
          left: 0,
          zIndex: 100,
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Card shadow style={{ padding: '1rem', height: '100%'}}>
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '1rem',
                overflowY: "auto"
            }}
            >
        <Text h4>Tools</Text>
        </div>
        <Divider/>
        <Spacer y={1} />
          <Text h4>📘 1.Upload a file</Text>
            <Text>{currentPDF? currentPDF.name:""}</Text>
            <Dropzone onDrop={(event)=>handleFileSelect(event)}>
            {({ getRootProps, getInputProps }) => (
                <section>
                <div {...getRootProps()} style={{border: '2px dashed #e0e0e0', borderRadius: '8px', padding: '1rem', textAlign: 'center'}}>
                    <input {...getInputProps()} />
                    <p>Drag and drop files here, or click to select files</p>
                </div>
                </section>
            )}
            </Dropzone>
            {
                isUploadingFile==false? <></>:
                <Spinner className = "mt-3" animation="border" variant="dark" />
            }
            <Divider/>
            <Spacer y={1} />
            <Text h4>📝 2. Define the fields to extract</Text>
            <Text>
                    <li>Billed to, Due date</li>
                    <li>Add customized rules</li>
            </Text>
            <Spacer y={1} />
            <Divider/>
            <Text h4>📈 Subscription</Text>
                <li> current plan : <Badge type="secondary">{planDetail.currentSubscription}</Badge>
                </li>
                <li> chat usage : {planDetail.chatUsage}
                </li>
                <li> File Usage : {planDetail.fileCount}
                </li>
                {/* <li> Bamboo Credit : {planDetail.bambooCredit}
                </li> */}
            <Button auto type="secondary" onClick={postCreateStripeSession}>
                Plan details
            </Button>
        </Card>
      </div>
      {isHidden && (
        <div
          style={{
            position: 'fixed',
            height: '100vh',
            top: 0,
            left: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '1rem',
          }}
        >
            
          <Button auto onClick={toggleSidebar} type="secondary" >
            <ArrowRight size={18}/>
          </Button>
        </div>
      )}
    </>
  );
};
  

  export default VerticalSidebar;