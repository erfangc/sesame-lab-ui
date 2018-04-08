import {store} from './index';
import axios from 'axios';

export function initInterceptors() {
    axios.interceptors.request.use(
        (config) => {
            const {auth: {accessToken}} = store.getState();
            /*
            add Authorization if accessToken is defined
             */
            if (accessToken !== null) {
                return {
                    ...config,
                    headers: {
                        ...config.headers, Authorization: `Bearer ${accessToken}`
                    }
                };
            } else {
                return config;
            }
        },
        (error) => {
            console.error(error);
        }
    );
}