import { useState, useEffect } from 'react';
import { Button, Card, Text, Input, Select, Table,useTheme, Badge, Spinner } from '@geist-ui/react';
import { ENTROPY_BACKEND_ADDRESS } from '../globals/address';
import { getHeader, buildHeader } from '../functions/headers';
import { ToastContainer, toast } from 'react-toastify';
import { Plus, Delete } from '@geist-ui/icons'

const FieldsCard = ({authToken, user, currentFileInfo}) => {
  const [fields, setFields] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessingAction, setIsProcessingAction] = useState(false);


  const [newField, setNewField] = useState({ key: '', type: 'String' });
  const [responseResult, setResponseResult] = useState([]);
  const [actionResult, setActionResult] = useState([]);
  const [customAction, setCustomAction] = useState('');
  const theme = useTheme()

  const handleAddField = () => {
    let trimmedKey = newField.key.trim();
    setFields([...fields, { ...newField, key: trimmedKey }]);
    setNewField({ key: '', type: 'String' });
    setShowForm(false);
};

  const handleDeleteRow = (index) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };
  
  const handleInputChange = (e) => {
    setNewField({
      ...newField,
      [e.target.name]: e.target.value,
    });
  };

  const handleTypeChange = (value) => {
    setNewField({
      ...newField,
      type: value,
    });
  };

  // Add this useEffect hook
  useEffect(() => {
    if(Object.keys(responseResult).length > 0) {  // If response result is not empty
      const updatedFields = fields.map(field => {
        const matchingResult = responseResult[field.key];
        if(matchingResult) {
          return {
            ...field,
            value: matchingResult,  // If there's a match, set the value of the field
          };
        }
        return field;  // If no match found, return the field as is
      });
  
      setFields(updatedFields);  // Update the fields with the new values
    }
  }, [responseResult]);  // Run this hook whenever responseResult changes
    
  

  const processDocument=(action)=>{
    console.log(user)

    console.log(currentFileInfo)
    if (action=="extract_information"){
      setIsProcessing(true);
    }
    else{
      setIsProcessingAction(true);
    }
    
    const requestOptions = {
        method: 'POST',
        // mode: 'no-cors',
        headers: buildHeader(authToken),
        body: JSON.stringify({ 
            document_id: currentFileInfo.fileID,
            sub: user.sub, 
            fields: fields, 
            action: action
        })
    };
    fetch(`${ENTROPY_BACKEND_ADDRESS}/api/chat/process_document`, requestOptions)
        .then(response => response.json())
        .then(response => {
            setIsProcessing(false);
            setIsProcessingAction(false);
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
                // iterate through the response and add the fields to the table 
                if (response.action == "extract_information"){
                  setResponseResult(response.result);  // <-- set response result in the state
                }
                else{
                  setActionResult(response.result);  // <-- set response result in the state
                }

                // console.log(response)
                // window.open(response.url, '_blank')    
                // render the process result 
            }
        });
}


  return (
    <>
    <Card >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text h3>Fields</Text>
        <div>
          <Button icon={<Delete />} auto type="secondary" ghost style={{ marginRight: '10px' }} onClick={() => setFields([])}>Clear</Button>
          <Button icon={<Plus/>} auto type="success" ghost onClick={() => setShowForm(!showForm)}>Add</Button>
        </div>
      </div>
    <Text style={{"marginTop": "10px"}} h4>Selected file: {currentFileInfo.file}</Text>

      {showForm && (
        <div style={{"marginTop": "10px"}}>
          <Input
            name="key"
            value={newField.key}
            onChange={handleInputChange}
            placeholder="Enter the field you want to extract"
            width="100%"
            style={{fontSize: '18px'}} //adjust this value to make the font bigger or smaller
          />
          <Select 
            name="String" 
            style={{"marginTop": "10px", fontSize: '18px'}}
            value={newField.type} 
            onChange={handleTypeChange} 
            placeholder="String" width="100%">
            <Select.Option value="String" style={{fontSize: '18px'}}>String</Select.Option>
            <Select.Option value="Number" style={{fontSize: '18px'}}>Number</Select.Option>
          </Select>
          <div style={{"marginTop": "10px", display: 'flex', justifyContent: 'flex-end'}}>
            <Button type="success" onClick={handleAddField}>Add</Button>
          </div>
        </div>
      )}

    <Table style={{"marginTop": "10px"}} data={fields}>
        <Table.Column prop="key" label="Key" render={(value, rowData, rowIndex)=>{return <Badge style={{ backgroundColor: theme.palette.successLight }}>{value}</Badge> }}/>
        <Table.Column prop="value" label="Value" />
        <Table.Column prop="type" label="Type" render={(value, rowData, rowIndex)=>{return <Badge style={{ backgroundColor: theme.palette.secondary }}>{value}</Badge> }}/>
        <Table.Column label="Action" render={(value, rowData, rowIndex) => (
        <Button 
          size="small" 
          type="error" 
          ghost
          auto
          onClick={() => handleDeleteRow(rowIndex)}
        >
          Delete
        </Button>
      )}
    />
    </Table>
    <div style={{"marginTop": "10px", display: 'flex', justifyContent: 'flex-end'}}>
      <Button type="secondary" ghost onClick={()=>processDocument("extract_information")}>Process</Button>
    </div>
    {isProcessing? <Spinner style={{"marginLeft":"10px"}}/> : null}
    </Card>
      
    <Card style={{marginTop:"10px"}}>
      <Text h3>Actions</Text>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Button auto type="secondary" ghost style={{ marginRight: '10px' }} onClick={()=>processDocument("summary")}>Make a summary of the invoice</Button>
            <Button auto type="secondary" ghost onClick={()=>processDocument("tables")}>List All Tables(JSON)</Button>
          </div>
        </div>
      {/* <Text style={{"marginTop": "10px"}} h4>Selected file: {currentFileInfo.file}</Text> */}
      <div style={{marginTop:"10px"}}>
        <Input label="Chat"  value={customAction} onChange={(e)=>{setCustomAction(e.target.value)}} placeholder="Customized actions" width="100%" />
      </div>
        <div style={{"marginTop": "10px", display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <Button type="secondary" ghost onClick={()=>processDocument(customAction)}>Process</Button>
        </div>

      <div 
            style={{ 
              marginTop: '20px', 
              backgroundColor: '#f6f6f6', 
              color: 'black', 
              borderRadius: '5px',
              padding: '10px',
              lineHeight: '1.5', // optional line height for better readability
              whiteSpace: 'pre-wrap', // respect newline characters in text
              overflowWrap: 'break-word', // break words if needed to prevent overflow
            }}
          >
            {actionResult}
          </div>
      {isProcessingAction? <Spinner style={{"marginLeft":"10px", marginTop:"10px"}}/> : null}
      </Card>
      </>
  
  );
};

export default FieldsCard;
