import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import OpenAI from "openai";
import axios from 'axios';

let conversationHistory = [];

const PORT = 5001;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const openai = new OpenAI({
  apiKey:
    "", // Add your OpenAI API key here
});

const BACKEND_BASE_URL = 'http://localhost:5000';

async function fetchAllData() {

  // Fetch data from all endpoints
  try {
    const endpoints = [
      '/status',
      '/electricityConsumption',
      '/activeChargers',
      '/activePassengers',
      '/taxisWithPassengers',
      '/averagePassengerWaitTime',
      '/batteryLevels',
      '/passengerUnsatisfaction',
      '/vehicle_positions',
      '/passenger_positions',
      '/charger_positions', 
    ];

    const requests = endpoints.map((endpoint) =>
      axios.get(`${BACKEND_BASE_URL}${endpoint}`)
    );

    const responses = await Promise.all(requests);

    const data = {};

    // Store data in an object with keys as endpoint names
    endpoints.forEach((endpoint, index) => {
      const key = endpoint.replace('/', '');
      data[key] = responses[index].data;
    });

    return data;
  } catch (error) {
    console.error('Error fetching data from backend:', error);
    throw error;
  }
}

app.post("/", async (req, res) => {
  // Get the message from the user
  const message = req.body.message;
  conversationHistory.push({ role: "user", content: message });

  // Fetch data from all endpoints
  const data = await fetchAllData();
  const dataString = JSON.stringify(data, null, 4);
  console.log(dataString);

  // Send the message to the OpenAI API
  const response = await openai.chat.completions.create({
    model: "o1-mini",
    messages: [
     {role: "user", content: `
      You are an experienced data analysis expert proficient in interpreting JSON data. When I provide you with JSON datasets, please analyze the data and answer my questions accurately and comprehensively. Ensure that your responses are concise and effective. Do not show me your reasoning process. If additional information or clarification is needed to answer my questions effectively, feel free to ask. If you are unable to answer a question given the input JSON dataset, simply say, "I am unable to answer this question given the input JSON dataset." If you are asked an irrelevant question with respect to the dataset, respond with, "This question is irrelevant to the dataset." Make sure your response is human readable.

An example JSON dataset might look like this: 
{
  status: {
  "data": {
    "num_active_chargers": 10,
    "num_people_in_sim": 0,
    "num_taxis_in_sim": 10,
    "num_taxis_out_of_commission": 0,
    "simulation_time": 68.82
  },
  "status": "success"
}
  electricityConsumption: {
  "data": {
    "taxi_0": 115.21273357407324,
    "taxi_1": 35.865328128552996,
    "taxi_2": 25.391447680462942,
    "taxi_3": 46.18182966448174,
    "taxi_4": 27.68118104798303,
    "taxi_5": 68.94170830306749,
    "taxi_6": 148.08285476799836,
    "taxi_7": 124.87867452564664,
    "taxi_8": 119.25214839724251,
    "taxi_9": 114.13571274726516,
    "time": 101.36
  },
  "status": "success"
},
  activeChargers: {
  "data": {
    "active_chargers": 0,
    "time": 110.27
  },
  "status": "success"
},
  activePassengers: {
  "data": {
    "active_passengers": 0,
    "time": 115.53
  },
  "status": "success"
},
  taxisWithPassengers:{
  "data": {
    "taxis_with_passengers": 0,
    "time": 131.72
  },
  "status": "success"
},
  averagePassengerWaitTime: {
  "data": {
    "average_wait_time": 0.0
  },
  "status": "success"
},
  batteryLevels: {
  "data": {
    "taxi_0": 40.649125,
    "taxi_1": 56.7275,
    "taxi_2": 99.251375,
    "taxi_3": 60.07225,
    "taxi_4": 98.27862499999999,
    "taxi_5": 70.016625,
    "taxi_6": 47.187124999999995,
    "taxi_7": 44.121,
    "taxi_8": 99.68575,
    "taxi_9": 97.166625
  },
  "status": "success"
},
  passengerUnsatisfaction:{
  "data": {
    "time": 172.01,
    "total_started": 0,
    "unsatisfied_count": 0,
    "unsatisfied_rate": 0.0
  },
  "status": "success"
},
  vehicle_positions: {
  "data": {
    "taxi_0": {
      "lat": 29.729853484321794,
      "lon": -95.35592199576924
    },
    "taxi_1": {
      "lat": 29.733384126637855,
      "lon": -95.36334463934477
    },
    "taxi_2": {
      "lat": 29.735737071305007,
      "lon": -95.34697344818069
    },
    "taxi_3": {
      "lat": 29.731378498156193,
      "lon": -95.35982784717984
    },
    "taxi_4": {
      "lat": 29.728042251913156,
      "lon": -95.35005109034091
    },
    "taxi_5": {
      "lat": 29.73811050109419,
      "lon": -95.36205650859918
    },
    "taxi_6": {
      "lat": 29.73222360178566,
      "lon": -95.35202144623409
    },
    "taxi_7": {
      "lat": 29.734510489691026,
      "lon": -95.36515353196691
    },
    "taxi_8": {
      "lat": 29.736195128585045,
      "lon": -95.35883844195662
    },
    "taxi_9": {
      "lat": 29.732748493882895,
      "lon": -95.34865732778619
    }
  },
  "status": "success"
}, 
  passenger_positions: {
    data: {
      person_0: { lat: 29.728311373291028, lon: -95.34871489709263 },
      person_1: { lat: 29.73038081535124, lon: -95.36579651100524 },
      person_10: { lat: 29.741465026698364, lon: -95.35936580382234 },
      person_11: { lat: 29.729727385447056, lon: -95.34613120778015 },
      person_12: { lat: 29.731698936535718, lon: -95.35066621638393 },
      person_13: { lat: 29.734163915741462, lon: -95.36782015040745 },
      person_14: { lat: 29.73948174896015, lon: -95.35983355409299 },
      person_2: { lat: 29.738184414249186, lon: -95.35070272132349 },
      person_3: { lat: 29.737301298317437, lon: -95.35497439010625 },
      person_4: { lat: 29.73562853099871, lon: -95.35563312385239 },
      person_5: { lat: 29.73492920208043, lon: -95.35306596284758 },
      person_6: { lat: 29.73733422415115, lon: -95.34643026290892 },
      person_7: { lat: 29.732567330616515, lon: -95.35036003808828 },
      person_8: { lat: 29.727026838469058, lon: -95.3540438484876 },
      person_9: { lat: 29.737267823259568, lon: -95.345815027619 }
    },
    status: 'success'
  }, 
  charger_positions: {
  "data": {
    "charger_0": {
      "lat": 29.72760510532962,
      "lon": -95.35055849652953
    },
    "charger_1": {
      "lat": 29.73330105778871,
      "lon": -95.36210673429879
    },
    "charger_2": {
      "lat": 29.735538848627545,
      "lon": -95.35376455111579
    },
    "charger_3": {
      "lat": 29.727297772090484,
      "lon": -95.34445470693574
    },
    "charger_4": {
      "lat": 29.72944076264863,
      "lon": -95.36525230184158
    },
    "charger_5": {
      "lat": 29.74185056022586,
      "lon": -95.35921884685918
    },
    "charger_6": {
      "lat": 29.732332328234783,
      "lon": -95.34809213161365
    },
    "charger_7": {
      "lat": 29.734725964823646,
      "lon": -95.35605412886876
    },
    "charger_8": {
      "lat": 29.73845280403254,
      "lon": -95.34538347562705
    },
    "charger_9": {
      "lat": 29.7373116176466,
      "lon": -95.343622584521
    }
  },
  "status": "success"
}
}

Status.data tells you the current total number of chargers, total number of passengers, total number of taxis, and the simulation time in the simulator. 

electricityConsumption.data tells you the cumulative electricity consumption of each taxi in the simulator.

activeChargers.data tells you the number of chargers that are currently being used. 
activePassengers.data tells you the number of passengers that are currently in the simulator.
taxisWithPassengers.data tells you the number of taxis that currently have passengers.
averagePassengerWaitTime.data tells you the average wait time of passengers in the simulator.
batteryLevels.data tells you the current battery levels of each taxi in the simulator.
passengerUnsatisfaction.data tells you the percentage of passengers that are unsatisfied with the service.
vehicle_positions.data tells you the current position of each taxi in the simulator.
passenger_positions.data tells you the current position of each passenger in the simulator.
charger_positions.data tells you the current position of each charger in the simulator.

'lat" and "lon" are the latitude and longitude coordinates of the taxis and passengers.
"people" and "passengers" are used interchangeably in the dataset.

Here is an example of a question I might ask:
"How many passengers are currently in the simulator?"
A good answer would be:
"There are currently 15 passengers in the simulator."

Another example:
"Where is taxi_1 currently located?"
A good answer would be:
"Taxi_1 is currently located at (x, y) coordinates."

Another example:
"What is the average wait time of passengers in the simulator?"
A good answer would be:
"The average wait time of passengers in the simulator is 0."

Another example:
"What is the current battery level of taxi_3?"
A good answer would be:
"The current battery level of taxi_3 is 48.62582857142858."

For any question, assume that I have "in the simulation" at the beginning of the question. 

You don't need quotation marks around the answers.

Now, this is the actual JSON dataset ${dataString} and answer the following questions:
${message}`}
    ],
    temperature: 1,
    max_completion_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    response_format: {
      type: "text",
    },
  });

  conversationHistory.push({ role: "assistant", content: response.choices[0].message.content });

  // Send the response back to the user
  res.json({
    message: response.choices[0].message.content,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});