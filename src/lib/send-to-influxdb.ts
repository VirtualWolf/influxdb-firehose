import request from 'superagent';
import { log } from '../log';
const config = require('../../config.json');

export enum Bucket {
    'air-quality', power, weather
}

interface ArrayOfObjects {
    [key: string]: string | number;
};

interface Data {
    bucket: keyof typeof Bucket;
    tags?: ArrayOfObjects[];
    fields: ArrayOfObjects[];
    timestamp?: number;
}

export async function sendToInfluxDb(data: Data) {
    try {
        const lineProtocol = generateLineProtocol(data);

        log('Sending line protocol: ' + lineProtocol, 'DEBUG');

        const result = await request.post(`${config.influxDbUrl}/api/v2/write?org=${config.organisation}&bucket=${data.bucket}&precision=ms`)
            .set('Authorization', `Token ${config.token}`)
            .set('Content-Type', 'text/plain')
            .send(lineProtocol);

        log(`Received status ${result.status} from InfluxDB`, 'DEBUG');
    } catch (err: any) {
        log('Error sending data to InfluxDB: ' + err.message, 'ERROR');
    }
}

function generateLineProtocol(data: Data) {
    const timestamp = data.timestamp
        ? data.timestamp
        : Date.now();

    const tags = data.tags
        ? ',' + concatenateEntries(data.tags)
        : '';

    const fields = concatenateEntries(data.fields);

    return `${data.bucket}${tags} ${fields} ${timestamp }`;
}

function concatenateEntries(array: ArrayOfObjects[]) {
    return array.map(item => {
        return Object.entries(item).map(([key, value]) => `${key}=${value}`);
    }).join('&');
}
