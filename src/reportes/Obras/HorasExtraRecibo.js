import React from 'react'
import logo from "../assets/logoCompleto.jpg";//Logo de Sanz completo
import moment from 'moment';
import { Page, Document, Image, StyleSheet, Text, View, Font } from '@react-pdf/renderer';


//Fuentes personalizadas
import LatoBold from "../assets/fuentes/Lato-Bold.ttf";
import LatoRegular from "../assets/fuentes/Lato-Regular.ttf";


export const HorasExtraRecibo = ({registro,tipo}) => {

    const fecha = moment().locale('es').format("YYYY-MM-DD");

    Font.register({
        family:"Lato",
        fonts:[
            {
                src:LatoBold,
                fontWeight:"bold"
            },
            {
                src:LatoRegular,
                fontWeight:"normal"
            }
        ]
    });

    const styles = StyleSheet.create({
        page: {
            fontSize: 11,
            lineHeight: 1.5,
            display:"flex",
            flexDirection: "column",
            padding:20
        }, 
        headerLogoAndFecha:{
            flexDirection:"row",
            justifyContent:"space-between",
            alignItems:"center"
        },
        fechaReporte:{
            marginTop: 20,
            fontSize:14,
            paddingBottom: 3,
            fontFamily:"Lato",
            fontWeight:"bold"
        },
        logo: {
            width:"150",
            height:"120"
        },
        reportTitle:{
            color: 'green',
            letterSpacing: 4,
            fontSize: 20,
            textAlign: 'center',
            textTransform: 'uppercase',
            marginTop:10,
            fontFamily: 'Lato',
            fontWeight:"bold"
        },
        descripcion:{
            fontSize:12,
            textAlign:"center",
            fontFamily:"Lato",
            fontWeight:"normal"
        },
        informacionReciboContainer: {
            marginTop: 36,
            textAlign:"center"
        },
        textoLegalContainer:{
            marginTop: 36,
            textAlign:"center"
        },
        informacionHorasExtraPagadas:{
            paddingBottom: 3,
            fontSize:16,
            fontFamily:"Lato",
            fontWeight:"bold",
            textAlign:"center"
        },
        label:{
            fontSize:13,
            fontFamily:"Lato",
            fontWeight:"normal"
        },
        tipoDePago:{
            backgroundColor:"#FFFF00",
            fontSize:13,
            fontFamily:"Lato",
            fontWeight:"normal",
            textAlign:"center"
        },
        labelBold:{
            fontSize:13,
            fontFamily:"Lato",
            fontWeight:"bold"
        },
    });
 

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.headerLogoAndFecha}>
                    <Image style={styles.logo} src={logo}/>
                    <Text style={styles.fechaReporte}>Fecha del recibo: {fecha}</Text>
                </View>

                <Text style={styles.reportTitle}>Recibo de horas extra</Text>
                <Text style={styles.descripcion}>recibo que el empleado firmara y constara que las horas extra ya han sido PAGADAS.</Text>

                <View style={styles.informacionReciboContainer}>
                    <Text style={styles.informacionHorasExtraPagadas}>Informacion de las horas extra pagadas:</Text>
                    <Text style={styles.labelBold}>Tipo de pago:</Text>
                    <Text style={styles.tipoDePago}>{tipo === "TODAS" ? "PAGO DE TODAS LAS HORAS EXTRA" : "PAGO DE UN SOLO REGISTRO DE HORA EXTRA"}</Text>
                    <Text style={styles.labelBold}>Horas extra totales pagadas:</Text>
                    <Text style={styles.label}>{tipo === "TODAS" ? registro.horasTotales : registro.horas}</Text>
                    {
                        tipo != "TODAS" && (
                            <>
                                <Text style={styles.labelBold}>Motivo:</Text>
                                <Text style={styles.label}>{registro.motivo}</Text>
                                <Text style={styles.labelBold}>Fecha:</Text>
                                <Text style={styles.label}>{registro.fecha}</Text>
                            </>
                       )
                    }
                </View>

                <View style={styles.textoLegalContainer}>
                    <Text style={styles.label}>Yo <Text style={styles.labelBold}>{registro.trabajador.nombre}</Text> hago constar que mis horas extra han sido pagadas.</Text>
                    <Text style={{...styles.label,marginTop:"10px"}}>___________________________________________________________________________</Text>
                </View>

            </Page>
        </Document>
    )
}
