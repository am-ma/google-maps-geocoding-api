#! /usr/bin/env node
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const geocoding_1 = require("./geocoding");
const args = process.argv.slice(2);
(0, geocoding_1.getGeocodeByAddressCsv)(args[0])
    .then(() => {
    console.log("成功");
})
    .catch((err) => {
    console.log("失敗：" + err);
});
//# sourceMappingURL=get-geocode.js.map