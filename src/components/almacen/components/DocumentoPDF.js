import React, { useState } from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';
import { Table,Tag } from 'antd';

export const DocumentoPDF = () => {
    const columns = [            
        {
            title:"Tipo de entrada",
            key:"tipoEntrada",
            dataIndex:"tipo",
            render:(text,record) => {
                switch (text) {
                    case "sobrante-obra":
                        return (
                            <Tag color="green">SOBRANTE-OBRA</Tag>
                        )
                    case "devolucion-resguardo":
                        return (
                            <Tag color="yellow">DEVOLUCION-RESGUARDO</Tag>
                        )
                    case "normal":
                        return (
                            <Tag color="blue">NORMAL</Tag>
                        )
                }
            }
        },
        {
            title:"Cantidad ingresada",
            key:"cantidad",
            dataIndex:"cantidad"
        },
        {
            title:"Fecha del ingreso",
            key:"fecha",
            dataIndex:"fecha"
        },
    ];
	return (
	<Document>
    	<Page size="A4" >
      		<View >
        		<Text>TEXTO EN EXCESO!</Text>
      		</View>
      		<View >
        		<Text>Section #2</Text>
      		</View>
      		<View >
        		<Text>Section #3</Text>
      		</View>
    	</Page>
  	</Document>
  );
}

export const PDFVisalizador = () => {
	 return (
		<PDFViewer style={{width:"100vw",height:"100vh"}}>
    		<DocumentoPDF/>
  		</PDFViewer>
	 )
}