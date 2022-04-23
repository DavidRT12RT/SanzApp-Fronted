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

const fetchConToken = (endpoint,data,method = "POST") =>{
    const url = `${baseUrl}${endpoint}`;

    switch (method) {
        case "GET":
            return fetch(url,{
                headers:{
                    'x-token':localStorage.getItem('token')
                }
            }) 
        case "POST":
            return fetch(url,{
                method,
                headers:{
                    'Content-type':'application/json',
                    'x-token':localStorage.getItem("token")
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