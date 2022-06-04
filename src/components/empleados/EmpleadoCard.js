import { Avatar, Card, Image } from 'antd';
import React from 'react'
import { Link } from 'react-router-dom';
const { Meta } = Card;

export const EmpleadoCard = ({empleado}) => {
	const imagePath = `http://localhost:4000/api/uploads/usuarios/${empleado.uid}`;
    
    return (
		<>
			<Card style={{width:"1000px",height:"300px"}}>
				<Avatar src={imagePath} style={{width:"150px",height:"150px"}}/>

			</Card>
		</> 
  	)
}
