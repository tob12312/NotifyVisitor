/**
 * Sets a second instance of axios (the default axios instance is not explicitly declared) so that we can differenciate between
 * requests we want to set different types of headers and rules. 
 *  
 * @returns
 */

import axios from "axios";

const BASE_URL = document.getElementsByTagName('base')[0].getAttribute('href');
export default axios.create({
    baseURL: BASE_URL
}); 