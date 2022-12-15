//React
import {BrowserRouter, Route, Routes} from "react-router-dom"
//Importaciones propias
//import {PrivateRoute} from "./PrivateRoute";
import { ApplicationRoutes } from "./ApplicationRoutes";
import { PublicRoute } from "./PublicRoute";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { startChecking } from "../actions/authActions";
import { SocketProvider } from "../context/SocketContext";
import { PrivateRoutePorRole } from "./PrivateRoutePorRole";
import { AlmacenRoutes } from "./AlmacenRoutes";
import { SanzSpinner } from "../helpers/spinner/SanzSpinner";
import { AdministracionRoutes } from "./AdministracionRoutes";

import { LoginScreen } from "../components/componentesGenerales/auth/LoginScreen";
import { UsuarioScreen } from "../components/componentesGenerales/usuarios/UsuarioScreen/UsuarioScreen";


export const AppRouter = ()=>{
	const dispatch = useDispatch();
    const {checking,uid} =  useSelector(state => state.auth);

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
					<PrivateRoutePorRole rolRequerido={["ADMIN_ROLE","INGE_ROLE","ADMINISTRADOR_ROLE","USER_ROLE"]}>
                      	<SocketProvider>
                        	<ApplicationRoutes/>
                      	</SocketProvider>
                  	</PrivateRoutePorRole>
                	}
				/>
              	<Route path="/almacen/*" element={
					<PrivateRoutePorRole rolRequerido={["ADMIN_ROLE","ENCARGADO_ALMACEN_ROL","ADMINISTRADOR_ROLE"]}>
                    	<SocketProvider>
                        	<AlmacenRoutes/>
                      	</SocketProvider>
                  	</PrivateRoutePorRole>
                	}
              	/>
				<Route path="/administracion/*" element={
					<PrivateRoutePorRole rolRequerido={["ADMIN_ROLE","ADMINISTRADOR_ROLE"]}>
						<SocketProvider>
							<AdministracionRoutes/>
						</SocketProvider>
					</PrivateRoutePorRole>
				}/>

				<Route path="/usuarios/:usuarioId/" element={
                    <SocketProvider>
						<UsuarioScreen/>
					</SocketProvider>
				}/>

              	<Route path="/*" element={
					<PublicRoute uid={uid}>
                    	<LoginScreen/>
                    </PublicRoute>
                	} 
              	/>
			</Routes>
      	</BrowserRouter>
    )
}
