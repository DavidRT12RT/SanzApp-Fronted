import React  from 'react'
import { Modal,Input,Divider,Button,Table } from 'antd';

//Helper's
import { SanzSpinner } from '../../../../helpers/spinner/SanzSpinner';

//Component's
import { InformacionEmpresa } from './components/EmpresaScreen/InformacionEmpresa';

//Custom hook for logic
import { useEmpresa } from '../../../../hooks/useEmpresa';
import { RegistrarSucursal } from './components/EmpresaScreen/RegistrarlSucursal';

export const EmpresaScreen = () => {
    const {
        columns,
        empresaInfo,
        sucursales,
        registrarSucursal
    } = useEmpresa();

    if(empresaInfo === null){
        return <SanzSpinner/>
    }else{
        return (
            <div className="container p-5">
                <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap">
                    <div>
                        <h1 className="titulo" style={{fontSize:"32px"}}>{empresaInfo.nombre}</h1>
                        <h1 className="descripcion col-6">{empresaInfo._id}</h1>
                    </div>
                    <img src={`${process.env.REACT_APP_BACKEND_URL}/api/uploads/empresas/empresa/${empresaInfo._id}`} style={{height:"50px"}}/>
                </div>
                <div className="row">
                    <div className="col-12 col-lg-6">
                        <Divider/>
                        <h1 className="titulo">Descripcion:</h1>
                        <p className="descripcion">{empresaInfo.descripcion}</p>
                    </div>
                    <div className="col-12 col-lg-6">
                        <Divider/>
                        <InformacionEmpresa empresaInfo={empresaInfo} />
                    </div>
                </div>
                <Divider/>
                <h1 className="titulo">Sucursales</h1>
                <div className="d-flex justify-content-start align-items-center gap-2 flex-wrap">
                    <Button type="primary">Filtrar sucursales</Button>
                    {rol === "INGE_ROLE" || rol === "ADMIN_ROLE" && <Button type="primary" danger onClick={()=>{setIsModalRegistrarSucursalVisible(true)}}>Registrar sucursal</Button>}
                </div>
               <Input.Search
                    placeholder="Buscar una sucursal en el sistema por su nombre"
                    allowClear
                    enterButton="Buscar" 
                    size="large"
                    className="mt-3"
                    onSearch={(e) => {
                        setParametrosBusqueda((parametrosAnteriores) => ({
                            ...parametrosAnteriores,
                            nombre:e
                        }));
                    }}
                />
                <Table bordered className="mt-3" columns={columns} dataSource={sucursales}/>

                <Modal visible={isModalRegistrarSucursalVisible} onOk={()=>{setIsModalRegistrarSucursalVisible(false)}} onCancel={()=>{setIsModalRegistrarSucursalVisible(false)}} footer={null}>
                   <RegistrarSucursal empresaInfo={empresaInfo} registrarSucursal={registrarSucursal}/>
                </Modal>
            </div>
        )
    }
}
