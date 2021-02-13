import request from 'superagent';
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
    timestamp: number;
}

export async function sendToInfluxDb(data: Data) {
    try {
        const lineProtocol = generateLineProtocol(data);

        if (process.env.DEBUG) {
            console.log(lineProtocol);
        }

        const result = await request.post(`${config.influxDbUrl}/api/v2/write?org=${config.organisation}&bucket=${data.bucket}&precision=ms`)
            .set('Authorization', `Token ${config.token}`)
            .set('Content-Type', 'text/plain')
            .send(lineProtocol);

        if (process.env.DEBUG) {
            console.log('Received status', result.status);
        }
    } catch (err) {
        console.error(err.message);
    }
}

function generateLineProtocol(data: Data) {
    const tags = data.tags
        ? ',' + concatenateEntries(data.tags)
        : '';

    const fields = concatenateEntries(data.fields);

    return `${data.bucket}${tags} ${fields} ${data.timestamp}`;
}

function concatenateEntries(array: ArrayOfObjects[]) {
    return array.map(item => {
        return Object.entries(item).map(([key, value]) => `${key}=${value}`);
    }).join('&');
}
