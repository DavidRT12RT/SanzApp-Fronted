import { Result,Button } from "antd";
import { Link } from "react-router-dom";

export const Component404 = () => (

    <Result
        status="404"
        title="404"
        style={{background:"white",height:"100vh",width:"100vw"}}
        subTitle="La pagina que quieres visitar NO existe."
        extra={<Link to="/aplicacion"><Button type="primary">Volver a la aplicación</Button></Link>}

    />
);