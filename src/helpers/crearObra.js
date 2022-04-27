import { success } from "../alerts/botons";
import { fetchConToken} from "../helpers/fetch";

export const crearObra = async (obra) =>{
    fetchConToken("/obras",obra,"POST")
        .then(response => response.json())
        .then(resp => {
            console.log(resp);
            success(resp.msg);
            window.location.reload(false);
        })
        .catch(error => console.log(error));
}