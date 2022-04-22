import {BrowserRouter, Route} from "react-router-dom"
import {JournalScreen} from "../components/journal/JournalScreen"
import {AuthRouterV6} from "./AuthRouterV6"

export const AppRouterV6 = ()=>{
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<JournalScreen />} />
          <Route path="/auth/*" element={<AuthRouterV6/>}/>
          <Route path="*" element={AuthRouterV6}/>
        </Routes>
    </BrowserRouter>
}
