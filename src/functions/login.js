import { ENTROPY_BACKEND_ADDRESS } from '../globals/address';

export const postCreateUser = async (emailAddress, walletAddress, accessToken) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            "Access-control-allow-orogin": "*",
            "Access-Control-Allow-Methods": 'HEAD, GET, POST, PUT, PATCH, DELETE',
            "Access-Control-Allow-Headers": 'Origin, Content-Type, X-Auth-Token',
            "authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            email_address: emailAddress, 
            sub: walletAddress
        })
    };
    const response = await fetch(`${ENTROPY_BACKEND_ADDRESS}/api/user/create_user_clerk`, requestOptions);
    return await response.json();
}

