import axios from 'axios';

export function pcNotification(message: string) {
    return axios.post('http://38.242.159.10:1000/api/notification', { data: message });
}