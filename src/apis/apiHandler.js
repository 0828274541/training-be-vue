const axios = require('axios')
const store = require('../store/store').default
const router = require('../router').default

// Set config defaults when creating the instance
const instance = axios.create({
    baseURL: 'https://nodejs2021123456.herokuapp.com'
});

store.subscribe((mutation) => {
    if (mutation.type === 'SET_USER_INFO') {
        instance.defaults.headers.common['auth-token'] = mutation.payload.token;
    }
})

// Alter defaults after instance has been created
instance.defaults.headers.common['auth-token'] = store.getters.GET_TOKEN;

instance.interceptors.request.use((config) => {
    console.log('Redirect to', config.url);
    return config;
});

instance.interceptors.response.use((response) => {
    switch (response.data.code) {
        case 401: {
            store.commit('RESET_USER_INFO');
            return router.push("auth/login");
        }
        case 403: return router.push("/403"); // handle redirect forbiden page
        default: break;
    }
    return response;
});

module.exports = instance;
