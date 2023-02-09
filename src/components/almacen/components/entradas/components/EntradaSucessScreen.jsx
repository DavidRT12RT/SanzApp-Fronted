import { Button, Result } from "antd";
import { Link } from "react-router-dom";

export const EntradaSucessScreen = ({
    entrada,
    ingresarOtraVezAlmacen
}) => {

    console.log(entrada);
    return (
        <div className="SalidasSucessScreeen">
            <Result
                status="success"
                title="Retiro del almacen realizado con exito!"
                subTitle={`Entrada con el id ${entrada._id} registrada en el sistema, puedes descargar el documento PDF o ver detalles de este en el siguiente enlace.`}
                extra={[
                    <Link to={`/almacen/entradas/${entrada._id}`}>
                        <Button type="primary" key="console">
                            Ir a la pagina de entrada
                        </Button>
                    </Link>,
                    <Button key="buy" onClick={ingresarOtraVezAlmacen}>
                        Registrar otra entrada 
                    </Button>,
                ]}
            />
        </div>
    );
}