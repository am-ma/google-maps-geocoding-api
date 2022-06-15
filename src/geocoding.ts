
import { config } from "dotenv";
import * as csv from "csv";
import { Client, LatLngLiteral } from "@googlemaps/google-maps-services-js"
import { TAddressCsvRow } from "./type";
const fs = require("fs");

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

const loadAddressesFromCsv = (csvPath: string): Promise<TAddressCsvRow[]> => 
  new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(csvPath)
      .pipe(csv.parse((_, records) => {
        const csvHeader = records[0] as string[];
        const csvBody = records.slice(1) as string[][];
        const invalid = csvBody.some(row => 
          row.length !== csvHeader.length
          || csvHeader[0] !== 'address'
          || row[0] === ''
        );
        if (invalid) {
          throw new Error("CSVフォーマットが不正です");
        }
      
        const addresses = csvBody.map((row): TAddressCsvRow => {
          const result: TAddressCsvRow = {address: ''};
          row.forEach((col, index) => {
            result[csvHeader[index]] = col;
          });
      
          return result;
        });
      
        data.push(...addresses);
      }))
      .on('error', error => {
        reject(error);
      })
      .on('end', () => {
        resolve(data);
      });
  });

export {
  getGeocode,
  loadAddressesFromCsv,
};
