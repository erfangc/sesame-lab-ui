import createHistory from 'history/createBrowserHistory'
import {store} from './index';

export const history = createHistory();
//
// history.listen(({pathname}) => {
//     const {auth: {isAuthenticated}} = store.getState();
//     /*
//     if we are not authenticated
//     && we are not authenticating we need to redirect to the home page
//     to prevent the user from viewing random pages that they won't be able to access the API any way
//      */
//     if (pathname !== '/callback' && !isAuthenticated) {
//         history.push('/');
//     }
// });