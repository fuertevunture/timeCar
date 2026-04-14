import axios from 'axios';

const webManConfig = {
    baseURL: '/api',
}

const webMan = axios.create(webManConfig);


export default webMan;