import React, { useState } from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';

const DocumentoPDF = () => {
	return (
	<Document>
    	<Page size="A4" >
      		<View >
        		<Text>Section #1</Text>
      		</View>
      		<View >
        		<Text>Section #2</Text>
      		</View>
    	</Page>
  	</Document>
  );
}

export const PDFVisalizador = () => {
	 return (
		<PDFViewer>
    		<DocumentoPDF/>
  		</PDFViewer>
	 )
}