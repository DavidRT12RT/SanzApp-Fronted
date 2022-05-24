import { Button, Divider, Dropdown, Menu, message, Space } from 'antd';
import Search from 'antd/lib/transfer/search';
import React,{ useState } from 'react'
import "../../assets/facturasLista.css";
import { DownOutlined, UserOutlined,UploadOutlined } from '@ant-design/icons';
import { Table, Tag, Modal,Upload } from 'antd';
import { fetchConTokenSinJSON } from '../../../../helpers/fetch';
import { resolveOnChange } from 'antd/lib/input/Input';


export const FacturasLista = ({socket,obraInfo}) => {
    
    const {_id:obraId} = obraInfo;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [filesList, setFilesList] = useState([]);
    const [uploading, setUploading] = useState(false);


    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    
    const onSearch = (values) =>{
        console.log(values);
    }

    const handleMenuClick = (value) =>{
        console.log(value);
    }

    const handleUpload = async () =>{
        const formData = new FormData();

        filesList.forEach(file => {
            if(file.type == "application/pdf"){
                formData.append("archivoPDF",file);
                //formData.archivoPDF = file;
            }else if(file.type == "text/xml"){
                formData.append("archivoXML",file);
                //formData.archivoXML = file;
            }
        });

        //Verificación que esten los 2 archivos 
        if(filesList.length < 2){
            return message.error("Se necesita 2 archivos, el archivo PDF y XML para generar una nueva factura!");
        }
        //Verificación que los dos archivos no sean iguales
        if(filesList[0].type == filesList[1].type){
            return message.error("Los dos archivos son de la misma extensión se necesitan los PDF y XML");
        }
        setUploading(true);
        //Making the http post 
        let body;
        try {
            const resp = await fetchConTokenSinJSON(`/uploads/obras/obra/${obraId}/facturas`,formData,"POST");
            body = await resp.json();
            if(resp.status === 200){
                message.success("Subida con exito!");
            }else{
                message.error(body.msg);
            }
            handleCancel();
            //Quitando los archivos del filesList
            setFilesList([]);
            //Quitando los archivos del upload list del upload
            
        } catch (error) {
            message.error(body);
        }
        setUploading(false);
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            render: tags => (
            <>
                {tags.map(tag => {
                let color = tag.length > 5 ? 'geekblue' : 'green';
                if (tag === 'loser') {
                    color = 'volcano';
                }
                return (
                    <Tag color={color} key={tag}>
                    {tag.toUpperCase()}
                    </Tag>
                );
                })}
            </>
            ),
        }
        ];

        const data = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            tags: ['nice', 'developer'],
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            tags: ['loser'],
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
            tags: ['cool', 'teacher'],
        },
        ];

    const menu = (
        <Menu
            onClick={handleMenuClick}
            items={[
                {
                    label: '1st menu item',
                    key: '1',
                    icon: <UserOutlined />,
                },
                {
                    label: '2nd menu item',
                    key: '2',
                    icon: <UserOutlined />,
                },
                {
                    label: '3rd menu item',
                    key: '3',
                    icon: <UserOutlined />,
                },
            ]}
        />
    );

    const props = {
        multiple:true,
        onRemove : file => {
            setFilesList(files => {
                const index = files.indexOf(file);
                const newFileList = files.slice();
                newFileList.splice(index,1);
                setFilesList(newFileList);
            });
            /*Podemos tener mas logica de lo comun es nuestro useState tal que asi, 
             con un callback y al final llamar a la misma función*/
        },
        beforeUpload: file => {
            //Checar si el archivo es PDF O XML
            const isPDForXML = file.type === "application/pdf" || file.type === "text/xml";
            if(isPDForXML){
                //Verificar que el fileList sea menos a 2 
                if(filesList.length < 2){
                    setFilesList(files => [...files,file]);
                }else{
                    message.error("Solo puedes subir 2 archivos en total");
                }
            }else{
                message.error("Los archivos tienen que ser PDF o XML!");

            }
            //Deestructuramos el estado actual y añadimos el nuevo archivo
            return false;
        },
        listType:"picture",
        maxCount:2,
        fileList : filesList
    };


    return (
        <>
            <div>

                <h1>Facturas de la obra</h1>
                <p className="lead">En esta sección se encontraran todas las facturas de la obra junto a su
                    respectivo documento PDF y XML.
                </p>

                <Divider/>
                <div className="row">

                    <div className="col-6">
                        <Search
                            placeholder="Buscar un producto en almacen..."
                            allowClear
                            enterButton="Buscar"
                            size="large"
                            onSearch={onSearch}
                        />
                    </div>


                    <div className="col-6 filtro">
                        <Dropdown overlay={menu}>
                            <Button>
                                <Space>
                                    Filtro 
                                    <DownOutlined />
                                </Space>
                            </Button>
                        </Dropdown>
                    </div>



                </div>

                {/*Tarjetas*/}

                <div className="mt-3 row">
                    {/*Costo total*/}
                    <div className="box1 col-sm-12 col-lg-6">
                        <p className="numeros">Total de facturas</p>
                        <h1>$2323,32323.00</h1>
                        <p className='text-secondary'>Lo siguiente es un total de dinero sacado de las facturas introducidas</p>
                    </div>

                    <div className="box1 col-sm-12 col-lg-6">
                        <p className="numeros">Facturas totales</p>
                        <h1>323</h1>
                        <p className="text-secondary">Numero de facturas introducidas en el sistema actualmente</p>
                    </div>
                </div>
                

                {/*Tabla con facturas*/}
                <Button type="primary" className="my-3" onClick={showModal}>Agregar nueva factura!</Button>
                <Table columns={columns} dataSource={data}/>
                <Modal title="Agregar factura" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}>
                        <h1>Subir nueva factura al sistema</h1>
                        <p className="lead">Para poder realizar esta operación nesecitaras el documento XML y PDF.</p>
                        <Upload {...props} className="upload-list-inline" >
                            <Button icon={<UploadOutlined/>}>Selecciona el archivo</Button>
                        </Upload>
                   <Button 
                        type="primary" 
                        onClick={handleUpload}
                        disabled={filesList.length === 0}
                        loading={uploading}
                    >
                        {uploading ? "Subiendo..." : "Comienza a subir!"}     
                    </Button>
               </Modal>
            </div>
        </>
  )
}
