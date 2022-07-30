import React from 'react'
import moment from "moment";
import logo from "../assets/logoCompleto.jpg";//Logo de Sanz completo
import { Table } from '../Table';
//Fuentes personalizadas
import LatoBold from "../assets/fuentes/Lato-Bold.ttf";
import LatoRegular from "../assets/fuentes/Lato-Regular.ttf";
import { Page, Document, Image, StyleSheet, Text, View, Font } from '@react-pdf/renderer';

export const ReporteEntradasAlmacen = ({intervaloFecha,entradas,categorias}) => {
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
        fechaEntrada:{
            backgroundColor:"#FFFF00",
            fontSize:13,
            fontFamily:"Lato",
            fontWeight:"normal",
            width:"80%"
        },
        entradaContainer:{
            textAlign:"center",
            marginTop:30,
            flexDirection:"row",
            justifyContent:"center",
            alignItems:"center",
            flexWrap:"wrap",
        }
    });

    /* 
        Asincrono : Dos o mas cosas suceden al mismo tiempo
        Sincrono : Las operaciones son secuenciales, es decir una despues de otra
    */
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.headerLogoAndFecha}>
                    <Image style={styles.logo} src={logo}/>
                    <Text style={styles.fechaReporte}>Fecha del reporte: {fecha}</Text>
                </View>

                <Text style={styles.reportTitle}>Reporte entradas del almacen</Text>
                <Text style={styles.descripcion}>Entradas que ha el almacen en el intervalo de fechas seleccionado.</Text>

                <View style={styles.dateSelectContainer}>
                    <Text style={styles.labelBold}>Intervalo de fecha de los registros</Text>
                    <Text style={styles.label}>{intervaloFecha[0]} --- {intervaloFecha[1]}</Text>
                </View>



                <View style={styles.categorysContainer}>
                    <Text style={styles.labelBold}>Filtrando entradas por las siguientes categorias:</Text>
                    <View style={styles.categorysSelect}>
                        {categorias.map(categoria => (
                            //Return explicito
                            <Text key={categoria} style={{...styles.label,marginRight:10}}>{categoria.toUpperCase()}</Text>
                        ))}
                    </View>
                </View>

                {/*Por cada entrada agregaremos un container con la informacion de la entrada y la tabla con la lista de productos*/}
                {entradas.map(entrada => (
                    <View style={styles.entradaContainer} key={entrada.key}>
                        <Text style={{...styles.fechaEntrada,marginRight:10}}>Fecha de la entrada: {entrada.fecha}</Text>
                        <Text style={{...styles.label,marginRight:10}}>Tipo de entrada: <Text style={styles.labelBold}>{entrada.tipo.toUpperCase()}</Text></Text>
                        <Text style={styles.label}>Cantidad de productos ingresados: {entrada.listaProductos.length}</Text>
                        <Table
                            th
                            col={['25%','25%','25%','25%']}
                            children={[
                                ["Nombre","Marca","Cantidad ingresada","Unidad"],
                                ...entrada.listaProductos.map(producto=> {
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
