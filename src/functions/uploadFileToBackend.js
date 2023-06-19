import { ENTROPY_BACKEND_ADDRESS, CLOUDFRONT_RESOURCE_PATH} from '../globals/address';
import axios from 'axios';

export const validateIsImage=(file)=>{
 var reg = /(.*?)\.(jpg|jpeg|png)$/;
 if(!file.match(reg))
 {
   return false;
 }
 return true;
}

export const getCloudfrontResource=(token, cloudfront_relative_path)=>{
    if (token===null){
        return null;
    }
    else{
        // console.log(CLOUDFRONT_RESOURCE_PATH+"/"+ cloudfront_relative_path + "?token=" + token)
        return CLOUDFRONT_RESOURCE_PATH+"/"+ cloudfront_relative_path + "?token=" + token;
    }
}

export const uploadImageToBackend=(selectedFile, restAddress, jsonInfo)=>{
  console.log("file upload....", jsonInfo);
  const data = new FormData();

  if (selectedFile === "" || selectedFile === null)
  {
      console.log("no file selected");
      // this.setState({uploadStatus:"no video name provided"})
  }
  else if (validateIsImage(selectedFile.name)===false) {
      console.log("not a valid file");
  }
  else {
      data.append('file', selectedFile);
      Object.entries(jsonInfo).forEach(([field, value]) => {
        data.append(field, value);
      });
      console.log(data);
      let headers =  {
          "Access-control-allow-orogin": "*",
          "Access-Control-Allow-Methods": 'HEAD, GET, POST, PUT, PATCH, DELETE',
          "Access-Control-Allow-Headers": 'Origin, Content-Type, X-Auth-Token'
      };
      axios.post(`${ENTROPY_BACKEND_ADDRESS}/${restAddress}`,
                    data,
                    {headers:headers})
        .then(res => { // then print response status
        console.log(res);
          console.log('upload success')
          // refresh the profile image
          // this.setState({uploadStatus:"success"})
          return "success"
        })
        .catch(err => { // then print response status
          console.log('upload fail')
          // this.setState({uploadStatus:"failed"})
          return "failed"
        })
}
};
