import React from 'react'
import { Page, Document, Image, StyleSheet, Text, View, Font } from '@react-pdf/renderer';
import logo from "../assets/logoCompleto.jpg";//Logo de Sanz completo
import moment from 'moment';
import { Table } from '../Table';

//Fuentes personalizadas
import LatoBold from "../assets/fuentes/Lato-Bold.ttf";
import LatoRegular from "../assets/fuentes/Lato-Regular.ttf";

export const ReporteSalidas = ({ informacionProducto,intervaloFecha,salidas,salidasCategorias}) => {
    const fecha = moment().locale('es').format("YYYY-MM-DD");
    const urlImagen = `http://localhost:4000/api/uploads/productos/${informacionProducto._id}`

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

    salidas = salidas.map(salida => {
        if(salida.tipo === "obra") return [salida.tipo.toUpperCase(),salida.cantidad,salida.fecha,salida.beneficiario.titulo,salida.motivo];
        if(salida.tipo === "resguardo") return [salida.tipo.toUpperCase(),salida.cantidad,salida.fecha,salida.beneficiario.nombre,salida.motivo];
    });
   

    const styles = StyleSheet.create({
        page: {
            fontSize: 11,
            lineHeight: 1.5,
            display:"flex",
            flexDirection: "column",
            padding:20
        }, 
        imagenProducto: {
            width: 150,
            height: 150,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop:-30
       },
        logo: {
            width:"150",
            height:"120"
        },
        reportTitle:{
            color: 'red',
            letterSpacing: 4,
            fontSize: 20,
            textAlign: 'center',
            textTransform: 'uppercase',
            marginTop:10,
            fontFamily: 'Lato',
            fontWeight:"bold"
        },
        label:{
            fontSize:13,
            fontFamily:"Lato",
            fontWeight:"normal"
        },
        idProductoContainer:{
            flexDirection: "row",
            justifyContent:"center",
            fontFamily:"Lato",
            fontWeight:"normal"
        },
        invoiceDateContainer: {
            marginTop:36,
        },
        descripcion:{
            fontSize:12,
            textAlign:"center",
            fontFamily:"Lato",
            fontWeight:"normal"
        },
        titleSalidas:{
            fontSize:14,
            color:"red",
            textAlign:"center",
            textTransform: 'uppercase',
            marginTop:15,
            fontFamily:"Lato",
            fontWeight:"bold"
        },
        dateSelectContainer:{
            textAlign:"center",
            marginTop:15,
            fontFamily:"Lato",
            fontWeight:"bold"
        },
        dateSelect:{
            fontSize:16,
            fontFamily:"Lato",
            fontWeight:"bold"
        },
        headerContainer: {
            marginTop: 36
        },
        reporteContainer:{
            marginTop:20,
            justifyContent:"flex-end"
        },
        informacionProducto: {
            paddingBottom: 3,
            fontSize:16,
            fontFamily:"Lato",
            fontWeight:"bold"
        },
        fechaReporte:{
            marginTop: 20,
            fontSize:14,
            paddingBottom: 3,
            fontFamily:"Lato",
            fontWeight:"bold"
        },
        headerLogoAndFecha:{
            flexDirection:"row",
            justifyContent:"space-between",
            alignItems:"center"
        },
        categoriasFiltradas:{
            textAlign:"center",
            textTransform:"uppercase",
            fontFamily:"Lato",
            fontWeight:"normal"
        },
        textoError:{
            textAlign:"center",
            color:"red",
            fontFamily:"Lato",
            fontWeight:"normal"
        },
        table:{
            fontFamily:"Lato",
            fontWeight:"normal"
        }
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.headerLogoAndFecha}>
                    <Image style={styles.logo} src={logo}/>
                    <Text style={styles.fechaReporte}>Fecha del reporte: {fecha}</Text>
                </View>

                <Image style={styles.imagenProducto} src={urlImagen}/>
                <View style={styles.idProductoContainer}>
                    <Text style={styles.label}>{informacionProducto._id}</Text>
                </View>
                <Text style={styles.reportTitle}>Reporte salidas del producto</Text>
                <Text style={styles.descripcion}>Salidas que ha tenido el producto dentro de almacen.</Text>
                
                
                <View style={styles.headerContainer}>
                    <Text style={styles.informacionProducto}>Informacion del producto:</Text>
                    <Text style={styles.label}>Nombre del producto: {informacionProducto.nombre}</Text>
                    <Text style={styles.label}>Marca: {informacionProducto.marca}</Text>
                </View>


                <View style={styles.dateSelectContainer}>
                    <Text style={styles.dateSelect}>Intervalo de fecha de los registros</Text>
                    <Text style={styles.label}>{intervaloFecha[0]} --- {intervaloFecha[1]}</Text>
                </View>


                <Text style={styles.titleSalidas}>Salidas</Text>
                <Text style={styles.categoriasFiltradas}>(Filtrando salidas por las categorias: {salidasCategorias.join()})</Text>
                <Table
                    style={styles.table}
                    th
                    col={['15%','15%','15%', '30%','25%']}
                    children={[
                        ['Tipo de salida', 'Cantidad','Fecha del retiro','Beneficiario','Motivo de salida'],
                        ...salidas
                    ]} 
                />
                {salidas.length === 0 && <Text style={styles.textoError}>Ninguna salida encontrada...</Text>}
           </Page>
        </Document>

    )
}