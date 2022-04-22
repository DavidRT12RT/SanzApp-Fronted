import React, { useState } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
  } from 'react-router-dom';

import { AuthRouter } from './AuthRouter';
import { JournalScreen } from '../components/journal/JournalScreen';
import { useEffect } from 'react';
import userEvent from '@testing-library/user-event';
import {PrivateRoute} from "./PrivateRoute";

export const AppRouter = () => {

    
    //True = No estoy seguro , false = autenticado
    const [checking,setChecking] = useState(true);

    const [isLoggedIn,setIsLoggedIn] = useState(false);

    //TODO:
    //Cambiar segun el localStorage...
    useEffect(()=>{
        //Observablo=??? 
        setChecking(false);
        const userAutenticad = true;
        if(userAutenticad){
            setIsLoggedIn(true);
        }
    },[setChecking]);

    if(checking){
        return (
            <h1>Espere...
            </h1>
        )
    }
    return (
        /*Saber si el user esta autenticado para mandarlo a su ruta
        correcta*/

        <Router>
            <div>
                <Switch>
                    <Route 
                        path="/auth"
                        component={ AuthRouter }
                    />

                    <PrivateRoute
                        exact
                        isAuthenticated={isLoggedIn}
                        path="/"
                        component={ JournalScreen }
                    />

                    <Redirect to="/auth/login" />


                </Switch>
            </div>
        </Router>
    )
}

