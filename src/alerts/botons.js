import Swal from "sweetalert2";


export const success = (msg="") =>{Swal.fire({
            icon:"success",
            title:msg,
            showConfirmButton:false,
            timer:1500
        });
    }


export const error = (mensaje) =>{
            Swal.fire({
                icon:"error",
                title:mensaje,
                confirmButtonColor: "#ffc107",
            });
}