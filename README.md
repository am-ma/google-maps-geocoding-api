# google-maps-geocoding-api

CSVを食わせるといい感じで座標を取得し、CSVを吐くCLIツール

## install

```sh
$ git clone {git url}
$ cd ./google-maps-geocoding-api
$ npm i
$ npm link
```

## usage

### config

`.env.example`をコピー→`.env`にしてご利用ください

### command

食わせるCSVのフォーマットは`address-example.csv`を参照

```sh
$ github-issues /path/to/address.csv
```
