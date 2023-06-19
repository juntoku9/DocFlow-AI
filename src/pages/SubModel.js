import React, { useState } from 'react';
import { Text, Card, Button } from '@geist-ui/react';
import { Modal } from 'react-bootstrap';
import { ENTROPY_BACKEND_ADDRESS } from '../globals/address';
import { getHeader, buildHeader } from '../functions/headers';
import { ToastContainer, toast } from 'react-toastify';

const SubscriptionPopup = ({modalIsOpen, setModalIsOpen, authToken, user, planDetail}) => {
    const openModal = () => {
    console.log("going to show ")
      setModalIsOpen(true);
    };
  
    const closeModal = () => {
      setModalIsOpen(false);
    };

    const postCreateStripeSession=()=>{
      console.log(planDetail)
        const requestOptions = {
            method: 'POST',
            // mode: 'no-cors',
            headers: buildHeader(authToken),
            body: JSON.stringify({ 
                sub: user.sub,
                target: planDetail.currentSubscription == "premium"? "edit": "purchase"
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
      <div>
        <Modal show={modalIsOpen}>
          <Modal.Header>Subscription Choices</Modal.Header>
          <Modal.Body>
            <p>*note that we are swithing to a subscription based service, all paid customers in the previous period will get free months based on the amount. If you encounter any error please join Discord or email for support</p>
            <div className="subscription-cards">
              <Card className="subscription-card">
                <Text h4>Free Plan</Text>
                <Text>$0/month</Text>
                <li>10 files/month</li>
                <li>100 questions/month</li>
                <li>Basic features and support</li>
                {/* <Button type='success'>Choose Plan</Button> */}
              </Card>
              <Card className="subscription-card">
                <Text h4>Premium Plan</Text>
                <Text>$4.99/month</Text>
                <li>1000 files/month</li>
                <li>1500 questions/month</li>
                <li>Priority support on Discord</li>
                <Button type='success' onClick={postCreateStripeSession} className="mt-3">{planDetail.currentSubscription == "premium"? "Edit Plan": "Purchase Plan"}</Button>
              </Card>
            </div>
          </Modal.Body>
          <Modal.Footer>
          <Button type="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
        </Modal>
      </div>
    );
  };
  

export default SubscriptionPopup;