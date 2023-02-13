import React  from 'react'
import { Modal,Input,Divider,Button,Table, Upload } from 'antd';

//Icon's
import { UploadOutlined } from '@ant-design/icons';

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
        values,
        rol,
        props,
        handleInputChange,
        registrarSucursal,
        setIsModalRegistrarSucursalVisible,
        setParametrosBusqueda,
        setEditInfo,
        onFinishEditingEmpresa
    } = useEmpresa();

    if(values.empresaInfo === null) return <SanzSpinner/>
    else return (
        <div className="container p-5" style={{minHeight:"100vh"}}>
            <div className="d-flex justify-content-end">
                {
                    values.isEditing 
                        ? 
                            <div className="mb-3">
                                <Button type="primary" danger onClick={onFinishEditingEmpresa}>Guardar cambios</Button>
                                <Button className="ms-2" type="primary" onClick={() => setEditInfo(false)}>Salir sin guardar</Button>
                            </div> 
                        : <Button type="primary" className="mb-3" danger onClick={() => setEditInfo(true)}>Editar informacion</Button>
                } 
            </div>
            <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap">
                <div>
                    {
                        values.isEditing
                            ?   <input 
                                    className="form-control titulo"
                                    name="nombre"
                                    value={values.formValues.nombre}
                                    onChange={handleInputChange}
                                />
                            : <h1 className="titulo" style={{fontSize:"32px"}}>{values.empresaInfo.nombre}</h1>
                    }
                    <h1 className="descripcion col-6">{values.empresaInfo._id}</h1>
                </div>
                {
                    values.isEditing 
                        ?
                            <Upload {...props} listType="picture">
                                <Button icon={<UploadOutlined />}>Click para subir nuevo logo</Button>
                            </Upload>
                        : <img src={`${process.env.REACT_APP_BACKEND_URL}/api/empresas/logo/${values.empresaInfo._id}`} style={{height:"100px",width:"150px",objectFit:"cover"}}/>
                }
            </div>
            <div className="row">
                <div className="col-12 col-lg-6">
                    <Divider/>
                    <h1 className="titulo">Descripcion:</h1>
                    {
                        values.isEditing 
                            ?   <textarea 
                                    className="form-control descripcion"
                                    name="descripcion"
                                    value={values.formValues.descripcion}
                                    onChange={handleInputChange}
                                    rows={5}
                                />
                            :   <p className="descripcion">{values.empresaInfo.descripcion}</p>
                    }
                </div>
                <div className="col-12 col-lg-6">
                    <Divider/>
                    <InformacionEmpresa empresaInfo={values.empresaInfo} />
                </div>
            </div>
            <Divider/>
            <h1 className="titulo">Sucursales</h1>
            <div className="d-flex justify-content-start align-items-center gap-2 flex-wrap">
                {/* <Button type="primary">Filtrar sucursales</Button> */}
                {rol === "INGE_ROLE" || rol === "ADMIN_ROLE" && <Button type="primary" danger onClick={()=>{setIsModalRegistrarSucursalVisible(true)}}>Registrar sucursal</Button>}
            </div>
            <Input.Search
                placeholder="Buscar una sucursal en el sistema por su nombre"
                allowClear
                enterButton="Buscar" 
                size="large"
                className="mt-3"
                onSearch={(e) => {
                    setParametrosBusqueda("nombre",e)
                }}
            />
            <Table bordered className="mt-3" columns={columns} dataSource={values.sucursales}/>

            <Modal visible={values.isModalRegistrarSucursalVisible} onOk={()=>{setIsModalRegistrarSucursalVisible(false)}} onCancel={()=>{setIsModalRegistrarSucursalVisible(false)}} footer={null}>
                <RegistrarSucursal empresaInfo={values.empresaInfo} registrarSucursal={registrarSucursal}/>
            </Modal>
        </div>
    )
}
