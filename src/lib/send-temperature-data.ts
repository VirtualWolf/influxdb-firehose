import request from 'superagent';
import { sendToInfluxDb } from './send-to-influxdb';
const config = require('../../config.json');

export async function sendTemperatureData() {
    try {
        const [outdoor, indoor] = await Promise.all([
            request.get(config.outdoor),
            request.get(config.indoor),
        ]);

        await sendToInfluxDb({
            bucket: 'weather',
            tags: [{
                sensor: 'outdoor',
            }],
            fields: [{
                temperature: outdoor.body.temperature,
                humidity: outdoor.body.humidity,
            }],
            timestamp: outdoor.body.timestamp,
        });

        await sendToInfluxDb({
            bucket: 'weather',
            tags: [{
                sensor: 'indoor',
            }],
            fields: [{
                temperature: indoor.body.temperature,
                humidity: indoor.body.humidity,
            }],
            timestamp: indoor.body.timestamp,
        });
    } catch (err) {
        console.error(err);
    }
}
