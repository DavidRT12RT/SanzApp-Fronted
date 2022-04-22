import { Routes, Route } from "react-router-dom";
import {Component404} from "../components/component404/Component404";
import { AplicationLandingPage } from "../components/application/AplicationLandingPage";
//Components
import { Games } from "../components/application/Games";
import {AplicationNavbar} from "../components/application/ui/AplicationNavbar";

export const ApplicationRoutes = () => {
    return (
        <>
            <AplicationNavbar/> 
            <Routes>
                <Route path="/" element={<AplicationLandingPage />} />
                <Route path="games" element={<Games />} />
                <Route path="/*" element={<Component404 />} />
            </Routes>
        </>
    );
};
