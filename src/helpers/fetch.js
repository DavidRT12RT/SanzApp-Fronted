

//fetch con token y sin token
//const baseUrl = "https://backendsanzconstructora.herokuapp.com/api";
const baseUrl = "http://localhost:4000/api";
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

const fetchConToken = (endpoint,data={},method = "GET") =>{
    const url = `${baseUrl}${endpoint}`;
    const token = localStorage.getItem('token') || "";

    switch (method) {
        case "GET":
            return fetch(url,{
                method,
                headers:{
                    'x-token':token
                },

            }) 
        case "POST":
            return fetch(url,{
                method,
                headers:{
                    'Content-type':'application/json',
                    'x-token':token
                },
                body:JSON.stringify(data)
            });
        
        case "PUT":
            return fetch(url,{
                method,
                headers:{
                    'Content-type':'application/json',
                    'x-token':token
                },
                body:JSON.stringify(data)
            });
        
        case "DELETE":
            return fetch(url,{
                method,
                headers:{
                    'Content-type':'application/json',
                    'x-token':token
                },
                body:JSON.stringify(data)
            });

        default:
            break;
    }
}

const fetchConTokenSinJSON = (endpoint,data,method = "POST") =>{
    const url = `${baseUrl}${endpoint}`;
    const token = localStorage.getItem('token') || "";


    switch (method) {
        case "POST":
        case "PUT":
            return fetch(url,{
                method,
                headers:{
                    'x-token':token
                },
                body:data
            });
        
        default:
            break;
    }
}
const fetchEmpleados = async(endpoint="/usuarios",method = "GET") =>{
    const url = `${baseUrl}${endpoint}`;
    const token = localStorage.getItem('token') || "";
    return fetch(url,{method,headers:{'x-token':token}});

}

export {
    fetchSinToken,
    fetchConToken,
    fetchEmpleados,
    fetchConTokenSinJSON
}