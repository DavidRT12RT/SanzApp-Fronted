import React from 'react'
import logo from "../assets/logoCompleto.jpg";//Logo de Sanz completo
import moment from 'moment';
import { Page, Document, Image, StyleSheet, Text, View, Font } from '@react-pdf/renderer';
import { Table } from '../Table';

//Fuentes personalizadas
import LatoBold from "../assets/fuentes/Lato-Bold.ttf";
import LatoRegular from "../assets/fuentes/Lato-Regular.ttf";

export const ReporteProductosRetiradosAlmacen = ({salidas}) => {

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
        fechaSalida:{
            backgroundColor:"#FFFF00",
            fontSize:13,
            fontFamily:"Lato",
            fontWeight:"normal",
            width:"80%"
        },
        salidaContainer:{
            textAlign:"center",
            marginTop:30,
            flexDirection:"row",
            justifyContent:"center",
            alignItems:"center",
            flexWrap:"wrap",
        }
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.headerLogoAndFecha}>
                    <Image style={styles.logo} src={logo}/>
                    <Text style={styles.fechaReporte}>Fecha del reporte: {fecha}</Text>
                </View>

                <Text style={styles.reportTitle}>Productos retirados de almacen</Text>
                <Text style={styles.descripcion}>Resumen acerca de las salidas que ha tenido la obra, asi como los productos de cada una de estas y los productos devueltos al almacen.</Text>

                {salidas.map(salida => (
                    <View style={styles.salidaContainer} key={salida.key}>
                        <Text style={{...styles.fechaSalida,marginRight:10}}>Fecha de la salida: {salida.fechaCreacion}</Text>
                        <Text style={{...styles.label,marginRight:10}}>Tipo de salida: <Text style={styles.labelBold}>{salida.tipo.toUpperCase()}</Text></Text>
                        <Text style={{...styles.label,marginRight:10}}>Cantidad de productos retirados: {salida.listaProductos.length}</Text>
                        <Table
                            th
                            col={['25%','25%','25%','25%']}
                            children={[
                                ["Nombre","Marca","Cantidad retirada","Unidad"],
                                ...salida.listaProductos.map(producto=> {
                                    return [producto.id.nombre,producto.id.marca,producto.cantidadRetirada,producto.id.unidad]
                                })
                            ]} 
                        />
                        <Text style={{...styles.label,color:"green"}}>Productos devueltos de la salida:</Text>
                        {salida.productosDevueltos.length === 0 && <Text style={{...styles.labelBold,color:"red",width:"100%"}}>Ninguna devolucion hecha por el momento...</Text>}
                        {salida.productosDevueltos.map(entrada => (
                                <View style={styles.salidaContainer} key={entrada._id}>
                                    <Text style={{...styles.labelBold,marginRight:10}}>Fecha de la devolucion: {entrada.fecha}</Text>
                                    <Table
                                        th
                                        col={['25%','25%','25%','25%']}
                                        children={[
                                            ["Nombre","Marca","Cantidad retirada","Unidad"],
                                            ...entrada.listaProductos.map(producto=> {
                                                return [producto.id.nombre,producto.id.marca,producto.cantidadIngresada,producto.id.unidad]
                                            })
                                        ]} 
                                    />
                                </View>
                        ))}
                    </View>
                ))}

            </Page>
        </Document>
    )
}
