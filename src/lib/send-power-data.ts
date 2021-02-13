import request from 'superagent';
import { DateTime } from 'luxon';
import { sendToInfluxDb } from './send-to-influxdb';
import { getToken } from './get-token';
const config = require('../../config.json');

export async function sendPowerData() {
    try {
        const token = await getToken();

        const [currentLoad, batteryCharge] = await Promise.all([
            await request.get(`${config.power}/api/meters/aggregates`)
                .set('Cookie', `AuthCookie=${token}`)
                .disableTLSCerts(),
            await request.get(`${config.power}/api/system_status/soe`)
                .set('Cookie', `AuthCookie=${token}`)
                .disableTLSCerts(),
        ]);

        const timestamp = DateTime.utc().valueOf();

        try {
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
            console.error(err.message);
        }
    } catch (err) {
        if (err.status === 401 || err.status === 403) {
            console.warn('Access to API was forbidden, getting a new token...');

            await getToken(true);
        } else {
            console.error(err.message);
        }
    }
}
