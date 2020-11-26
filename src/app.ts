import { sendTemperatureData } from './lib/send-temperature-data';
import { sendPowerData } from './lib/send-power-data';

setInterval(async () => await sendTemperatureData(), 60000);
setInterval(async () => await sendPowerData(), 5000);
