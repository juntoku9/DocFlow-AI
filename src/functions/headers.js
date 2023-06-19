export const getHeader = (component) => {
    return {
        "Access-control-allow-orogin": "*",
        "Access-Control-Allow-Methods": 'HEAD, GET, POST, PUT, PATCH, DELETE',
        "Access-Control-Allow-Headers": 'Origin, Content-Type, X-Auth-Token',
        "Authorization": component.state.authHeader
    };
}

export const buildHeader = (authToken) => {
    return {
        "Access-control-allow-orogin": "*",
        "Access-Control-Allow-Methods": 'HEAD, GET, POST, PUT, PATCH, DELETE',
        "Access-Control-Allow-Headers": 'Origin, Content-Type, X-Auth-Token',
        "Authorization": `Bearer ${authToken}`
    };
}
