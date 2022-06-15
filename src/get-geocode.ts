#! /usr/bin/env node
'use strict';

import { getGeocodeByAddressCsv } from "./geocoding";

const args = process.argv.slice(2);
getGeocodeByAddressCsv(args[0])
  .then(() => {
    console.log("成功");
  })
  .catch((err) => {
    console.log("失敗：" + err);
  });