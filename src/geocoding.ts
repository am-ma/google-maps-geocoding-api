
import { config } from "dotenv";
import { Client, LatLngLiteral } from "@googlemaps/google-maps-services-js"

const getApiKey = () => config().parsed.GOOGLE_API_KEY;

const getGeocode = async (address: string): Promise<LatLngLiteral> => {
  const client = new Client({});
  
  try {
    const result = await client.geocode({
      params: {
        address,
        key: getApiKey(),
      },
      timeout: 500, // milliseconds
    });

    return result.data.results[0].geometry.location;
  } catch (error) {
    console.log(error);
  }
};

export {
  getGeocode,
};
