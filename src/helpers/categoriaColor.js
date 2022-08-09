export const categoriaColor = (categoria) => {
        switch (categoria.toLowerCase()) {
            case "ferreteria":
                return <Tag color="cyan" style={{fontSize:"13px",padding:"13px"}} key="ferreteria">{categoria}</Tag> 
            case "vinilos":
                return <Tag color="green" style={{fontSize:"13px",padding:"13px"}} key="vinilos">{categoria}</Tag> 
            case "herramientas":
                return <Tag color="blue" style={{fontSize:"13px",padding:"13px"}} key="herramientas">{categoria}</Tag> 
            case "pisosAzulejos":
                return <Tag color="orange" style={{fontSize:"13px",padding:"13px"}} key="pisosAzulejos">{categoria}</Tag>
            case "fontaneria":
                return <Tag color="red" style={{fontSize:"13px",padding:"13px"}} key="fontaneria">{categoria}</Tag>
            case "iluminacion":
                return <Tag color="yellow" style={{fontSize:"13px",padding:"13px"}} key="iluminacion">{categoria}</Tag>
            case "materialElectrico":
                return <Tag color="gold" style={{fontSize:"13px",padding:"13px"}} key="materialElectrico">{categoria}</Tag>
            case "selladores":
                return <Tag color="gold" style={{fontSize:"13px",padding:"13px"}} key="selladores">{categoria}</Tag>
            default:
                return <Tag color="green" style={{fontSize:"13px",padding:"13px"}} key="categoria">{categoria}</Tag> 
    }
}
