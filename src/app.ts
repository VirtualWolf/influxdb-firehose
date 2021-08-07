import { sendTemperatureData } from './lib/send-temperature-data';
import { sendPowerData } from './lib/send-power-data';
import { sendAirQualityData } from './lib/send-air-quality-data';

setInterval(async () => await sendTemperatureData(), 60000);
setInterval(async () => await sendPowerData(), 5000);
setInterval(async () => await sendAirQualityData(), 300000);
