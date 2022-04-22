import { Carrousel } from "./components/Carrousel";
import { InformationComponent } from "./components/InformationComponent";
import { NewsComponent } from "./components/NewsComponent";
import {Footer} from "./components/Footer";
import { Navbar } from "../ui/NavbarBootstrap";

export const LandingPage = () => {
    return (
        <>
        <Navbar/>
        <div className="margin-top">
        <Carrousel />
        <InformationComponent/>
        <NewsComponent/>
        <Footer/>
        </div>
        </>
    );
};
