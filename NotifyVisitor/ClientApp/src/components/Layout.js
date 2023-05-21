import React from 'react';
import { msalAuth } from '../msal/MsalAuthProvider';
import NavMenu from './NavMenu';

/**
 * Layout renders componentes included in all views
 * 
 * @param {any} props
 * @returns
 */
export function Layout(props) {
    return (
        <div>
            {!props.public && <NavMenu {...props} auth={props.auth} />}
            <div className="container-padd">
                {props.children}
            </div>
        </div>
    );
}


