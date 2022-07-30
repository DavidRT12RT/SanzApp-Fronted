import React from 'react'
import moment from "moment";
import logo from "../assets/logoCompleto.jpg";//Logo de Sanz completo
import { Table } from '../Table';
//Fuentes personalizadas
import LatoBold from "../assets/fuentes/Lato-Bold.ttf";
import LatoRegular from "../assets/fuentes/Lato-Regular.ttf";
import { Page, Document, Image, StyleSheet, Text, View, Font } from '@react-pdf/renderer';

export const ReporteSalidasAlmacen = ({intervaloFecha,categorias,salidas}) => {
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
            padding:20,
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
            color: 'red',
            letterSpacing: 4,
            fontSize: 20,
            textAlign: 'center',
            textTransform: 'uppercase',
            marginTop:10,
            fontFamily: 'Lato',
            fontWeight:"bold"
        },
        descripcion:{
            fontSize:13,
            textAlign:"center",
            fontFamily:"Lato",
            fontWeight:"normal"
        },
        dateSelectContainer:{
            textAlign:"center",
            marginTop:30,
        },
        categorysContainer:{
            marginTop:30,
            textAlign:"center"
        },
        categorysSelect:{
            display:"flex",
            flexDirection:"row",
            flexWrap:"wrap",
            justifyContent:"center",
            alignItems:"center",
            padding:10
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

                <Text style={styles.reportTitle}>Reporte salidas del almacen</Text>
                <Text style={styles.descripcion}>Salidas que ha tenido el almacen con el perido de fecha y categorias seleccionadas.</Text>

                <View style={styles.dateSelectContainer}>
                    <Text style={styles.labelBold}>Intervalo de fecha de los registros</Text>
                    <Text style={styles.label}>{intervaloFecha[0]} --- {intervaloFecha[1]}</Text>
                </View>


                <View style={styles.categorysContainer}>
                    <Text style={styles.labelBold}>Filtrando salidas por las siguientes categorias:</Text>
                    <View style={styles.categorysSelect}>
                        {categorias.map(categoria => (
                            //Return explicito
                            <Text key={categoria} style={{...styles.label,marginRight:10}}>{categoria.toUpperCase()}</Text>
                        ))}
                    </View>
                </View>

                {salidas.map(salida => (
                    <View style={styles.salidaContainer} key={salida.key}>
                        <Text style={{...styles.fechaSalida,marginRight:10}}>Fecha de la salida: {salida.fechaCreacion}</Text>
                        <Text style={{...styles.label,marginRight:10}}>Tipo de salida: <Text style={styles.labelBold}>{salida.tipo.toUpperCase()}</Text></Text>
                        <Text style={{...styles.label,marginRight:10}}>Cantidad de productos retirados: {salida.listaProductos.length}</Text>
                        {salida.beneficiarioObra ? <Text style={styles.label}>Beneficiario de la salida: {salida.beneficiarioObra.titulo}</Text> : <Text style={styles.label}>Beneficiario de la salida: {salida.beneficiarioResguardo.nombre}</Text>}
                        <Table
                            th
                            col={['25%','25%','25%','25%']}
                            children={[
                                ["Nombre","Marca","Cantidad ingresada","Unidad"],
                                ...salida.listaProductos.map(producto=> {
                                    return [producto.id.nombre,producto.id.marca,producto.cantidad,producto.id.unidad]
                                })
                            ]} 
                        />
                    </View>
                ))}
           </Page>
        </Document>
    )
}

