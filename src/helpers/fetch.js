//fetch con token y sin token
const baseUrl = "https://backendsanzconstructora.herokuapp.com/api";
const fetchSinToken = (endpoint,data,method = "GET") =>{
    const url = `${baseUrl}/auth/${endpoint}`;

    switch (method) {
        case "GET":
            return fetch(url);
        case "POST":
            return fetch(url,{
                method,
                headers:{
                    'Content-type':'application/json'
                },
                body:JSON.stringify(data)
            });
        default:
            break;
    }
}


export {
    fetchSinToken
}