# influxdb-firehose
A quick and dirty TypeScript app to read temperature, humidity, air quality, and Telsa Powerwall2 power usage data from an MQTT broker and save it to [InfluxDB](https://www.influxdata.com/downloads/) for graphing with [Grafana](https://grafana.com).

The temperature and humidity data comes from [esp32-sensor-reader-mqtt](https://github.com/VirtualWolf/esp32-sensor-reader-mqtt), the air quality data comes from [esp32-air-quality-reader-mqtt](https://github.com/VirtualWolf/esp32-air-quality-reader-mqtt), and the power usage data comes from [powerwall-to-pvoutput-uploader](https://github.com/VirtualWolf/powerwall-to-pvoutput-uploader).

## InfluxDB configuration
1. Load the InfluxDB UI at [localhost:8086](http://localhost:8086)
2. Create a new user, organisation, and three buckets: `weather`, `power`, and `air-quality`, and a read/write token for the bucket.

## Grafana configuration
1. Log in to the Grafana UI at [localhost:3000](http://localhost:3000) with the default `admin`/`admin` username and password.
2. [Add a new data source](https://grafana.com/docs/grafana/latest/datasources/add-a-data-source/) for InfluxDB, set the Query Language to "Flux", and the organisation, token, and default bucket to use.
3. Optionally import [the dashboard](config/dashboard.json).

## Firehose configuration
Create a file called `config.json` at the root of the repository with the following contents:

```json
{
    "token": "<InfluxDB token>",
    "influxDbUrl": "http://localhost:8086",
    "organisation": "<InfluxDB organisation>",
    "brokerAddress": "<MQTT broker address>",
    "clientId": "<MQTT clientId, optional, defaults to 'influxdb-firehose'>",
    "clean": "<create a persistent connection, optional, boolean, default is false>",
    "topics": {
        "airquality": "<MQTT topic to subscribe to for air quality readings>",
        "outdoor": "<MQTT topic to subscribe to for outdoor temperature/humidity readings>",
        "indoor": "<MQTT topic to subscribe to for indoor temperature/humidity readings>",
        "power": "<MQTT topic to subscribe to for power usage readings>"
    }
}
```
