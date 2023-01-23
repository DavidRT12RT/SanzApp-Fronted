import { useEffect } from "react";

//React Router Dom
import { BrowserRouter, Route, Routes, Redirect, Navigate } from "react-router-dom"

//Redux
import { useDispatch, useSelector } from "react-redux";
import { startChecking } from "../actions/authActions";

//Importaciones propias
import { SanzSpinner } from "../helpers/spinner/SanzSpinner";

//Routes secundarias
import { ApplicationRoutes } from "./ApplicationRoutes";
import { AdministracionRoutes } from "./AdministracionRoutes";
import { AlmacenRoutes } from "./AlmacenRoutes";

//Helpers to protect routes
import { PublicRoute } from "./PublicRoute";
import { PrivateRoutePorRole } from "./PrivateRoutePorRole";
import { PrivateRoute } from "./PrivateRoute";

//Component's
import { LoginScreen } from "../components/componentesGenerales/auth/LoginScreen";
import { UsuarioScreen } from "../components/componentesGenerales/usuarios/UsuarioScreen/UsuarioScreen";
import { Mensajes } from "../components/componentesGenerales/mensajes/Mensajes";


export const AppRouter = ()=>{
	const dispatch = useDispatch();
    const { checking,uid } =  useSelector(state => state.auth);

    //Esta al pendiente de el uid que nunca sea null o lo envia al login
    useEffect(()=>{
        dispatch(startChecking());
    },[dispatch]);

    //Cargando mientras se hace la autenticación automatica
    if(checking) return <SanzSpinner/>
    return (
		<BrowserRouter>
        	<Routes>
            	<Route path="/login" element={
                	<PublicRoute uid={uid}>
                    	<LoginScreen/>
                    </PublicRoute>
                	} 
              	/>
              	<Route path="/aplicacion/*" element={
					<PrivateRoutePorRole rolRequerido={["ADMIN_ROLE","INGE_ROLE","ADMINISTRADOR_ROLE","USER_ROLE","OBRAS_ROLE"]}>
                        <ApplicationRoutes/>
                  	</PrivateRoutePorRole>
                	}
				/>
              	<Route path="/almacen/*" element={
					<PrivateRoutePorRole rolRequerido={["ADMIN_ROLE","ENCARGADO_ALMACEN_ROL","ADMINISTRADOR_ROLE"]}>
                        <AlmacenRoutes/>
                  	</PrivateRoutePorRole>
                	}
              	/>
				<Route path="/administracion/*" element={
					<PrivateRoutePorRole rolRequerido={["ADMIN_ROLE","ADMINISTRADOR_ROLE"]}>
						<AdministracionRoutes/>
					</PrivateRoutePorRole>
				}/>

				<Route path="/usuarios/:usuarioId/" element={
					<PrivateRoute uid={uid}>
						<UsuarioScreen/>
					</PrivateRoute>
				}/>

				<Route path="/mensajes" element={
					<PrivateRoute uid={uid}>
						<Mensajes/>
					</PrivateRoute>
				}/>

              	<Route path="/*" element={
					<Navigate to="/login"></Navigate>
                }/>

			</Routes>
      	</BrowserRouter>
    )
}
