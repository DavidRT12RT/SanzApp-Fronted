import React from "react";

import { Button, DatePicker, Form, Modal, Select } from "antd";

//Component's
import { ProductoHeader } from "./components/ProductoHeader";
import { ProductoDescription } from "./components/ProductoDescription";
import { ProductoRegistros } from "./components/ProductoRegistros";
import { ProductoBasicInformation } from "./components/ProductoBasicInformation";
import { ProductoImage } from "./components/ProductoImage";
import { SanzSpinner } from "../../../../helpers/spinner/SanzSpinner";

//Estilos CSS
import "./components/assets/style.css";

//Custom hook for logic
import { useProducto } from "../../../../hooks/useProducto";

import locale from "moment/locale/es";

const { RangePicker } = DatePicker;

export const ProductoScreen = () => {
    //Custom hook for logic of component
    const {
        crearReporteGeneral,
        isModalVisible,
        setIsModalVisible,
        form,
        informacionProducto,
        isLoadingCategorias,
        isProductoEditing,
        setIsProductoEditing,
        onFinishEditingProduct,
        auth,
        filesList,
        setFilesList,
        formValues,
        handleInputChange,
        categorias,
    } = useProducto();

    const ModalContent = () => {
        return (
            <Modal
                visible={isModalVisible}
                footer={null}
                onCancel={() => {
                    setIsModalVisible(false);
                }}
                onOk={() => {
                    setIsModalVisible(false);
                }}
            >
                <h1 className="titulo" style={{ fontSize: "30px" }}>
                    Filtrar registros del reporte
                </h1>
                <p className="descripcion">
                    Marca en las siguientes casillas que informacion quieras que
                    contengan el reporte general del producto
                </p>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={crearReporteGeneral}
                >
                    <Form.Item
                        name="intervaloFecha"
                        label="Intervalo de fecha del reporte"
                        rules={[
                            {
                                required: true,
                                message: "Ingresa un intervalo de fecha!",
                            },
                        ]}
                    >
                        <RangePicker
                            locale={locale}
                            format="YYYY-MM-DD"
                            size="large"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Tipo de entrada"
                        name="tipoEntrada"
                        rules={[
                            {
                                required: true,
                                message: "Ingresa un tipo de entrada!",
                            },
                        ]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Tipo de entrada..."
                            size="large"
                        >
                            <Select.Option value="sobranteObra">
                                Sobrante de obra
                            </Select.Option>
                            <Select.Option value="devolucionResguardo">
                                Devolucion resguardo
                            </Select.Option>
                            <Select.Option value="normal">Normal</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Tipo de salida"
                        name="tipoSalida"
                        rules={[
                            {
                                required: true,
                                message: "Ingresa un tipo de salida!",
                            },
                        ]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Tipo de salida..."
                            size="large"
                        >
                            <Select.Option value="obra">Obra</Select.Option>
                            <Select.Option value="resguardo">
                                Resguardo
                            </Select.Option>
                            <Select.Option value="merma">Merma</Select.Option>
                        </Select>
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        Descargar PDF
                    </Button>
                </Form>
            </Modal>
        );
    };

    if (Object.keys(informacionProducto).length === 0 || isLoadingCategorias) {
        <SanzSpinner />;
    } else {
        return (
            <div className="container p-3 p-lg-5">
                {/* Header del producto */}
                <ProductoHeader
                    isProductoEditing={isProductoEditing}
                    setIsProductoEditing={setIsProductoEditing}
                    onFinishEditingProduct={onFinishEditingProduct}
                    auth={auth}
                />
                <div className="row">
                    {/* Imagen del producto*/}
                    <div className="col-lg-6 col-12 d-flex justify-content-center align-items-center">
                        <ProductoImage
                            informacionProducto={informacionProducto}
                            isProductoEditing={isProductoEditing}
                            filesList={filesList}
                            setFilesList={setFilesList}
                            setIsModalVisible={setIsModalVisible}
                        />
                    </div>

                    {/* Informacion basica del producto*/}
                    <div className="col-lg-6 col-12 d-flex flex-column">
                        <ProductoBasicInformation
                            formValues={formValues}
                            handleInputChange={handleInputChange}
                            isProductoEditing={isProductoEditing}
                            informacionProducto={informacionProducto}
                            auth={auth}
                            categorias={categorias}
                        />
                    </div>

                    {/* Registro del producto (Entradas,salidas,movimientos y codigo de barras) */}
                    <div className="col-lg-6 col-12 d-flex flex-column">
                        <ProductoRegistros
                            informacionProducto={informacionProducto}
                        />
                    </div>

                    {/* Descripcion del producto y sus aplicaciones*/}
                    <div className="col-lg-6 col-12 d-flex flex-column">
                        <ProductoDescription
                            formValues={formValues}
                            handleInputChange={handleInputChange}
                            isProductoEditing={isProductoEditing}
                            informacionProducto={informacionProducto}
                        />
                    </div>
                </div>

                <ModalContent />
            </div>
        );
    }
};
