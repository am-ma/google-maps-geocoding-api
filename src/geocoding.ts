import { config } from "dotenv";
import * as csv from "csv";
import * as fs from "fs";
import { Client, LatLngLiteral } from "@googlemaps/google-maps-services-js";
import { TAddressCsvRow } from "./type";

const getApiKey = () => config().parsed.GOOGLE_API_KEY;

const getGeocode = async (address: string): Promise<LatLngLiteral> => {
  const client = new Client({});

  try {
    const result = await client.geocode({
      params: {
        address,
        key: getApiKey(),
      },
      timeout: 1000, // milliseconds
    });

    return result.data.results[0].geometry.location;
  } catch (error) {
    throw new Error(error);
  }
};

const getGeocodeByAddressCsv = async (csvPath: string) => {
  const addressCsv = await loadAddressesFromCsv(csvPath);

  const stream = fs.createWriteStream(makeExportFileName());
  stream.on("error", (err) => {
    if (err) {
      throw err;
    }
  });
  try {
    stream.write([...Object.keys(addressCsv[0]), "lat", "lng"].join(","));
    stream.write("\n");
    for (const addressRow of addressCsv) {
      const { lat, lng } = await getGeocode(addressRow.address);

      const data = [
        ...Object.values(addressRow),
        lat.toString(),
        lng.toString(),
      ];
      stream.write(data.join(","));
      stream.write("\n");
    }
  } catch (error) {
    throw new Error(error);
  } finally {
    stream.end();
  }
};
const _getGeocodeByAddressCsv = async (csvPath: string) => {
  try {
    const addressCsv = await loadAddressesFromCsv(csvPath);

    const data = addressCsv.map(async (addressRow): Promise<TAddressCsvRow> => {
      const { lat, lng } = await getGeocode(addressRow.address);

      return {
        ...addressRow,
        lat: lat.toString(),
        lng: lng.toString(),
      };
    });

    await exportCsv(await Promise.all(data));
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const loadAddressesFromCsv = (csvPath: string): Promise<TAddressCsvRow[]> =>
  new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(csvPath)
      .pipe(
        csv.parse((_, records) => {
          const csvHeader = records[0] as string[];
          const csvBody = records.slice(1) as string[][];
          const invalid = csvBody.some(
            (row) =>
              row.length !== csvHeader.length ||
              csvHeader[0] !== "address" ||
              row[0] === ""
          );
          if (invalid) {
            throw new Error("CSVフォーマットが不正です");
          }

          const addresses = csvBody.map((row): TAddressCsvRow => {
            const result: TAddressCsvRow = { address: "" };
            row.forEach((col, index) => {
              result[csvHeader[index]] = col;
            });

            return result;
          });

          data.push(...addresses);
        })
      )
      .on("error", (error) => {
        reject(error);
      })
      .on("end", () => {
        resolve(data);
      });
  });

const makeExportFileName = () => {
  const dateNow = new Date();
  const now = `${dateNow.getFullYear()}${
    dateNow.getMonth() + 1
  }${dateNow.getDate()}${dateNow.getHours()}${dateNow.getMinutes()}${dateNow.getSeconds()}`;
  return `geocode_${now}.csv`;
};

const exportCsv = (addressCsv: TAddressCsvRow[]): Promise<void> =>
  new Promise((resolve, reject) => {
    if (addressCsv.length <= 0) {
      throw new Error("CSVが空です。");
    }
    const csvData = [
      Object.keys(addressCsv[0]),
      ...addressCsv.map((addressRow) => Object.values(addressRow)),
    ];
    csv.stringify(csvData, (error, output) => {
      if (error) {
        reject(error);
        return;
      }
      const fileName = makeExportFileName();
      fs.writeFile(fileName, output, (er) => {
        if (er) {
          reject(er);
          return;
        }
        console.log(fileName + "を出力しました。");
        resolve();
      });
    });
  });

export { getGeocode, getGeocodeByAddressCsv, loadAddressesFromCsv, exportCsv };
