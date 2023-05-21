import axios from 'axios';
import { msalAuth, withAuth } from "./msal/MsalAuthProvider"
import { msalConfig, loginApiRequest } from './msal/MsalConfig';
import { getUseerDetails } from './graph/GraphService';
import { GraphData } from './components/GraphData';


/**
 * a function that sets the JWT in the payload of all requests to the API except for the call that signs in a new visitor,
 * and the call that updates where a visitor is.
 * 
 * @param
 * @returns
 */
export default async function headers() {

        axios.defaults.baseURL = "https://localhost:/44434";
        axios.interceptors.request.use(
            async (config) => {
                const account = msalAuth.getAllAccounts()[0];
                const msalResponse = await msalAuth.acquireTokenSilent({
                    ...loginApiRequest,
                    account: account,
                });
                config.headers.Authorization = `Bearer ${msalResponse.accessToken}`;
                return config;

            },
            (err) => {
                return Promise.reject(err);
            }

        );
    
    }

   


