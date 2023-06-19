import { useState, useEffect } from 'react';
import { Button, Card, Text, Input, Select, Table,useTheme, Badge } from '@geist-ui/react';
import { ENTROPY_BACKEND_ADDRESS } from '../globals/address';
import { getHeader, buildHeader } from '../functions/headers';
import { ToastContainer, toast } from 'react-toastify';

const FieldsCard = ({authToken, user, currentFileInfo}) => {
  const [fields, setFields] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newField, setNewField] = useState({ key: '', type: '' });
  const [responseResult, setResponseResult] = useState([]);
  const theme = useTheme()

  const handleAddField = () => {
    setFields([...fields, newField]);
    console.log(fields)
    setNewField({ key: '', type: '' });
    setShowForm(false);
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
    

  const processDocument=()=>{
    console.log(user)

    console.log(currentFileInfo)
    const requestOptions = {
        method: 'POST',
        // mode: 'no-cors',
        headers: buildHeader(authToken),
        body: JSON.stringify({ 
            document_id: currentFileInfo.fileID,
            sub: user.sub, 
            fields: fields
        })
    };
    fetch(`${ENTROPY_BACKEND_ADDRESS}/api/chat/process_document`, requestOptions)
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
                // iterate through the response and add the fields to the table 
                setResponseResult(response.result);  // <-- set response result in the state

                // console.log(response)
                // window.open(response.url, '_blank')    
                // render the process result 
            }
        });
}


  return (
    <Card>
      <Text h3>Fields</Text>
      <Button type="secondary" onClick={() => setShowForm(!showForm)}>Add</Button>
      {showForm && (
        <div style={{"marginTop": "10px"}}>
          <Input
            name="key"
            value={newField.key}
            onChange={handleInputChange}
            placeholder="Enter the field you want to extract"
            width="100%"
          />
          <Select 
            name="String" 
            style={{"marginTop": "10px"}}
            value={newField.type} onChange={handleTypeChange} placeholder="String" width="100%">
            <Select.Option value="String">String</Select.Option>
            <Select.Option value="Number">Number</Select.Option>
          </Select>
          <Button style={{"marginTop": "10px"}} type="success" onClick={handleAddField}>Submit</Button>
        </div>
      )}

    <Table style={{"marginTop": "10px"}} data={fields}>
        <Table.Column prop="key" label="Key" render={(value, rowData, rowIndex)=>{return <Badge style={{ backgroundColor: theme.palette.successLight }}>{value}</Badge> }}/>
        <Table.Column prop="value" label="Value" />
        <Table.Column prop="type" label="Type" render={(value, rowData, rowIndex)=>{return <Badge style={{ backgroundColor: theme.palette.secondary }}>{value}</Badge> }}/>
    </Table>

    <Button style={{"marginTop": "10px"}} type="secondary" onClick={processDocument}>Process</Button>


    </Card>
  );
};

export default FieldsCard;
