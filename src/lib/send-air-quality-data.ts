import request from 'superagent';
import { sendToInfluxDb } from './send-to-influxdb';
const config = require('../../config.json');

export async function sendAirQualityData() {
    try {
        const airQuality = await request.get(config.airQuality)

        await sendToInfluxDb({
            bucket: 'air-quality',
            fields: [{
                'PM1.0': airQuality.body.pm_1_0,
                'PM2.5': airQuality.body.pm_2_5,
                'PM10': airQuality.body.pm_10,
                'Particles>0.3µm/0.1Lair': airQuality.body.particles_0_3um,
                'Particles>0.5µm/0.1Lair': airQuality.body.particles_0_5um,
                'Particles>2.5µm/0.1Lair': airQuality.body.particles_2_5um,
                'Particles>1.0µm/0.1Lair': airQuality.body.particles_1_0um,
                'Particles>5.0µm/0.1Lair': airQuality.body.particles_5_0um,
                'Particles>10.0µm/0.1Lair': airQuality.body.particles_10um,
            }],
        });
    } catch (err) {
        console.error(err);
    }
}
