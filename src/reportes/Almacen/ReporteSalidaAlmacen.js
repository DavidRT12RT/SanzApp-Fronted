import React from "react";
import logo from "../assets/logoCompleto.jpg"; //Logo de Sanz completo
import {
    Page,
    Document,
    Image,
    StyleSheet,
    Text,
    View,
    Font,
} from "@react-pdf/renderer";
import { Table } from "../Table";
import moment from "moment";
//Fuentes personalizadas
import LatoBold from "../assets/fuentes/Lato-Bold.ttf";
import LatoRegular from "../assets/fuentes/Lato-Regular.ttf";

export const ReporteSalidaAlmacen = ({ salida }) => {
    const fecha = moment().locale("es").format("YYYY-MM-DD");


    Font.register({
        family: "Lato",
        fonts: [
            {
                src: LatoBold,
                fontWeight: "bold",
            },
            {
                src: LatoRegular,
                fontWeight: "normal",
            },
        ],
    });

    const styles = StyleSheet.create({
        page: {
            fontSize: 11,
            lineHeight: 1.5,
            display: "flex",
            flexDirection: "column",
            padding: 20,
        },
        logo: {
            width: "150",
            height: "120",
        },
        label: {
            fontSize: 13,
            fontFamily: "Lato",
            fontWeight: "normal",
        },
        reportTitle: {
            letterSpacing: 4,
            fontSize: 20,
            textAlign: "center",
            textTransform: "uppercase",
            marginTop: 10,
            fontFamily: "Lato",
            fontWeight: "bold",
        },
        headerLogoAndFecha: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        fechaReporte: {
            marginTop: 20,
            fontSize: 14,
            paddingBottom: 3,
            fontFamily: "Lato",
            fontWeight: "bold",
        },
        descripcion: {
            fontSize: 12,
            textAlign: "center",
            fontFamily: "Lato",
            marginTop: "10px",
            fontWeight: "normal",
        },
        salidaCodigo: {
            fontSize: 12,
            textAlign: "center",
            fontFamily: "Lato",
            marginTop: "10px",
            fontWeight: "normal",
        },
        salidaInformacionContainer: {
            marginTop: 36,
        },
        informacionSalida: {
            paddingBottom: 3,
            fontSize: 16,
            fontFamily: "Lato",
            fontWeight: "bold",
        },
        subtitulo: {
            backgroundColor: "#FFFF00",
            fontSize: 13,
            fontFamily: "Lato",
            fontWeight: "normal",
            width: "80%",
        },
        salidaContainer: {
            textAlign: "center",
            marginTop: 30,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
        },
        entradaContainer: {
            textAlign: "center",
            marginTop: 30,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
        },
        fechaEntrada: {
            backgroundColor: "#FFFF00",
            fontSize: 13,
            fontFamily: "Lato",
            fontWeight: "normal",
            width: "80%",
        },
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.headerLogoAndFecha}>
                    <Image style={styles.logo} src={logo} />
                    <Text style={styles.fechaReporte}>
                        Fecha del reporte: {fecha}
                    </Text>
                </View>

                <Text style={styles.reportTitle}>Salida del almacen</Text>
                <Text style={styles.salidaCodigo}>{salida._id}</Text>
                <Text style={styles.descripcion}>{salida.motivo}</Text>

                <View style={styles.salidaInformacionContainer}>
                    <Text style={styles.informacionSalida}>
                        Informacion de la salida:
                    </Text>
                    <Text style={styles.label}>
                        Costo TOTAL de salida:{" "}
                        <Text style={{ ...styles.label, color: "green" }}>
                            ${salida.costoTotal}
                        </Text>
                    </Text>
                    <Text style={styles.label}>
                        Tipo de salida:{" "}
                        <Text style={{ ...styles.label, color: "red" }}>
                            {salida.tipo.toUpperCase()}
                        </Text>
                    </Text>
                    <Text style={styles.label}>
                        Fecha de registro: {salida.fechaCreacion}
                    </Text>
                    <Text style={styles.label}>
                        Ultima vez actualizada {salida.fechaUltimaActualizacion}
                    </Text>
                    <Text style={styles.label}>
                        Numero de productos retirados del almacen:{" "}
                        {salida.listaProductos.length}
                    </Text>
                    <Text style={styles.label}>
                        Numero de productos devueltos al almacen:{" "}
                        {salida.productosDevueltos.length}
                    </Text>
                </View>

                <View style={styles.salidaContainer}>
                    <Text style={{ ...styles.label, color: "red" }}>
                        Productos retirados del almacen
                    </Text>
                    <Table
                        th
                        col={[
                            "16.666%",
                            "16.666%",
                            "16.666%",
                            "16.666%",
                            "16.666%",
                            "16.666%",
                        ]}
                        children={[
                            [
                                "Nombre",
                                "Marca",
                                "Cantidad retirada",
                                "Unidad",
                                "Costo X unidad",
                                "Costo total del producto",
                            ],
                            ...salida.listaProductos.map((producto) => {
                                return [
                                    producto.id.nombre,
                                    producto.id.marca,
                                    producto.cantidadRetirada,
                                    producto.id.unidad,
                                    `$${producto.costoXunidad}`,
                                    `$${
                                        producto.cantidadRetirada *
                                        producto.costoXunidad
                                    }`,
                                ];
                            }),
                        ]}
                    />
                </View>

                {/*Por cada entrada agregaremos un container con la informacion de la entrada y la tabla con la lista de productos*/}

                {salida.productosDevueltos.map((entrada) => (
                    <View style={styles.entradaContainer} key={entrada.key}>
                        <Text style={{ ...styles.label, color: "red" }}>
                            Productos devueltos a almacen
                        </Text>
                        <Text
                            style={{ ...styles.fechaEntrada, marginRight: 10 }}
                        >
                            Fecha de la entrada: {entrada.fecha}
                        </Text>
                        <Text style={{ ...styles.label, marginRight: 10 }}>
                            Tipo de entrada:{" "}
                            <Text style={styles.labelBold}>
                                {entrada.tipo.toUpperCase()}
                            </Text>
                        </Text>
                        <Text style={styles.label}>
                            Cantidad de productos ingresados:{" "}
                            {entrada.listaProductos.length}
                        </Text>
                        <Table
                            th
                            col={["25%", "25%", "25%", "25%"]}
                            children={[
                                [
                                    "Nombre",
                                    "Marca",
                                    "Cantidad ingresada",
                                    "Unidad",
                                ],
                                ...entrada.listaProductos.map((producto) => {
                                    return [
                                        producto.id.nombre,
                                        producto.id.marca,
                                        producto.cantidadIngresada,
                                        producto.id.unidad,
                                    ];
                                }),
                            ]}
                        />
                    </View>
               ))}
           </Page>
        </Document>
    );
};
