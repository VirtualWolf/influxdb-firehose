# influxdb-firehose
A quick and dirty TypeScript app to read temperature, humidity, air quality, and Telsa Powerwall2 power usage data from an MQTT broker and save it to [InfluxDB](https://www.influxdata.com/downloads/) for graphing with [Grafana](https://grafana.com).

The temperature and humidity data comes from [esp32-sensor-reader-mqtt](https://github.com/VirtualWolf/esp32-sensor-reader-mqtt), the air quality data comes from [esp32-air-quality-reader-mqtt](https://github.com/VirtualWolf/esp32-air-quality-reader-mqtt), and the power usage data comes from [powerwall-to-pvoutput-uploader](https://github.com/VirtualWolf/powerwall-to-pvoutput-uploader).

It requires a file called `config.json` at the root of the repository with the following configuration:

```json
{
    "token": "<InfluxDB token>",
    "influxDbUrl": "http://localhost:8086",
    "organisation": "<InfluxDB organisation>",
    "brokerAddress": "<MQTT broker address>",
    "topics": {
        "airquality": "<MQTT topic to subscribe to for air quality readings>",
        "outdoor": "<MQTT topic to subscribe to for outdoor temperature/humidity readings>",
        "indoor": "<MQTT topic to subscribe to for indoor temperature/humidity readings>",
        "power": "<MQTT topic to subscribe to for power usage readings>"
    }
}
```
