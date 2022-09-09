import React from 'react'
import logo from "../assets/logoCompleto.jpg";//Logo de Sanz completo
import moment from 'moment';
import { Page, Document, Image, StyleSheet, Text, View, Font } from '@react-pdf/renderer';
import { Table } from '../Table';

//Fuentes personalizadas
import LatoBold from "../assets/fuentes/Lato-Bold.ttf";
import LatoRegular from "../assets/fuentes/Lato-Regular.ttf";

export const IncidenciaEvidencia = ({usuario,obraInfo,fechaIncidente,motivo}) => {
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
        label:{
            fontSize:13,
            fontFamily:"Lato",
            fontWeight:"normal",
        },
        labelBold:{
            fontSize:13,
            fontFamily:"Lato",
            fontWeight:"bold"
        },
        containerDeclaracion:{
            textAlign:"center",
            marginTop:"15px"
        },
        containerFirmas:{
            textAlign:"center",
            marginTop:"30px",
            display:"flex",
            flexDirection:"row",
            flexWrap:"wrap",
            justifyContent:"space-around",
        }
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                <View style={styles.headerLogoAndFecha}>
                    <Image style={styles.logo} src={logo}/>
                    <Text style={styles.fechaReporte}>Fecha del reporte: {fecha}</Text>
                </View>

                <Text style={styles.reportTitle}>Reporte de incidencia de obra</Text>

                <View style={styles.containerDeclaracion}>
                    <Text style={styles.label}>YO <Text style={styles.labelBold}>{usuario.nombre}</Text> testifico lo sucedido en la obra <Text style={{...styles.labelBold,backgroundColor:"#FFFF00",}}>{obraInfo.titulo}</Text> el dia <Text style={{...styles.labelBold,backgroundColor:"#FFFF00",}}>{fechaIncidente}</Text> por el siguiente motivo:</Text>
                    <Text style={styles.labelBold}>Motivo:</Text>
                    <Text style={styles.label}>{motivo}</Text>
                    <Text style={{...styles.label,marginTop:"10px"}}>Por lo cual considero que mi porcentaje de responsabilidad de esta incidencia es del:</Text>
                    <Text style={styles.label}>_________ <Text style={styles.labelBold}>%</Text></Text>
                    <Text style={styles.label}>¿ Por que ?</Text>

                    <Text style={styles.label}>_________________________________________________________________________________________________</Text>
                    <Text style={styles.label}>_________________________________________________________________________________________________</Text>
                    <Text style={styles.label}>_________________________________________________________________________________________________</Text>
                    <Text style={styles.label}>_________________________________________________________________________________________________</Text>

                    <Text style={{...styles.label,marginTop:"10px"}}>Quien consideras que fue el responsable, cuanto porcentaje deberia pagar y porque?</Text>
                    <Text style={styles.label}>_________________________________________________________________________________________________</Text>
                    <Text style={styles.label}>_________________________________________________________________________________________________</Text>

                    <View style={styles.containerFirmas}>
                        <View style={{textAlign:"center",flexBasis:"50%"}}>
                            <Text style={{...styles.label}}>___________________________</Text>
                            <Text style={{...styles.label}}>Responsable de incidente</Text>
                        </View>

                        <View style={{textAlign:"center",flexBasis:"50%"}}>
                            <Text style={{...styles.label}}>___________________________</Text>
                            <Text style={{...styles.label}}>Encargado de obra</Text>
                        </View>

                        <View style={{textAlign:"center",flexBasis:"50%",marginTop:"40px"}}>
                            <Text style={{...styles.label}}>___________________________</Text>
                            <Text style={{...styles.label}}>Testigo</Text>
                        </View>

                        <View style={{textAlign:"center",flexBasis:"50%",marginTop:"40px"}}>
                            <Text style={{...styles.label}}>___________________________</Text>
                            <Text style={{...styles.label}}>Testigo</Text>
                        </View>
 
                    </View>
               </View>
                
            </Page>
        </Document>
    )
}
