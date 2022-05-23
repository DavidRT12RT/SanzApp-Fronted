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


export const confirmation = (mensaje) =>{

    return new Promise((resolve,reject)=>{
        Swal.fire({
            title:"¿Estas seguro?",
            text:mensaje,
            icon:"warning",
            showCancelButton:true,
            confirmButtonColor: '#ffc107',
            cancelButtonColor: '#d33',
            cancelButtonText:"Cancelar",
            confirmButtonText: 'Adelante'})
            .then((result)=>{
                if(result.isConfirmed){
                    resolve(true);
                }else{
                    reject(false);
                }
            })
        })
    }