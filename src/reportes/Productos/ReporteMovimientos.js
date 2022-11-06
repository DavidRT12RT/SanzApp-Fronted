import React from 'react'
import { Page, Document, Image, StyleSheet, Text, View, Font } from '@react-pdf/renderer';
import logo from "../assets/logoCompleto.jpg";//Logo de Sanz completo
import moment from 'moment';
import { Table } from '../Table';
//Fuentes personalizadas
import LatoBold from "../assets/fuentes/Lato-Bold.ttf";
import LatoRegular from "../assets/fuentes/Lato-Regular.ttf";

export const ReporteMovimientos = ({movimientos,intervaloFecha,categorias,informacionProducto}) => {

    const fecha = moment().locale('es').format("YYYY-MM-DD");
    const urlImagen = `${process.env.REACT_APP_BACKEND_URL}/api/uploads/productos/${informacionProducto._id}`

    movimientos = movimientos.map(movimiento => {
        return [movimiento.cantidadTeorica,movimiento.cantidadContada,movimiento.inventario.fechaRegistro,movimiento.tipo]
    });


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
        logo: {
            width:"150",
            height:"120"
        },
        fechaReporte:{
            marginTop: 20,
            fontSize:14,
            paddingBottom: 3,
            fontFamily:"Lato",
            fontWeight:"bold"
        },
        imagenProducto: {
            width: 150,
            height: 150,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop:-30
       },
        idProductoContainer:{
            flexDirection: "row",
            justifyContent:"center",
            fontFamily:"Lato",
            fontWeight:"normal"
        },
        label:{
            fontSize:13,
            fontFamily:"Lato",
            fontWeight:"normal"
        },
        reportTitle:{
            color: "blue",
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
        headerContainer: {
            marginTop: 36
        },
        informacionProducto: {
            paddingBottom: 3,
            fontSize:16,
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
        titleMovimientos:{
            fontSize:14,
            color:"blue",
            textAlign:"center",
            textTransform: 'uppercase',
            marginTop:15,
            fontFamily:"Lato",
            fontWeight:"bold"
        },
        categoriasFiltradas:{
            textAlign:"center",
            textTransform:"uppercase",
            fontFamily:"Lato",
            fontWeight:"normal"
        },
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

                <Text style={styles.reportTitle}>Reporte movimientos del producto</Text>
                <Text style={styles.descripcion}>Movimientos que ha tenido el producto en almacen.</Text>

                <View style={styles.headerContainer}>
                    <Text style={styles.informacionProducto}>Informacion del producto:</Text>
                    <Text style={styles.label}>Nombre del producto: {informacionProducto.nombre}</Text>
                    <Text style={styles.label}>Marca: {informacionProducto.marca}</Text>
                </View>

                <View style={styles.dateSelectContainer}>
                    <Text style={styles.dateSelect}>Intervalo de fecha de los registros</Text>
                    <Text style={styles.label}>{intervaloFecha[0]} --- {intervaloFecha[1]}</Text>
                </View>

                <Text style={styles.titleMovimientos}>Movimientos</Text>
                <Text style={styles.categoriasFiltradas}>(Filtrando movimientos del producto por las categorias: {categorias.join()})</Text>

                <Table
                    th
                    col={['25%', '25%', '25%','25%']}
                    children={[
                        ['Cantidad teorica','Cantidad contada','Fecha creacion inventario','Tipo',],
                        ...movimientos
                    ]} 
                />

            </Page>
        </Document>
    )
}
