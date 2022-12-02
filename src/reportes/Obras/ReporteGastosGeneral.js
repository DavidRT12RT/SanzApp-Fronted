import React from 'react'
import { Page, Document, Image, StyleSheet, Text, View, Font } from '@react-pdf/renderer';
import moment from 'moment';

import logo from "../assets/logoCompleto.jpg";//Logo de Sanz completo
import { Table } from '../Table';

//Fuentes personalizadas
import LatoBold from "../assets/fuentes/Lato-Bold.ttf";
import LatoRegular from "../assets/fuentes/Lato-Regular.ttf";



export const ReporteGastosGeneral = ({obraInfo,gastos}) => {

    const fecha = moment().locale('es').format("YYYY-MM-DD");
    const colecciones = ["comprobables","NoComprobables","oficina"];
    let total = 0;

    for(const property in gastos){
        if(colecciones.includes(property)) total += gastos[property]?.totalFacturas || gastos[property]?.totalGastos;
    }
    
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
        obraInfoContainer:{
            marginTop:30,
        },
        estadisticaContainer:{
            marginTop:20,
        },
        gastoSubtitulo:{
            fontSize:15,
            fontFamily:"Lato",
            fontWeight:"bold",
            color:"#ffc107",
            textAlign:"center",
            marginTop:30,
            textTransform: 'uppercase',
        },
        gastosContainer:{
            textAlign:"center",
            marginTop:10,
            flexDirection:"row",
            justifyContent:"center",
            alignItems:"center",
            flexWrap:"wrap",
        },
        folioFactura:{
            backgroundColor:"#FFFF00",
            fontSize:13,
            fontFamily:"Lato",
            fontWeight:"normal",
            width:"80%"
        },
 
    });
 
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.headerLogoAndFecha}>
                    <Image style={styles.logo} src={logo}/>
                    <Text style={styles.fechaReporte}>Fecha del reporte: {fecha}</Text>
                </View>

                <Text style={styles.reportTitle}>Reporte de gastos total de la obra</Text>
                <Text style={styles.descripcion}>Id obra:{`${obraInfo._id}`} No.Track:{obraInfo.numeroTrack}</Text>

                
                <View style={styles.obraInfoContainer}>
                    <Text style={{...styles.labelBold,fontSize:"15px"}}>Informacion acerca de la obra</Text>
                    <Text style={styles.labelBold}>Titulo de la obra: <Text style={styles.label}>{obraInfo.titulo}</Text></Text>
                    <Text style={styles.labelBold}>Empresa: <Text style={styles.label}>{obraInfo.empresa.nombre}</Text></Text>
                    <Text style={styles.labelBold}>Sucursal: <Text style={styles.label}>{obraInfo.sucursal.nombre}</Text></Text>
                    <Text style={styles.labelBold}>Estado de la obra: <Text style={styles.label}>{obraInfo.estado}</Text></Text>
                    <Text style={styles.labelBold}>Tipo de reporte: <Text style={styles.label}>{obraInfo.tipoReporte}</Text></Text>
                </View>
                
                <Text style={styles.gastoSubtitulo}>Gastos comprobables</Text>

                <View style={styles.gastosContainer}>
                    {
                        gastos.comprobables.registros.map(gasto => (
                            <>
                                <Text style={{...styles.folioFactura,marginRight:10}}>Folio factura: {gasto.folioFactura}</Text>
                                <Table
                                    th
                                    col={['25%','25%','25%','25%']}
                                    children={[
                                        ["Importe","Emisor factura","Concepto o descripcion","Fecha"],
                                        [`$${gasto.importeFactura}`,gasto.emisorFactura,gasto.descripcionFactura,gasto.fechaFactura]
                                    ]} 
                                />
                            </>
                        ))  
                   }
                </View>

                <Text style={{...styles.labelBold,marginTop:"10px"}}>{`Total gastos comprobable: `}<Text style={{...styles.labelBold,color:"red"}}>${gastos.comprobables.totalFacturas}</Text></Text>

                <Text style={styles.gastoSubtitulo}>Gastos NO comprobables</Text>

                <View style={styles.gastosContainer}>
                    {
                        gastos.NoComprobables.registros.map(gasto => (
                            <>
                                <Table
                                    th
                                    col={['33.33%','33.33%','33.33%']}
                                    children={[
                                        ["Importe","Concepto o descripcion","Fecha"],
                                        [`$${gasto.importeGasto}`,gasto.conceptoGasto,gasto.fechaGasto]
                                    ]} 
                                />
                            </>
                        ))  
                   }
                </View>

                <Text style={{...styles.labelBold,marginTop:"10px"}}>{`Total gastos NO comprobables: `}<Text style={{...styles.labelBold,color:"red"}}>{gastos.NoComprobables.totalGastos}</Text></Text>

                <Text style={styles.gastoSubtitulo}>Gastos de oficina</Text>

                <View style={styles.gastosContainer}>
                    {
                        gastos.oficina.registros.map(gasto => (
                            <>
                                <Text style={{...styles.folioFactura,marginRight:10}}>Folio factura: {gasto.folioFactura}</Text>
                                <Table
                                    th
                                    col={['25%','25%','25%','25%']}
                                    children={[
                                        ["Importe","Emisor factura","Concepto o descripcion","Fecha"],
                                        [`$${gasto.importeFactura}`,gasto.emisorFactura,gasto.descripcionFactura,gasto.fechaFactura]
                                    ]} 
                                />
                            </>
                        ))  
                   }
                </View>

                <Text style={{...styles.labelBold,marginTop:"10px"}}>{`Total gastos oficina: `}<Text style={{...styles.labelBold,color:"red"}}>${gastos.oficina.totalFacturas}</Text></Text>

                <Text style={{...styles.labelBold,marginTop:"10px"}}>__________________________________________________________________________________</Text>
                <Text style={{...styles.labelBold,marginTop:"10px"}}>Total gastos de obra: <Text style={{...styles.labelBold,color:"red"}}>${total}</Text></Text>

            </Page>
        </Document>
    )
}

