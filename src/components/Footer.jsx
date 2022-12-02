import React from 'react'

const Footer = () => {

    const estilosFooter = {
        position:"relative",
        bottom:"0px",

        minWidth:"100vw",

        textAlign:"center",
        backgroundColor:"#101010",
        padding:"20px",

        display:"flex",
        justifyContent:"space-around",
        alignItems:"center",
        flexDirection:"row",
        flexWrap:"wrap"
    };
    
    return (
        <div style={estilosFooter}>
            <p className="descripcion text-muted">@ 2022 Todos los derechos reservados <span style={{fontWeight:"bold",color:"white"}}>Sanz ingenieria integral</span></p>
            <p className="descripcion text-muted">información Compañia | Privacidad y politicas | Terminos y Condiciónes</p>
        </div>
    )
}


export default Footer;