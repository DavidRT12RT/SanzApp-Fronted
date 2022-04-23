import Swal from "sweetalert2";


export const success = () =>{Swal.fire({
            width:"50%",
            icon:"success",
            title:"Haz accedido correctamente!",
            showConfirmButton:false,
            timer:1500
        });
    }