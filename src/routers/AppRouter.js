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
import { useDispatch } from 'react-redux';
import { startChecking } from '../actions/authActions';

export const AppRouter = () => {

    
   

    
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

