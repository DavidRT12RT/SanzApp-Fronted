export const InformacionEmpresa = ({
    empresaInfo
}) => {
    return (
        <>
            <h1 className="titulo">Informacion empresa:</h1>
            <div className="row">
                <h1 className="titulo-descripcion col-6">Fecha registro:</h1>
                <h1 className="descripcion col-6 text-success">{empresaInfo.fechaRegistro}</h1>
                <h1 className="titulo-descripcion col-6">Numero de sucursales registradas:</h1>
                <h1 className="descripcion col-6">{empresaInfo.sucursales.length}</h1>
                <h1 className="titulo-descripcion col-6">Numero de obras registradas:</h1>
                <h1 className="descripcion col-6">{empresaInfo.obras.length}</h1>
            </div>
        </>
    );
}