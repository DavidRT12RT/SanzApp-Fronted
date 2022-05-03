import { List, Typography, Divider } from "antd";

const data = [
    "Racing car sprays burning fuel into crowd.",
    "Japanese princess to wed commoner.",
    "Australian walks 100km after outback crash.",
    "Man charged over missing wedding girl.",
    "Los Angeles battles huge wildfires."
  ];

export const Registros = () => {
    return (
        <>
        <Divider orientation="left">Movimientos | Registros</Divider>
        <List
            header={<div>Información sobre las entradas y salidas de los productos en el almacen</div>}
            bordered
            dataSource={data}
            renderItem={(item) => (
            <List.Item className>
                <Typography.Text type="success">[ENTRADA]</Typography.Text> {item}
            </List.Item>
            )}
        />
        </>
  );
};
