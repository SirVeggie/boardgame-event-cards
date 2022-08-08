import axios from 'axios';

export function pcNotification(message: string) {
    return axios.get(`http://89.27.98.123:30000/api/notification?message=${encodeURIComponent(message)}`);
}