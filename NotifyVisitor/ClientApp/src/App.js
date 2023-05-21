import React, { Component } from 'react';
import { Layout } from './components/Layout';
import AppRoutes from './AppRoutes.js';
import { Route, Routes } from 'react-router-dom';
import { withAuth } from './msal/MsalAuthProvider';
import headers from "./headers";

const interceptor = headers();

class App extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Routes>
                {AppRoutes.map((route, index) => {
                    const { element, public: isPublic, ...rest } = route;
                    const WrappedComponent = withAuth(element.type, isPublic);
                    return (
                        <Route
                            key={index}
                            {...rest}
                            element={
                                <WrappedComponent>
                                    <Layout public={isPublic} auth={this.props.auth} {...element.props}>
                                        <element.type {...element.props} />
                                    </Layout>
                                </WrappedComponent>
                            }
                        />
                    );
                })}
            </Routes>
        );

    }
}
export default App;

