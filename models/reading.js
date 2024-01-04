// import mongodb
import { ObjectId } from "mongodb";
import { db } from "../database/mongodb.js";
// get fields from mongo db

export function Reading(
  _id,
  device_name,
  precipitation_mmh,
  time,
  latitude,
  longitude,
  atomospheric_pressure_kpa,
  max_windspeed_ms,
  solar_radiation_wm2,
  vapour_pressure_kpa,
  humidity_per,
  wind_direction_deg,
  temp_c
) {
  return {
    _id,
    device_name,
    precipitation_mmh,
    time,
    latitude,
    longitude,
    atomospheric_pressure_kpa,
    max_windspeed_ms,
    solar_radiation_wm2,
    vapour_pressure_kpa,
    humidity_per,
    wind_direction_deg,
    temp_c,
  };
}

//DONE : Create a new weather reading / weather device
export async function createReading(newReading) {
  delete newReading.data;
  return db.collection("readings").insertOne(newReading);
}
//Done: Create multiple readings

export async function createMultiReadings(newReadings) {
  return db.collection("readings").insertMany(newReadings);
}
// DONE : Get pages
export async function getReadgingsByPage(page, size) {
  const offset = page * size;
  return db.collection("readings").find().skip(offset).limit(size).toArray();
}
// DONE : Get all readings / But loading is too long???
export async function getAllReadings() {
  return db.collection("readings").find().toArray();
}

//DONE :Get readings by the station / But loading is too long???
export async function getReadingsByStation(station, page, size) {
  const offset = page * size;
  return db
    .collection("readings")
    .find({ device_name: station })
    .skip(offset)
    .limit(size)
    .toArray();
}

//DONE: Update precipitation by ID
export async function updatePrecipitation(id, precipitation) {
  return db.collection("readings").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        precipitation_mmh: precipitation,
      },
    }
  );
}
//DONE Update reading
export async function updateReading(id, weatherData) {
  return db.collection("readings").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        precipitation_mnh: weatherData.precipitation_mmh,
        latitude: weatherData.latitude,
        time: weatherData.time,
        longitude: weatherData.longitude,
        temp_c: weatherData.temp_c,
        device_name: weatherData.device_name,
        atomospheric_pressure_kpa: weatherData.atomospheric_pressure_kpa,
        max_windspeed_ms: weatherData.max_windspeed_ms,
        solar_radiation_wm2: weatherData.solar_radiation_wm2,
        vapour_pressure_kpa: weatherData.vapour_pressure_kpa,
        wind_direction_deg: weatherData.wind_direction_deg,
        humidity_per: weatherData.humidity_per,
      },
    }
  );
}
//DONE: Delete document by id
export async function deleteReadingByID(id) {
  return db.collection("readings").deleteOne({ _id: new ObjectId(id) });
}

//DONE:Get maxPrecipitation return sensor name, reading date / time and the precipitation for last 5 months

export async function getMaxPrecipitation(deviceName, date) {
  const selectedData = new Date(date);
  const fiveMonthsAgo = new Date(
    selectedData.setMonth(selectedData.getMonth() - 5)
  );

  return db
    .collection("readings")
    .find({
      $and: [
        { device_name: deviceName },
        { time: { $gte: fiveMonthsAgo, $lt: new Date(date) } },
      ],
    })
    .sort({ precipitation_mmh: -1 })
    .limit(1)
    .project({ device_name: 1, time: 1, precipitation_mmh: 1, _id: 1 })
    .toArray();
}

// getMaxPrecipitation("Woodford_Sensor").then((result) => {
//   console.log(result);
//});

// find all queary sort for 5 month and get the first temp

//Done:Get Data by given date and time
export async function getReadingByDeviveDateHour(deviceName, date, hour) {
  const start = `${date}T${hour}:00:00Z`;
  const end = `${date}T${hour}:59:59Z`;
  return db
    .collection("readings")
    .find({
      $and: [
        { device_name: deviceName },
        { time: { $gte: new Date(start), $lt: new Date(end) } },
      ],
    })
    .sort({ time: -1 })
    .project({
      device_name: 1,
      temp_c: 1,
      precipitation_mmh: 1,
      atmospheric_pressure_kpa: 1,
      solar_radiation_wm2: 1,
      time: 1,
      _id: 1,
    })
    .toArray();
}
// getReadingByDeviveDateHour("Woodford_Sensor", "2020-08-20", "11").then(
//   (result) => console.log(result)
// );

//Done:Get maxTemp by given date and day and return Sensor Name, reading date / time and the Temperature value.
export async function getMaxTemperatureByDate(startDate, EndDate) {
  return db
    .collection("readings")
    .find({ time: { $gte: new Date(startDate), $lt: new Date(EndDate) } })
    .sort({ temp_c: -1 })
    .limit(1)
    .project({ device_name: 1, time: 1, temp_c: 1, _id: 1 })
    .toArray();
}

// getMaxTemperatureByDate("2020-08-06", "2020-08-20").then((result) =>
//   console.log(result)
// );
