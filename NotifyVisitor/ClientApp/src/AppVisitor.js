import React, { Component } from 'react';
import { Layout } from './components/Layout';
import AppRoutes from './AppRoutes.js';
import AppRoutesFree from './AppRoutesFree.js';
import { Route, Routes } from 'react-router-dom';
import { withAuth } from './msal/MsalAuthProvider';
import './custom.css'

export class AppVisitor extends Component {
      
    render() {
        return (
            <Layout {...this.props}>   
                    <Routes>
                        {AppRoutesFree.map((route, index) => {
                            const { element, ...rest } = route;
                            return <Route key={index} {...rest} element={element} />;
                        })}
                    </Routes>
            </Layout>
        );
    }
}

