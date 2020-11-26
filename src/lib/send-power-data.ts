import request from 'superagent';
import { DateTime } from 'luxon';
import { sendToInfluxDb } from './send-to-influxdb';
const config = require('../../config.json');

export async function sendPowerData() {
    try {
        const [currentLoad, batteryCharge] = await Promise.all([
            await request.get(`${config.power}/api/meters/aggregates`).disableTLSCerts(),
            await request.get(`${config.power}/api/system_status/soe`).disableTLSCerts(),
        ]);

        const timestamp = DateTime.utc().valueOf();

        await sendToInfluxDb({
            bucket: 'power',
            fields: [{
                solar_generation: currentLoad.body.solar.instant_power <= 30    // solar_generation
                    ? 0
                    : currentLoad.body.solar.instant_power,
                solar_voltage: currentLoad.body.solar.instant_average_voltage,  // solar_voltage
                home_usage: currentLoad.body.load.instant_power,                // home_usage
                home_voltage: currentLoad.body.load.instant_average_voltage,    // home_voltage
                grid_flow: currentLoad.body.site.instant_power,                 // grid_flow
                battery_flow: currentLoad.body.battery.instant_power,           // battery_flow
                battery_charge_percentage: batteryCharge.body.percentage,        // battery_charge_percentage
            }],
            timestamp,
        });

    } catch (err) {
        console.error(err);
    }
}
