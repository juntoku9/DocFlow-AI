import React, { useState, useRef, useEffect } from 'react';
import { Input, Button } from '@geist-ui/react';
import { Send } from '@geist-ui/icons';
import styled from "@emotion/styled";
import { ThumbsUp, ThumbsDown } from '@geist-ui/icons'
import { ENTROPY_BACKEND_ADDRESS } from '../globals/address';
import { getHeader, buildHeader } from '../functions/headers';
import { ToastContainer, toast } from 'react-toastify';

const ChatWrapper = styled.div`
  background-color: #fff;
  align-items: center;
  justify-content: center;
  width:100%;
`;

const ChatContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const ChatBoxContainer = styled.div`
  flex-grow: 1;
  background-color: #fff;
  border-radius: 10px;
  max-width: 700px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
`;

const ChatHeader = styled.div`
  background-color: #f5f5f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
`;

const ChatMessageContainer = styled.div`
  flex-grow: 1;
  height: 60vh;
  overflow-y: auto;
  padding: 20px;
`;

const ChatMessageWrapper = styled.div`
  display: flex;
  margin-bottom: 10px;
  flex-direction: ${({ sender }) => sender === 'user' ? 'row-reverse' : 'row'};
  justify-content: ${({ sender }) => sender === 'user' ? 'flex-end' : 'flex-start'};
`;

const ChatMessageAvatarContainer = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const ChatMessageAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  flex-shrink: 0;
`;

const ChatMessageAvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ChatMessageContentContainer = styled.div`
  width: fit-content;
  border-radius: 5px;
  padding: 10px;
  color: ${({ sender }) => sender === 'user' ? 'white' : 'black'};
  background-color: ${({ sender }) => sender === 'user' ? '#4285f4' : '#e6e6e6'};
  display: flex;
  justify-content: ${({ sender }) => sender === 'user' ? 'flex-end' : 'flex-start'};
  margin-bottom: 10px;
  margin-left: ${({ sender }) => sender === 'user' ? 'auto' : '0'};
`;

const ChatMessageVoteButton = styled.button`
  font-size: 14px;
  padding: 4px;
  border-radius: 4px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #555;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f5f5f5;
  }

  &:active {
    background-color: #ddd;
  }

  &:active,
  &.highlighted {
    background-color: #ddd;
  }
`;

const ChatMessageContentFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const ChatMessageContent = styled.p`
  margin: 0;
  word-break: break-word;
  max-width: 300px;
`;

const ChatBox = ({chatName, messages, setMessages, handleOnSendMessage, currentFileInfo, editPDFSourceInfo, user, authToken}) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const chatName = 'My Chat Room'; // change this to your chat name
  const chatRef = useRef(null);

//   const handleSendMessage = () => {
//     // handle sending message logic
//     setMessages([...messages, { content: message, sender: 'user' }]);
//     // setMessages([...messages, { content: message, sender: 'bot' }]);
//     setMessage('');
//   }
  const callSendMessage = () => {
    handleOnSendMessage(message)
    setMessage('')
  }

  useEffect(() => {
    // scroll to the bottom of the chat box when a new message is added
    chatRef.current.scrollTop = chatRef.current.scrollHeight;

    // render the welcome message
    if (currentFileInfo.file != null && currentFileInfo.status == "complete") {
        const msgElement=(
            <>
                <p>You are reading file <strong>{currentFileInfo.file}</strong>, to get started, some questions you can ask Panda to answer:</p>
                <Button variant="link" onClick={()=>{handleOnSendMessage("What is this document about?")}}>What is this document about?</Button>
                <Button variant="link" onClick={()=>{handleOnSendMessage("Make a bullet point summary of the file")}}>Make a bullet point summary of the file?</Button>
                <Button variant="link" onClick={()=>{handleOnSendMessage("Make a list of 10 keywords")}}>Make a list of 10 keywords</Button>
            </>
        )
    }
  }, [messages]);

    const ContentItems = ({ content, sources }) => {
        return (
            <div>
                <p style={{ margin: 0,  wordBreak: 'break-word' }}>{content}</p>
                {sources && (
                <div style={{ marginTop: '10px' }}>
                    {sources.map((source, index) => (
                    <span key={index} 
                        style={{ marginRight: '10px', fontSize: '12px', textDecoration: 'underline', cursor: 'pointer' }} 
                        onClick={() => editPDFSourceInfo(source)}>
                        {source.page}
                    </span>
                    ))}
                </div>
                )}
            </div>
        );
    };

    const handleVoteButtonClick = (event, chatHistoryID, voteString) => {
      event.preventDefault()
      const buttonRef = event.target
      postUserVote(chatHistoryID, voteString, buttonRef)
    }
  
  
    const postUserVote = (chatHistoryID, voteString, buttonRef) =>{
      console.log(chatHistoryID)
      const requestOptions = {
        method: 'POST',
        // mode: 'no-cors',
        headers: buildHeader(authToken),
        body: JSON.stringify({ 
            sub: user.sub, 
            chat_history_id: chatHistoryID,
            vote: voteString
        })
    };
    fetch(`${ENTROPY_BACKEND_ADDRESS}/api/chat/answer_vote`, requestOptions)
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
            }
            // set the chat history to messages 
            // this.setState({analyticsDetail:response, visitHistory:response.visit_history})
            setMessages((prevMessages) =>
            prevMessages.map((msg) => {
              if (msg.id === chatHistoryID) {
                return {
                  ...msg,
                  user_reaction: voteString,
                };
              }
              return msg;
            }),
          );       
        });
    }

    return (
        <ChatWrapper>
        <ChatContainer>
        <ChatBoxContainer>
        <ChatHeader>
        <h2 style={{ margin: 0 }}>{chatName}</h2>
        </ChatHeader>
        <ChatMessageContainer ref={chatRef}>
        {messages.map((msg, index) => (
            <ChatMessageWrapper key={index} sender={msg.side}>
        {msg.side !== 'user' && (
        <ChatMessageAvatarContainer>
        <ChatMessageAvatar>
            <ChatMessageAvatarImage src={"img/logos/panda.jpg"} alt={`${msg.side} Avatar`} />
        </ChatMessageAvatar>
        </ChatMessageAvatarContainer>
        )}
        <ChatMessageContentContainer sender={msg.side}>
            <ChatMessageContent>
                <ContentItems content={msg.message} sources={msg.sources} />
                {msg.side !== 'user' && (
                <ChatMessageContentFooter>
                    <ChatMessageVoteButton 
                      className={msg.user_reaction === 'like' ? 'highlighted' : ''}                    
                      onClick={(e)=>handleVoteButtonClick(e, msg.id, "like")}><ThumbsUp size={14}/></ChatMessageVoteButton>
                    <ChatMessageVoteButton 
                      className={msg.user_reaction === 'dislike' ? 'highlighted' : ''}                    
                      onClick={(e)=>handleVoteButtonClick(e, msg.id, "dislike")}><ThumbsDown size={14}/></ChatMessageVoteButton>
                </ChatMessageContentFooter>
                )}
            </ChatMessageContent>        
        </ChatMessageContentContainer>
        <p style={{ margin: '0', fontSize: '12px', color: '#888', textAlign: msg.side === 'user' ? 'right' : 'left' }}>{msg.time}</p>
        </ChatMessageWrapper>
        ))}
        </ChatMessageContainer>
        <div style={{ display: 'flex', alignItems: 'center', padding: '20px' }}>
            <Input
                placeholder="Type a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ flexGrow: 1, height: '80px', width: '580px', maxWidth: '5800px'}}
                onKeyDown={(e) => e.keyCode === 13 && callSendMessage()} // add this line
            />
            <Button shadow type="success" auto icon={<Send />} onClick={callSendMessage} style={{ marginLeft: '10px' }} />
        </div>
        </ChatBoxContainer>
        </ChatContainer>
        </ChatWrapper>
        )
}
        
export default ChatBox;
