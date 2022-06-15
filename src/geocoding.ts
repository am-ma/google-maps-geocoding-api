
import { config } from "dotenv";
import { Client } from "@googlemaps/google-maps-services-js"

const getApiKey = () => config().parsed.GOOGLE_API_KEY;

const getGeocode = () => {
  const client = new Client({});
  
  client
    .geocode({
      params: {
        address: "福岡県福岡市博多区博多駅前1-1",
        key: getApiKey(),
      },
      timeout: 500, // milliseconds
    })
    .then(r => {
      const location = r.data.results[0].geometry.location;
      console.log(location.lat, location.lng);
    })
    .catch(e => {
      console.log(e);
    });
};

export {
  getGeocode,
};
