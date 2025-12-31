import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '30s', target: 20 },
        { duration: '1m',  target: 50 },
        { duration: '2m',  target: 50 },
        { duration: '1m',  target: 20 },
        { duration: '30s', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<600'],
    },
};

const BASE_URL = 'http://lmsusers-staging:8088';
const PASSWORD = 'Password123!';

export default function () {


    const healthRes = http.get(`${BASE_URL}/actuator/health`);
    check(healthRes, {
        'health status is 200': (r) => r.status === 200,
    });


    const username = `user_${__VU}_${__ITER}@gmail.com`;

    const registerPayload = JSON.stringify({
        username: username,
        password: `${PASSWORD}`,
        name: 'Load Test User',
        role: 'READER',
        authorities: ['READER'],
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const registerRes = http.post(
        `${BASE_URL}/api/public/register`,
        registerPayload,
        params
    );

    check(registerRes, {
        'register status is 200': (r) => r.status >= 200,

    });


    const loginPayload = JSON.stringify({
        username: username,
        password: `${PASSWORD}`,
    });

    const loginRes = http.post(
        `${BASE_URL}/api/public/login`,
        loginPayload,
        params
    );

    check(loginRes, {
        'login status is 200': (r) => r.status >= 200,
    });

}
