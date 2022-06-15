"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportCsv = exports.loadAddressesFromCsv = exports.getGeocodeByAddressCsv = exports.getGeocode = void 0;
const dotenv_1 = require("dotenv");
const csv = __importStar(require("csv"));
const google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
const fs = require("fs");
const getApiKey = () => (0, dotenv_1.config)().parsed.GOOGLE_API_KEY;
const getGeocode = async (address) => {
    const client = new google_maps_services_js_1.Client({});
    try {
        const result = await client.geocode({
            params: {
                address,
                key: getApiKey(),
            },
            timeout: 500, // milliseconds
        });
        return result.data.results[0].geometry.location;
    }
    catch (error) {
        console.log(error);
    }
};
exports.getGeocode = getGeocode;
const getGeocodeByAddressCsv = async (csvPath) => {
    try {
        const addressCsv = await loadAddressesFromCsv(csvPath);
        const data = addressCsv.map(async (addressRow) => {
            const { lat, lng } = await getGeocode(addressRow.address);
            return {
                ...addressRow,
                lat: lat.toString(),
                lng: lng.toString(),
            };
        });
        await exportCsv(await Promise.all(data));
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.getGeocodeByAddressCsv = getGeocodeByAddressCsv;
const loadAddressesFromCsv = (csvPath) => new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(csvPath)
        .pipe(csv.parse((_, records) => {
        const csvHeader = records[0];
        const csvBody = records.slice(1);
        const invalid = csvBody.some(row => row.length !== csvHeader.length
            || csvHeader[0] !== 'address'
            || row[0] === '');
        if (invalid) {
            throw new Error("CSVフォーマットが不正です");
        }
        const addresses = csvBody.map((row) => {
            const result = { address: '' };
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
exports.loadAddressesFromCsv = loadAddressesFromCsv;
const exportCsv = (addressCsv) => new Promise((resolve, reject) => {
    if (addressCsv.length <= 0) {
        throw new Error("CSVが空です。");
    }
    const csvData = [
        Object.keys(addressCsv[0]),
        ...addressCsv.map(addressRow => Object.values(addressRow)),
    ];
    console.log(csvData);
    csv.stringify(csvData, (error, output) => {
        if (error) {
            reject(error);
            return;
        }
        const dateNow = new Date();
        const now = `${dateNow.getFullYear()}${dateNow.getMonth() + 1}${dateNow.getDate()}${dateNow.getHours()}${dateNow.getMinutes()}${dateNow.getSeconds()}`;
        const fileName = `geocode_${now}.csv`;
        fs.writeFile(fileName, output, (error) => {
            if (error) {
                reject(error);
                return;
            }
            console.log(fileName + 'を出力しました。');
            resolve();
        });
    });
});
exports.exportCsv = exportCsv;
//# sourceMappingURL=geocoding.js.map