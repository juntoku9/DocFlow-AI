
export function addCloudfrontTokenToUrl (base_url, token, default_url) {
    // access to user image, etc, resource data is consistent
    if (token){
        let user_image_url = `${base_url}?token=${token}`
        return user_image_url;
    }
    else {
        return default_url;
    }
}

// export default {getUserProfileUrl}
