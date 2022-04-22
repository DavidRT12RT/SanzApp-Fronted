import Swal from "sweetalert2";

export const sucess = () =>{
    Swal.fire({
        position:"top-center",
        //heightAuto:false,
        width:"20%",
        icon:"success",
        title:"Logeo correcto!",
        showConfirmButton:false,
        timer:1500
    }); 
}
