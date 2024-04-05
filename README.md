# influxdb-firehose
This repository houses the configuration for the [InfluxDB](https://www.influxdata.com/downloads/) + [Grafana](https://grafana.com) + [Telegraf](https://www.influxdata.com/time-series-platform/telegraf/) setup I have running to pull temperature and humidity data from [esp32-sensor-reader-mqtt](https://github.com/VirtualWolf/esp32-sensor-reader-mqtt), air quality data from [esp32-air-quality-reader-mqtt](https://github.com/VirtualWolf/esp32-air-quality-reader-mqtt), and power usage data from [powerwall-to-pvoutput-uploader](https://github.com/VirtualWolf/powerwall-to-pvoutput-uploader).

## Configuration

1. Create a `.env` file at the root of this repository with the following contents (the `INFLUXDB_TOKEN` and `INFLUXDB_ORG` values will be filled out after InfluxDB has been started up for the first time):
```shell
MQTT_BROKER_ADDRESS=tcp://<your-broker-address>:1883
INFLUXDB_TOKEN=""
INFLUXDB_ORG=""
```
2. Run `docker compose up` to bring all the containers up.
3. Load the InfluxDB UI at [localhost:8086](http://localhost:8086) and create a new user, organisation, and three buckets: `weather`, `power`, and `air-quality`, plus a read/write token for the bucket.
4. Set the token and organisation name in the `.env` file from Step 1 then restart the Telegraf container with `docker compose restart telegraf`.
5. Log in to the Grafana UI at [localhost:3000](http://localhost:3000) with the default `admin`/`admin` username and password.
6. [Add a new data source](https://grafana.com/docs/grafana/latest/datasources/add-a-data-source/) for InfluxDB, set the Query Language to "Flux", and the organisation, token, and default bucket to use.
7. Optionally import [the dashboard](config/dashboard.json).
