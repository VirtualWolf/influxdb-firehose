import { connect } from 'mqtt';
import { sendToInfluxDb } from './lib/send-to-influxdb';
import { log } from './log';
const config = require('../config.json');

const client = connect({
    servers: [{
        host: config.brokerAddress,
        port: config.brokerPort || 1883,
    }],
    clientId: 'influxdb-firehose',
    clean: false,
});

client.subscribe(Object.values(config.topics), {qos: 1});

client.on('message', async (topic, message) => {
    log(`Received message on ${topic}: ${message}`, 'DEBUG');

    const json = JSON.parse(message.toString());

    if (topic === config.topics.outdoor || topic === config.topics.indoor) {
        const location = Object.keys(config.topics).find(key => config.topics[key] === topic);

        await sendWeatherData(location!, json);
    }

    if (topic === config.topics.power) {
        await sendPowerData(json);
    }

    if (topic === config.topics.airquality) {
        await sendAirQualityData(json);
    }
})



interface WeatherPayload {
    timestamp: number;
    temperature: number;
    humidity: number;
}

async function sendWeatherData(location: string, json: WeatherPayload) {
        await sendToInfluxDb({
            bucket: 'weather',
            tags: [{
                sensor: location!,
            }],
            fields: [{
                temperature: json.temperature,
                humidity: json.humidity,
            }],
            timestamp: json.timestamp,
        });
}



interface PowerPayload {
    timestamp: number;
    solar_generation: number;
    solar_voltage: number;
    home_usage: number;
    home_voltage: number;
    grid_flow: number;
    battery_flow: number;
    battery_charge_percentage: number;
}

async function sendPowerData(json: PowerPayload) {
    await sendToInfluxDb({
        bucket: 'power',
        fields: [{
            solar_generation: json.solar_generation <= 30
                ? 0
                : json.solar_generation,
            solar_voltage: json.solar_voltage,
            home_usage: json.home_usage,
            home_voltage: json.home_voltage,
            grid_flow: json.grid_flow,
            battery_flow: json.battery_flow,
            battery_charge_percentage: json.battery_charge_percentage,
        }],
        timestamp: json.timestamp,
    });
}



interface AirQualityPayload {
    pm_1_0: number;
    pm_2_5: number;
    pm_10: number;
    particles_0_3um: number;
    particles_0_5um: number;
    particles_2_5um: number;
    particles_1_0um: number;
    particles_5_0um: number;
    particles_10um: number;
}

async function sendAirQualityData(json: AirQualityPayload) {
    await sendToInfluxDb({
        bucket: 'air-quality',
        fields: [{
            'PM1.0': json.pm_1_0,
            'PM2.5': json.pm_2_5,
            'PM10': json.pm_10,
            'Particles>0.3µm/0.1Lair': json.particles_0_3um,
            'Particles>0.5µm/0.1Lair': json.particles_0_5um,
            'Particles>2.5µm/0.1Lair': json.particles_2_5um,
            'Particles>1.0µm/0.1Lair': json.particles_1_0um,
            'Particles>5.0µm/0.1Lair': json.particles_5_0um,
            'Particles>10.0µm/0.1Lair': json.particles_10um,
        }],
    });
}
