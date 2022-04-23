import Swal from "sweetalert2";


export const success = () =>{Swal.fire({
            icon:"success",
            title:"Haz accedido correctamente!",
            showConfirmButton:false,
            timer:1500
        });
    }


export const error = (mensaje) =>{

            Swal.fire({
                icon:"error",
                title:mensaje,
                showConfirmButton:false,
                timer:1500,
            
            });
}