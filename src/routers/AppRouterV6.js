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
import { RegisterScreen } from "../components/auth/RegisterScreen";
import { PublicRoute } from "./PublicRoute";

export const AppRouter = ()=>{
    return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/inicio" element={<LandingPage />} />
              <Route path="/acerca" element={<About />}/>
              <Route path="/obras" element={<Features/>}/>
              <Route path="/contacto" element={<Contact/>}/>
                <Route path="/login" element={
                    <PublicRoute>
                        <LoginScreen/>
                    </PublicRoute>
                } />
              <Route path="/registro" elementent={
              <PublicRoute>
                  <RegisterScreen/>
              </PublicRoute>
              } />
              <Route path="/aplicacion/*" element={
                  <PrivateRoute>
                      <ApplicationRoutes/>
                  </PrivateRoute>
                }
              />
              <Route path="/*" element={<Component404 />} />
            </Routes>
      </BrowserRouter>
    )
}
