import React, { useState } from 'react';
import { Upload, Modal, Button } from 'antd';
import ImgCrop from 'antd-img-crop';
import "../../assets/styleImagenesObra.css";

const ImagenesObra = (props) => {
    const {fileList,onRemove} = props;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [Image, setImage] = useState({});


    const handlePreview = async (file) =>{
        setImage({
            name:file.name,
            url:file.url
        });
        setIsModalVisible(true);
    }

    const handleCancel = () => {
        setIsModalVisible(false);
        setImage({});
    };



    return (
        <>
            <ImgCrop rotate>
                <Upload
                    listType='picture-card'
                    fileList={fileList}
                    onPreview={handlePreview}
                    onRemove={onRemove}
                    className="imagenes-obra"
                >
                </Upload>
            </ImgCrop>
            <Modal visible={isModalVisible} title={Image.name} footer={null} onCancel={handleCancel}>
                <img alt={Image.name} style={{ width: '100%' }} src={Image.url} />
                <Button danger type="primary" className="mt-3" onClick={()=>{
                    const values = {name:Image.name};
                    onRemove(values)
                    handleCancel();
                }}>Eliminar</Button>
            </Modal>
      </>
    );
};

export default ImagenesObra;