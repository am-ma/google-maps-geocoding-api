"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const geocoding_1 = require("./geocoding");
describe("Geocoding", () => {
    // NOTE: 実際に疎通確認するのでコメントアウト
    // describe('getGeocode', () => {
    //   it('should return location', async () => {
    //     const result = await getGeocode("福岡県福岡市博多区博多駅前1-1");
    //     expect(result.lat).toBe(33.5904778);
    //     expect(result.lng).toBe(130.4194761);
    //   });
    // });
    describe("loadAddressesFromCsv", () => {
        it("should return TAddressCsvRow[]", async () => {
            const result = await (0, geocoding_1.loadAddressesFromCsv)(__dirname + "/address.example.csv");
            expect(result[0]).toEqual({
                address: "福岡県福岡市博多区博多駅前1-1",
                something_else: "something_else",
                you_want: "you_want",
                to_add: "to_add",
            });
            expect(result[1]).toEqual({
                address: "福岡県福岡市博多区博多駅前1-2",
                something_else: "something_else",
                you_want: "you_want",
                to_add: "to_add",
            });
        });
    });
    // NOTE: 面倒なので手動テストする
    // describe('loadAddressesFromCsv', () => {
    //   it('should exported csv', async () => {
    //     const addressCsv: TAddressCsvRow[] = [
    //       {address: "address1", hoge: "hoge1", fuga: "fuga1"},
    //       {address: "address2", hoge: "hoge2", fuga: ""},
    //     ];
    //     await exportCsv(addressCsv);
    //     expect(true).toBeTruthy();
    //   });
    // });
});
//# sourceMappingURL=geocoding.test.js.map