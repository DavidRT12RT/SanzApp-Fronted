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

export const ReporteEntradaAlmacen = ({ entrada }) => {
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
        entradaCodigo: {
            fontSize: 12,
            textAlign: "center",
            fontFamily: "Lato",
            marginTop: "10px",
            fontWeight: "normal",
        },
        entradaInformacionContainer: {
            marginTop: 36,
        },
        informacionEntrada: {
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
        entradaContainer: {
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

                <Text style={styles.reportTitle}>Entrada al almacen</Text>
                <Text style={styles.entradaCodigo}>{entrada._id}</Text>
                <Text style={styles.descripcion}>{entrada.motivo}</Text>

                <View style={styles.entradaInformacionContainer}>
                    <Text style={styles.informacionEntrada}>
                        Informacion de la entrada:
                    </Text>
                    <Text style={styles.label}>
                        Costo TOTAL de entrada:{" "}
                        <Text style={{ ...styles.label, color: "green" }}>
                            ${entrada.costoTotal}
                        </Text>
                    </Text>
                    <Text style={styles.label}>
                        Tipo de entrada:{" "}
                        <Text style={{ ...styles.label, color: "green" }}>
                            {entrada.tipo.toUpperCase()}
                        </Text>
                    </Text>
                    <Text style={styles.label}>
                        Fecha de registro: {entrada.fecha}
                    </Text>
                    <Text style={styles.label}>
                        Numero de productos ingresados al almacen:{" "}
                        {entrada.listaProductos.length}
                    </Text>
                </View>

                <View style={styles.entradaContainer}>
                    <Text style={{ ...styles.label, color: "green" }}>
                        Productos ingresados al almacen
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
                                "Cantidad",
                                "Unidad",
                                "Costo unidad",
                                "Costo total ",
                            ],
                            ...entrada.listaProductos.map((producto) => {
                                return [
                                    producto.id.nombre,
                                    producto.id.marca,
                                    producto.cantidadIngresada,
                                    producto.id.unidad,
                                    `$${producto.costoXunidad}`,
                                    `$${
                                        producto.cantidadIngresada *
                                        producto.costoXunidad
                                    }`,
                                ];
                            }),
                        ]}
                    />
                </View>

               <Text style={{...styles.label,textAlign:"center"}}>Para mas informacion(evidencia) consultar la aplicacion en internet...</Text>
           </Page>
        </Document>
    );
}