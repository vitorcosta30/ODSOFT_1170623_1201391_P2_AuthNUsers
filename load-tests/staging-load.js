import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '30s', target: 10 },
        { duration: '2m',  target: 10 },
        { duration: '30s', target: 0 },
    ],
    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95)<600'],
    },
};

export default function () {
    const res = http.get('http://lmsbooks-staging:8088/actuator/health');

    check(res, {
        'status is 200': (r) => r.status === 200,
    });

    sleep(1);
}
