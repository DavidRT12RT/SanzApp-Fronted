import React from 'react'
import logo from "../assets/logoCompleto.jpg";//Logo de Sanz completo
import { Page, Document, Image, StyleSheet, Text, View, Font } from '@react-pdf/renderer';
import { Table } from '../Table';
import moment from 'moment';
//Fuentes personalizadas
import LatoBold from "../assets/fuentes/Lato-Bold.ttf";
import LatoRegular from "../assets/fuentes/Lato-Regular.ttf";

export const ReporteInventarioAlmacen = ({inventario}) => {

    const fecha = moment().locale('es').format("YYYY-MM-DD");

    const productosInventariados = inventario.productosInventariados.map(producto => {
        //Por cada producto devolver un array con informacion de este mismo.
        const fila = [producto.id.nombre,producto.id.marca,producto.id.unidad,producto.cantidadTeorica,producto.cantidadContada,producto.diferencia,producto.tipo];
        return fila;
    })

    console.log(productosInventariados);

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
        logo: {
            width:"150",
            height:"120"
        },
        label:{
            fontSize:13,
            fontFamily:"Lato",
            fontWeight:"normal",
        },
        reportTitle:{
            letterSpacing: 4,
            fontSize: 20,
            textAlign: 'center',
            textTransform: 'uppercase',
            marginTop:10,
            fontFamily:"Lato",
            fontWeight:"bold"
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
        descripcion:{
            fontSize:12,
            textAlign:"center",
            fontFamily:"Lato",
            marginTop:"10px",
            fontWeight:"normal"
        },
        dateInventarioContainer:{
            textAlign:"center",
            marginTop:30,
        },
        dateInventario:{
            paddingBottom: 3,
            fontSize:16,
            fontFamily:"Lato",
            fontWeight:"bold"
        },
        informacionInventario: {
            paddingBottom: 3,
            fontSize:16,
            fontFamily:"Lato",
            fontWeight:"bold"
        },
        inventarioInformacionContainer:{
            marginTop: 36
        },
        productosInventariadosTitulo:{
            fontSize:15,
            fontFamily:"Lato",
            fontWeight:"bold",
            color: '#61dafb',
            textAlign:"center",
            marginTop:30,
            textTransform: 'uppercase',
        }
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.headerLogoAndFecha}>
                    <Image style={styles.logo} src={logo}/>
                    <Text style={styles.fechaReporte}>Fecha del reporte: {fecha}</Text>
                </View>

                <Text style={styles.reportTitle}>{inventario.titulo}</Text>
                <Text style={styles.descripcion}>{inventario.descripcion}</Text>

                <View style={styles.inventarioInformacionContainer}>
                    <Text style={styles.informacionInventario}>Informacion del inventario:</Text>
                    <Text style={styles.label}>Estatus del inventario: <Text style={{...styles.label,color:"red"}}>{inventario.estatus}</Text></Text>
                    <Text style={styles.label}>Tipo de inventario: {inventario.tipo}</Text>
                    <Text style={styles.label}>Intervalo de fecha del inventario: <Text style={{...styles.label,backgroundColor:"#FFFF00",}}>{inventario.intervaloFecha[0]} --- {inventario.intervaloFecha[1]}</Text></Text>
                    <Text style={styles.label}>Fecha de registro: {inventario.fechaRegistro}</Text>
                    <Text style={styles.label}>Numero de productos en el inventario: {inventario.productosInventariados.length}</Text>
                </View>


                <Text style={styles.productosInventariadosTitulo}>Productos inventariados</Text>
                <Table
                    style={styles.table}
                    th
                    col={['14.28%','14.28%','14.28%', '14.28%','14.28%','14.28%','14.28%']}
                    children={[
                        ['Nombre', 'Marca','Unidad','Cantidad teorica','Cantidad contada','Diferencia','Resultado'],
                        ...productosInventariados
                    ]} 

                />

            </Page>
        </Document>
    )
}

