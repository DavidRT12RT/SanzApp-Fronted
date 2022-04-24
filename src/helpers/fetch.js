//fetch con token y sin token
const baseUrl = "https://backendsanzconstructora.herokuapp.com/api";
const fetchSinToken = (endpoint,data,method = "GET") =>{

    const url = `${baseUrl}${endpoint}`;

    switch (method) {
        case "GET":
            return fetch(url);
        case "POST":
            return fetch(url,{
                method,
                headers:{
                    'Content-type':'application/json',
                },
                body:JSON.stringify(data)
            });
        default:
            break;
    }
}

const fetchConToken = (endpoint,data,method = "GET") =>{
    const url = `${baseUrl}${endpoint}`;
    const token = localStorage.getItem('token') || "";

    switch (method) {
        case "GET":
            return fetch(url,{
                method,
                headers:{
                    'x-token':token
                }
            }) 
        case "POST":
            return fetch(url,{
                method,
                headers:{
                    'Content-type':'application/json',
                    'x-token':token
                },
                body:JSON.stringify(data)
            })
        default:
            break;
    }
}

export {
    fetchSinToken,
    fetchConToken
}