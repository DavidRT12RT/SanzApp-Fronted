//React
import {BrowserRouter, Route, Routes} from "react-router-dom"
//Importaciones propias
import {PrivateRoute} from "./PrivateRoute";
import { ApplicationRoutes } from "./ApplicationRoutes";
import { LandingPage } from "../components/landingPage/LandingPage";
import { About } from "../components/aboutUs/About";
import { Features } from "../components/features/Features";
import { Contact } from "../components/contact/Contact";
import { Component404 } from "../components/component404/Component404";
import { LoginScreen } from "../components/auth/LoginScreen";
import { PublicRoute } from "./PublicRoute";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { startChecking } from "../actions/authActions";
import { SocketProvider } from "../context/SocketContext";
import { PrivateRoutePorRole } from "./PrivateRoutePorRole";
import { AlmacenRoutes } from "./AlmacenRoutes";

export const AppRouter = ()=>{

    const dispatch = useDispatch();
    const {checking,uid} =  useSelector(state => state.auth);

    //Esta al pendiente de el uid que nunca sea null o lo envia al login
    useEffect(()=>{
        dispatch(startChecking());
    },[dispatch]);

    //Cargando mientras se hace la autenticación automatica

    if(checking){
      return <h5>Validando token, Espere...</h5>;
    }
    return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/inicio" element={<LandingPage />} />
              <Route path="/acerca" element={<About />}/>
              <Route path="/obras" element={<Features/>}/>
              <Route path="/contacto" element={<Contact/>}/>
                <Route path="/login" element={
                    <PublicRoute uid={uid}>
                        <LoginScreen/>
                    </PublicRoute>
                } 
              />
              <Route path="/aplicacion/*" element={
                  <PrivateRoutePorRole rolRequerido={["ADMIN_ROLE","INGE_ROLE","ADMINISTRADOR_ROLE"]}>
                      <SocketProvider>
                          <ApplicationRoutes/>
                      </SocketProvider>
                  </PrivateRoutePorRole>
                }
              />
              <Route path="/almacen/*" element={
                  <PrivateRoutePorRole rolRequerido={["ADMIN_ROLE","ENCARGADO_ALMACEN_ROL"]}>
                      <SocketProvider>
                          <AlmacenRoutes/>
                      </SocketProvider>
                  </PrivateRoutePorRole>
                }
              />
              <Route path="/*" element={<Component404 />} />
            </Routes>
      </BrowserRouter>
    )
}
