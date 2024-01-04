import { Router } from "express";
import * as Readings from "../models/reading.js";
import auth from "../middleware/auth.js";
const readingController = Router();

// Get all reading
readingController.get(
  "/readings/all",
  auth(["admin", "student"]),
  async (req, res) => {
    /*
  #swagger.summary = 'Get all readings'
      #swagger.responses[200] = {
         description: 'Found all readings',
         content: {
             'application/json': {
                 schema: {
                     type: 'object',
                     properties: {
                         status: {
                             type: 'number'
                         },
                         message: {
                             type: 'string'
                         },
                         reading: {
                             type: 'object',
                             properties: {
                                 _id: {
                                     type: 'string'
                                 },
                                 device_name: {
                                     type: 'string'
                                 },
                                  time: {
                                     type: 'string'
                                 },
                                 latitude: {
                                     type: 'number'
                                 },
                                 longitude: {
                                     type: 'number'
                                 },
                                temp_c: {
                                     type: 'number'
                                 },
                                humidity_per: {
                                     type: 'number'
                                 },
                                  max_windspeede_ms: {
                                     type: 'number'
                                 },
                                  solar_radiation_wm2: {
                                     type: 'number'
                                 },
                                 vapour_pressure_kpa: {
                                     type: 'number'
                                 },
                                 wind_direction_deg: {
                                     type: 'number'
                                 },
                                precipitation_mmh: {
                                     type: 'number'
                                 },
                             }
                         }
                     }
                 },
             }
         }
     } 
#swagger.responses[400] = {
         description: 'No found all readings',
         content: {
             'application/json': {
                 schema: {
                     type: 'object',
                     properties: {
                         status: {
                             type: 'number'
                         },
                         message: {
                             type: 'string'
                         },
                      
                     }
                 },
             }
         }
     } 
    #swagger.responses[500] = {
         description: 'Database Error',
         content: {
             'application/json': {
                 schema: {
                     type: 'object',
                     properties: {
                         status: {
                             type: 'number'
                         },
                         message: {
                             type: 'string'
                         },
                        
                     }
                 },
             }
         }
     }  

*/
    try {
      const readings = await Readings.getAllReadings();
      res.status(200).json({
        status: 200,
        message: "Successfully retrieved all weather readings",
        readings: readings,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: `Failed to retrieve all weather data: ${error}`,
      });
    }
  }
);

// Get readings by weather station +page/size
readingController.get(
  "/readings/:device_name/:page/:size",
  auth(["admin", "student"]),
  (req, res) => {
    /*
     #swagger.summary = 'Get readings By device name and page'
     #swagger.parameters['device_name'] = {
            in: 'path',
            description: 'device name',
            type: 'string'
        } 
     #swagger.parameters['page'] = {
            in: 'path',
            description: 'page',
            type: 'string'
        } 
     #swagger.parameters['size'] = {
            in: 'path',
            description: 'the number of documents on the page',
            type: 'string'
        } 

         #swagger.responses[200] = {
            description: 'Found readings by device name',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            status: {
                                type: 'number'
                            },
                            message: {
                                type: 'string'
                            },
                            reading: {
                                type: 'object',
                                properties: {
                                    _id: {
                                        type: 'string'
                                    },
                                    device_name: {
                                        type: 'string'
                                    },
                                     time: {
                                        type: 'string'
                                    },
                                    latitude: {
                                        type: 'number'
                                    },
                                    longitude: {
                                        type: 'number'
                                    },
                                   temp_c: {
                                        type: 'number'
                                    },
                                   humidity_per: {
                                        type: 'number'
                                    },
                                     max_windspeede_ms: {
                                        type: 'number'
                                    },
                                     solar_radiation_wm2: {
                                        type: 'number'
                                    },
                                    vapour_pressure_kpa: {
                                        type: 'number'
                                    },
                                    wind_direction_deg: {
                                        type: 'number'
                                    },
                                   precipitation_mmh: {
                                        type: 'number'
                                    },
                                }
                            }
                        }
                    },
                }
            }
        } 

        
        #swagger.responses[400] = {
            description: 'No readings found by device name',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            status: {
                                type: 'number'
                            },
                            message: {
                                type: 'string'
                            },
                            
                        }
                    },
                }
            }
        } 

        #swagger.responses[500] = {
            description: 'Database error',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            status: {
                                type: 'number'
                            },
                            message: {
                                type: 'string'
                            },
                          
                        }
                    },
                }
            }
        } 
  */
    const station = req.params.device_name;
    const page = Number(req.params.page);
    const size = Number(req.params.size);
    Readings.getReadingsByStation(station, page, size)
      .then((results) => {
        res.status(200).json({
          status: 200,
          message: "Get readings by device name",
          results: results,
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: `Failed to get readings by device name /${error}`,
        });
      });
  }
);

//Get all readings by pages
readingController.get(
  "/readings/page/:page/:size",
  auth(["admin", "student"]),
  (req, res) => {
    /*
     #swagger.summary = 'Get readings By page
     #swagger.parameters['page'] = {
            in: 'path',
            description: 'page',
            type: 'string'
        } 
         #swagger.parameters['size'] = {
            in: 'path',
            description: 'The number of documents on the page',
            type: 'string'
        } 

         #swagger.responses[200] = {
            description: 'Found readings by page',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            status: {
                                type: 'number'
                            },
                            message: {
                                type: 'string'
                            },
                            reading: {
                                type: 'object',
                                properties: {
                                    _id: {
                                        type: 'string'
                                    },
                                    device_name: {
                                        type: 'string'
                                    },
                                     time: {
                                        type: 'string'
                                    },
                                    latitude: {
                                        type: 'number'
                                    },
                                    longitude: {
                                        type: 'number'
                                    },
                                   temp_c: {
                                        type: 'number'
                                    },
                                   humidity_per: {
                                        type: 'number'
                                    },
                                     max_windspeede_ms: {
                                        type: 'number'
                                    },
                                     solar_radiation_wm2: {
                                        type: 'number'
                                    },
                                    vapour_pressure_kpa: {
                                        type: 'number'
                                    },
                                    wind_direction_deg: {
                                        type: 'number'
                                    },
                                   precipitation_mmh: {
                                        type: 'number'
                                    },
                                }
                            }
                        }
                    },
                }
            }
        } 

        
        #swagger.responses[400] = {
            description: 'No readings found by page',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            status: {
                                type: 'number'
                            },
                            message: {
                                type: 'string'
                            },
                          
                        }
                    },
                }
            }
        } 

        #swagger.responses[500] = {
            description: 'Database error',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            status: {
                                type: 'number'
                            },
                            message: {
                                type: 'string'
                            },
                           
                        }
                    },
                }
            }
        } 
  */

    const page = Number(req.params.page);
    const size = Number(req.params.size);

    Readings.getReadgingsByPage(page, size)
      .then((readings) => {
        res.status(200).json({
          status: 200,
          message: " Get readings by page",
          reading: readings,
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: `Failed to get readings by page /${error}`,
        });
      });
  }
);

//Get readings by specific station by date&time
readingController.get(
  "/readings/device/:device_name/date/:date/hour/:hour",
  auth(["admin", "student"]),
  (req, res) => {
    /*
     #swagger.summary = 'Get readings By device name/ date & hour, returning the temperature, atmospheric pressure, radiation and precipitation.
     #swagger.parameters['device_name'] = {
            in: 'path',
            description: 'Device name',
            type: 'string'
        }
     #swagger.parameters['date'] = {
            in: 'path',
            description: 'Date 2020-07-31~2021-05-07',
            type: 'string',
            
        }
     #swagger.parameters['hour'] = {
            in: 'path',
            description: 'Hour',
            type: 'string'
        }
         

         #swagger.responses[200] = {
            description: 'Found readings by device name/datetime',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            status: {
                                type: 'number'
                            },
                            message: {
                                type: 'string'
                            },
                            reading: {
                                type: 'object',
                                properties: {
                                    _id: {
                                        type: 'string'
                                    },
                                    device_name: {
                                        type: 'string'
                                    },
                                     time: {
                                        type: 'string'
                                    },
                                   temp_c: {
                                        type: 'number'
                                    },
                                     solar_radiation_wm2: {
                                        type: 'number'
                                    },
                                    vapour_pressure_kpa: {
                                        type: 'number'
                                    },
                                   precipitation_mmh: {
                                        type: 'number'
                                    },
                                }
                            }
                        }
                    },
                }
            }
        } 

        
        #swagger.responses[400] = {
            description: 'No readings found by device dame/datetime',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            status: {
                                type: 'number'
                            },
                            message: {
                                type: 'string'
                            },
                         
                        }
                    },
                }
            }
        } 

        #swagger.responses[500] = {
            description: 'Database error',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            status: {
                                type: 'number'
                            },
                            message: {
                                type: 'string'
                            },
                          
                        }
                    },
                }
            }
        } 
  */

    const deviceName = req.params.device_name;
    const date = req.params.date;
    const hour = req.params.hour;

    Readings.getReadingByDeviveDateHour(deviceName, date, hour)
      .then((readings) => {
        console.log(readings);
        res.status(200).json({
          status: 200,
          message: "Get readings by device, date and hour",
          readings: readings,
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: `Failed to get readings by device, date and hour /${error}`,
        });
      });
  }
);

// Get max temp for all stations by date range
readingController.get(
  "/readings/temperature/max/:start_date/:end_date",
  auth(["admin", "student"]),
  (req, res) => {
    /*
     #swagger.summary = 'Get max temp By datetime,returning the Sensor Name, reading date / time and the Temperature value'
       #swagger.parameters['start_date'] = {
            in: 'path',
            description: 'Start date 2020-07-31~',
            type: 'string',
            format: 'date',
            default: '2020-08-22'
        }
     #swagger.parameters['end_date'] = {
            in: 'path',
            description: 'End date ~2021-05-07',
            type: 'string',
            format: 'date',
            default: '2020-08-30'
        }
      

         #swagger.responses[200] = {
            description: 'Found max temp by device datetime',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            status: {
                                type: 'number'
                            },
                            message: {
                                type: 'string'
                            },
                            reading: {
                                type: 'object',
                                properties: {
                                    _id: {
                                        type: 'string'
                                    },
                                    device_name: {
                                        type: 'string'
                                    },
                                     time: {
                                        type: 'string'
                                    },
                                   
                                   temp_c: {
                                        type: 'number'
                                    },
                                  
                                }
                            }
                        }
                    },
                }
            }
        } 

        
        #swagger.responses[400] = {
            description: 'No Found max temp by device datetime',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            status: {
                                type: 'number'
                            },
                            message: {
                                type: 'string'
                            },
                          
                        }
                    },
                }
            }
        } 

        #swagger.responses[500] = {
            description: 'Database error',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            status: {
                                type: 'number'
                            },
                            message: {
                                type: 'string'
                            },
                          
                        }
                    },
                }
            }
        } 
  */

    const startDate = req.params.start_date;
    const endDate = req.params.end_date;

    Readings.getMaxTemperatureByDate(startDate, endDate)
      .then((readings) => {
        res.status(200).json({
          status: 200,
          message: " Get max temperuate by date range",
          reading: readings,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          status: 500,
          message: `Failed to get max temperature by date range /${error}`,
        });
      });
  }
);

//Get max precipitation in the last 5 Months for a specific sensor
readingController.get(
  "/readings/precipitation/max/fivemonths/:device_name/:date",
  auth(["admin", "student"]),
  (req, res) => {
    /*
         #swagger.summary = 'Get max precipitation by device name in 5 months, returning the sensor name, reading date / time and the precipitation value '
           #swagger.parameters['device_name'] = {
                in: 'path',
                description: 'Device name',
                type: 'string',
                default: 'Noosa_Sensor'
            }
            #swagger.parameters['date'] = {
                in: 'path',
                description: 'Data should be within 2020-12-01 ~ 2021-05-07',
                type: 'string',
                
            }
        
    
             #swagger.responses[200] = {
                description: 'Found max precipitation by device name',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                status: {
                                    type: 'number'
                                },
                                message: {
                                    type: 'string'
                                },
                                reading: {
                                    type: 'object',
                                    properties: {
                                        _id: {
                                            type: 'string'
                                        },
                                        device_name: {
                                            type: 'string'
                                        },
                                         time: {
                                            type: 'string'
                                        },
                                       precipitation_mmh: {
                                            type: 'number'
                                        },
                                    }
                                }
                            }
                        },
                    }
                }
            } 
    
            
            #swagger.responses[400] = {
                description: 'No Found max precipitation by device name',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                status: {
                                    type: 'number'
                                },
                                message: {
                                    type: 'string'
                                },
                               
                            }
                        },
                    }
                }
            } 
    
            #swagger.responses[500] = {
                description: 'Database error',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                status: {
                                    type: 'number'
                                },
                                message: {
                                    type: 'string'
                                },
                                
                            }
                        },
                    }
                }
            } 
      */

    const deviceName = req.params.device_name;
    const date = req.params.date;
    if (
      !(
        new Date(date) >= new Date("2020-07-31") &&
        new Date(date) <= new Date("2021-05-07")
      )
    ) {
      res.status(400).json({
        status: 400,
        message: "Date should be within 2020-07-31~2021-05-07",
      });
    }
    Readings.getMaxPrecipitation(deviceName, date)
      .then((readings) => {
        res.status(200).json({
          status: 200,
          message: " Get max precipitation by device name",
          reading: readings,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          status: 500,
          message: `Failed to get max temperature by date range /${error}`,
        });
      });
  }
);

// Create new weather station and reading P
readingController.post(
  "/readings/device_name/new-reading",
  auth(["weatherAdmin"]),
  (req, res) => {
    /*
    #swagger.summary = 'Create device name and a new reading'
    #swagger.requestBody = {
        description: 'Create device name and reading',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                        properties: {
                                 _id: {
                                     type: 'string'
                                 },
                                 device_name: {
                                     type: 'string'
                                 },
                                  time: {
                                     type: 'string'
                                 },
                                 latitude: {
                                     type: 'number'
                                 },
                                 longitude: {
                                     type: 'number'
                                 },
                                temp_c: {
                                     type: 'number'
                                 },
                                humidity_per: {
                                     type: 'number'
                                 },
                                  max_windspeede_ms: {
                                     type: 'number'
                                 },
                                  solar_radiation_wm2: {
                                     type: 'number'
                                 },
                                 vapour_pressure_kpa: {
                                     type: 'number'
                                 },
                                 wind_direction_deg: {
                                     type: 'number'
                                 },
                                precipitation_mmh: {
                                     type: 'number'
                                 },
                             }
                },
                example: { 
                precipitation_mmh:0.3,
                latitude:100,
                time:"2021-05-07T03:44:04.000+00:00",
                longitude:-20,
                temp_c:22,
                device_name:"Tafe _Sensor",
                atomospheric_pressure_kpa:129,
                max_windspeed_ms:4.94,
                solar_radiation_wm2:113,
                vapour_pressure_kpa:1.73,
                wind_direction_deg:155.6,
                humidity_per:73.90                             
              }
            }
        }
    } 
   #swagger.responses[200] = {
         description: 'new station and reading created',
         content: {
             'application/json': {
                 schema: {
                     type: 'object',
                     properties: {
                         status: {
                             type: 'number'
                         },
                         message: {
                             type: 'string'
                         },
                         reading: {
                             type: 'object',
                             properties: {
                                 _id: {
                                     type: 'string'
                                 },
                                 device_name: {
                                     type: 'string'
                                 },
                                  time: {
                                     type: 'string'
                                 },
                                 latitude: {
                                     type: 'number'
                                 },
                                 longitude: {
                                     type: 'number'
                                 },
                                temp_c: {
                                     type: 'number'
                                 },
                                humidity_per: {
                                     type: 'number'
                                 },
                                  max_windspeede_ms: {
                                     type: 'number'
                                 },
                                  solar_radiation_wm2: {
                                     type: 'number'
                                 },
                                 vapour_pressure_kpa: {
                                     type: 'number'
                                 },
                                 wind_direction_deg: {
                                     type: 'number'
                                 },
                                precipitation_mmh: {
                                     type: 'number'
                                 },
                             }
                         }
                     }
                 },
             }
         }
     } 

     #swagger.responses[400] = {
         description: 'Station and reading have not been created',
         content: {
             'application/json': {
                 schema: {
                     type: 'object',
                     properties: {
                         status: {
                             type: 'number'
                         },
                         message: {
                             type: 'string'
                         },
                        
                     }
                 },
             }
         }
     } 

    #swagger.responses[500] = {
        description: 'Database error',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'number'
                        },
                        message: {
                            type: 'string'
                        },
                       
                    }
                },
            }
        }
    } 
*/

    const weatherData = req.body;

    const newWeatherData = Readings.Reading(
      null,
      weatherData.device_name,
      weatherData.precipitation_mmh,
      weatherData.time,
      weatherData.latitude,
      weatherData.longitude,
      weatherData.atomospheric_pressure_kpa,
      weatherData.max_windspeed_ms,
      weatherData.solar_radiation_wm2,
      weatherData.vapour_pressure_kpa,
      weatherData.humidity_per,
      weatherData.wind_direction_deg,
      weatherData.temp_c
    );
    console.log(newWeatherData);
    Readings.createReading(newWeatherData)
      .then((reading) => {
        res.status(200).json({
          status: 200,
          message: "Created a weather data",
          reading: reading,
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: `Failed to create a weather data /${error}`,
        });
      });
  }
);
//Create multi Readings
readingController.post(
  "/readings/multi/readings",
  auth(["weatherAdmin"]),
  (req, res) => {
    /*
      #swagger.summary = 'Create device name and new multiple readings'
      #swagger.requestBody = {
          description: 'Create device name and readings',
          content: {
              'application/json': {
                  schema: {
                      type: 'object',
                          properties: {
                                   _id: {
                                       type: 'string'
                                   },
                                   device_name: {
                                       type: 'string'
                                   },
                                    time: {
                                       type: 'string'
                                   },
                                   latitude: {
                                       type: 'number'
                                   },
                                   longitude: {
                                       type: 'number'
                                   },
                                  temp_c: {
                                       type: 'number'
                                   },
                                  humidity_per: {
                                       type: 'number'
                                   },
                                    max_windspeede_ms: {
                                       type: 'number'
                                   },
                                    solar_radiation_wm2: {
                                       type: 'number'
                                   },
                                   vapour_pressure_kpa: {
                                       type: 'number'
                                   },
                                   wind_direction_deg: {
                                       type: 'number'
                                   },
                                  precipitation_mmh: {
                                       type: 'number'
                                   },
                               }
                  },
                  example: [{
                                "precipitation_mmh": 0.3,
                                "latitude": 152.77891,
                                "time": "2021-05-07T03:44:04.000+00:00",
                                "longitude": -26.95064,
                                "temp_c": 22,
                                "device_name": "Tafe _Sensor",
                                "atomospheric_pressure_kpa": 129,
                                "max_windspeed_ms": 4.94,
                                "solar_radiation_wm2": 113,
                                "vapour_pressure_kpa": 1.73,
                                "wind_direction_deg": 155.6,
                                "humidity_per": 73.9
                                },
                                {
                                "precipitation_mmh": 0.3,
                                "latitude": 152.77891,
                                "time": "2021-05-10T03:44:04.000+00:00",
                                "longitude": -26.95064,
                                "temp_c": 22,
                                "device_name": "Tafe _Sensor",
                                "atomospheric_pressure_kpa": 129,
                                "max_windspeed_ms": 4.94,
                                "solar_radiation_wm2": 113,
                                "vapour_pressure_kpa": 1.73,
                                "wind_direction_deg": 155.6,
                                "humidity_per": 73.9
                                },
                                ]
              }
          }
      } 
     #swagger.responses[200] = {
           description: 'new station and readings created',
           content: {
               'application/json': {
                   schema: {
                       type: 'object',
                       properties: {
                           status: {
                               type: 'number'
                           },
                           message: {
                               type: 'string'
                           },
                           reading: {
                               type: 'object',
                               properties: {
                                   _id: {
                                       type: 'string'
                                   },
                                   device_name: {
                                       type: 'string'
                                   },
                                    time: {
                                       type: 'string'
                                   },
                                   latitude: {
                                       type: 'number'
                                   },
                                   longitude: {
                                       type: 'number'
                                   },
                                  temp_c: {
                                       type: 'number'
                                   },
                                  humidity_per: {
                                       type: 'number'
                                   },
                                    max_windspeede_ms: {
                                       type: 'number'
                                   },
                                    solar_radiation_wm2: {
                                       type: 'number'
                                   },
                                   vapour_pressure_kpa: {
                                       type: 'number'
                                   },
                                   wind_direction_deg: {
                                       type: 'number'
                                   },
                                  precipitation_mmh: {
                                       type: 'number'
                                   },
                               }
                           }
                       }
                   },
               }
           }
       } 
  
       #swagger.responses[400] = {
           description: 'Station and reading have not been created',
           content: {
               'application/json': {
                   schema: {
                       type: 'object',
                       properties: {
                           status: {
                               type: 'number'
                           },
                           message: {
                               type: 'string'
                           },
                           
                       }
                   },
               }
           }
       } 
  
      #swagger.responses[500] = {
          description: 'Database error',
          content: {
              'application/json': {
                  schema: {
                      type: 'object',
                      properties: {
                          status: {
                              type: 'number'
                          },
                          message: {
                              type: 'string'
                          },
                         
                      }
                  },
              }
          }
      } 
  */

    const newWeatherReadings = req.body;
    const newWeatherData = newWeatherReadings.map((weatherData) =>
      Readings.Reading(
        null,
        weatherData.device_name,
        weatherData.precipitation_mmh,
        weatherData.time,
        weatherData.latitude,
        weatherData.longitude,
        weatherData.atomospheric_pressure_kpa,
        weatherData.max_windspeed_ms,
        weatherData.solar_radiation_wm2,
        weatherData.vapour_pressure_kpa,
        weatherData.humidity_per,
        weatherData.wind_direction_deg,
        weatherData.temp_c
      )
    );
    console.log(newWeatherData);
    Readings.createMultiReadings(newWeatherData)
      .then((reading) => {
        res.status(200).json({
          status: 200,
          message: "Created a weather data",
          reading: reading,
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: `Failed to create a weather data /${error}`,
        });
      });
  }
);

//Update precipitation
readingController.patch(
  "/readings/update/precipitation",
  auth(["admin", "student"]),
  (req, res) => {
    /*
  #swagger.summary = 'Update precipitation by ID'
  #swagger.requestBody = {
      description: 'Update precipitation',
      content: {
          'application/json': {
              schema: {
                  type: 'object',
                      properties: {
                               _id: {
                                   type: 'string'
                               },
                               device_name: {
                                   type: 'string'
                               },
                                time: {
                                   type: 'string'
                               },
                               latitude: {
                                   type: 'number'
                               },
                               longitude: {
                                   type: 'number'
                               },
                              temp_c: {
                                   type: 'number'
                               },
                              humidity_per: {
                                   type: 'number'
                               },
                                max_windspeede_ms: {
                                   type: 'number'
                               },
                                solar_radiation_wm2: {
                                   type: 'number'
                               },
                               vapour_pressure_kpa: {
                                   type: 'number'
                               },
                               wind_direction_deg: {
                                   type: 'number'
                               },
                              precipitation_mmh: {
                                   type: 'number'
                               },
                           }
              },
              example: { 
                _id:'64cf14ffb0529c53bbff6611',
                precipitation_mmh:0.3,
               
              }
          }
      }
  } 
 #swagger.responses[200] = {
       description: 'Updated precipitation by device name and DocumentID',
       content: {
           'application/json': {
               schema: {
                   type: 'object',
                   properties: {
                       status: {
                           type: 'number'
                       },
                       message: {
                           type: 'string'
                       },
                       reading: {
                           type: 'object',
                           properties: {
                               _id: {
                                   type: 'string'
                               },
                               device_name: {
                                   type: 'string'
                               },
                                time: {
                                   type: 'string'
                               },
                               latitude: {
                                   type: 'number'
                               },
                               longitude: {
                                   type: 'number'
                               },
                              temp_c: {
                                   type: 'number'
                               },
                              humidity_per: {
                                   type: 'number'
                               },
                                max_windspeede_ms: {
                                   type: 'number'
                               },
                                solar_radiation_wm2: {
                                   type: 'number'
                               },
                               vapour_pressure_kpa: {
                                   type: 'number'
                               },
                               wind_direction_deg: {
                                   type: 'number'
                               },
                              precipitation_mmh: {
                                   type: 'number'
                               },
                           }
                       }
                   }
               },
           }
       }
   } 

   #swagger.responses[400] = {
       description: 'precipitation by device name and DocumentID has not updated',
       content: {
           'application/json': {
               schema: {
                   type: 'object',
                   properties: {
                       status: {
                           type: 'number'
                       },
                       message: {
                           type: 'string'
                       },
                     
                   }
               },
           }
       }
   } 

  #swagger.responses[500] = {
      description: 'Database error',
      content: {
          'application/json': {
              schema: {
                  type: 'object',
                  properties: {
                      status: {
                          type: 'number'
                      },
                      message: {
                          type: 'string'
                      },
                      
                      }
                  }
              },
          }
      }
  } 
*/ const weatherData = req.body;

    const id = req.body._id;
    const precipitation = req.body.precipitation_mmh;

    Readings.updatePrecipitation(id, precipitation)
      .then((reading) => {
        console.log(reading);
        res.status(200).json({
          status: 200,
          message: "Updated precipiation",
          reading: reading,
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: `Failed to update precipiation /${error}`,
        });
      });
  }
);

//Update a reading
readingController.patch(
  "/readings/update/reading",
  auth(["admin", "student"]),
  (req, res) => {
    /*
    #swagger.summary = 'Update a existing reading'
    #swagger.requestBody = {
        description: 'Update precipitation',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                        properties: {
                                 _id: {
                                     type: 'string'
                                 },
                                 device_name: {
                                     type: 'string'
                                 },
                                  time: {
                                     type: 'string'
                                 },
                                 latitude: {
                                     type: 'number'
                                 },
                                 longitude: {
                                     type: 'number'
                                 },
                                temp_c: {
                                     type: 'number'
                                 },
                                humidity_per: {
                                     type: 'number'
                                 },
                                  max_windspeede_ms: {
                                     type: 'number'
                                 },
                                  solar_radiation_wm2: {
                                     type: 'number'
                                 },
                                 vapour_pressure_kpa: {
                                     type: 'number'
                                 },
                                 wind_direction_deg: {
                                     type: 'number'
                                 },
                                precipitation_mmh: {
                                     type: 'number'
                                 },
                             }
                },
                example:      { 
                                "id":"64cf14ffb0529c53bbff6611",
                                "precipitation_mmh": 0.3,
                                "latitude": 152.77891,
                                "time": "2021-05-07T03:44:04.000+00:00",
                                "longitude": -26.95064,
                                "temp_c": 22,
                                "device_name": "Woodford _Sensor",
                                "atomospheric_pressure_kpa": 129,
                                "max_windspeed_ms": 4.94,
                                "solar_radiation_wm2": 113,
                                "vapour_pressure_kpa": 1.73,
                                "wind_direction_deg": 155.6,
                                "humidity_per": 73.9
                                }
            }
        }
    } 
   #swagger.responses[200] = {
         description: 'Updated precipitation by device name and DocumentID',
         content: {
             'application/json': {
                 schema: {
                     type: 'object',
                     properties: {
                         status: {
                             type: 'number'
                         },
                         message: {
                             type: 'string'
                         },
                         reading: {
                             type: 'object',
                             properties: {
                                 _id: {
                                     type: 'string'
                                 },
                                 device_name: {
                                     type: 'string'
                                 },
                                  time: {
                                     type: 'string'
                                 },
                                 latitude: {
                                     type: 'number'
                                 },
                                 longitude: {
                                     type: 'number'
                                 },
                                temp_c: {
                                     type: 'number'
                                 },
                                humidity_per: {
                                     type: 'number'
                                 },
                                  max_windspeede_ms: {
                                     type: 'number'
                                 },
                                  solar_radiation_wm2: {
                                     type: 'number'
                                 },
                                 vapour_pressure_kpa: {
                                     type: 'number'
                                 },
                                 wind_direction_deg: {
                                     type: 'number'
                                 },
                                precipitation_mmh: {
                                     type: 'number'
                                 },
                             }
                         }
                     }
                 },
             }
         }
     } 
  
     #swagger.responses[400] = {
         description: 'precipitation by device name and DocumentID has not updated',
         content: {
             'application/json': {
                 schema: {
                     type: 'object',
                     properties: {
                         status: {
                             type: 'number'
                         },
                         message: {
                             type: 'string'
                         },
                         
                     }
                 },
             }
         }
     } 
  
    #swagger.responses[500] = {
        description: 'Database error',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'number'
                        },
                        message: {
                            type: 'string'
                        },
                       
                        }
                    }
                },
            }
        }
    } 
  */

    const weatherData = req.body;
    const id = req.body.id;

    Readings.updateReading(id, weatherData)
      .then((reading) => {
        console.log(reading);
        res.status(200).json({
          status: 200,
          message: "Updated a reading",
          reading: reading,
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: `Failed to update a reading /${error}`,
        });
      });
  }
);

//  Delete weather reading by ID DELETE
readingController.delete("/readings/:id", auth(["admin"]), (req, res) => {
  /*
 #swagger.summary = 'Delete reading by ID'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'Reading ID',
        type: 'string'
    } 
    #swagger.responses[200] = {
        description: 'Deleted reading',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'number'
                        },
                        message: {
                            type: 'string'
                        },
                    }
                },
            }
        }
    } 

     #swagger.responses[400] = {
        description: 'Reading is not deleted',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'number'
                        },
                        message: {
                            type: 'string'
                        },
                    }
                },
            }
        }
    } 

     #swagger.responses[500] = {
        description: 'Database error',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'number'
                        },
                        message: {
                            type: 'string'
                        },
                    }
                },
            }
        }
    } 
*/
  const id = req.params.id;
  Readings.deleteReadingByID(id)
    .then((result) => {
      res.status(200).json({
        status: 200,
        message: "Deleted a weather data with ID",
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: `Failed to delete a weather data with ID /${error}`,
      });
    });
});

export default readingController;
