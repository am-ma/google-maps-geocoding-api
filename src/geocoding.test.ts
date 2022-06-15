import { getGeocode, loadAddressesFromCsv } from "./geocoding";

describe('Geocoding', () => {
  // describe('getGeocode', () => {
  //   it('should return', async () => {
  //     const result = await getGeocode("福岡県福岡市博多区博多駅前1-1");
  //     expect(result.lat).toBe(33.5904778);
  //     expect(result.lng).toBe(130.4172874);
  //   });
  // });

  describe('loadAddressesFromCsv', () => {
    it('should return TAddressCsvRow[]', async () => {
      const result = await loadAddressesFromCsv(__dirname+"/address.example.csv");
      expect(result[0]).toEqual({
        address: '福岡県福岡市博多区博多駅前1-1',
        something_else: 'something_else',
        you_want: 'you_want',
        to_add: 'to_add'
      });
      expect(result[1]).toEqual({
        address: '福岡県福岡市博多区博多駅前1-2',
        something_else: 'something_else',
        you_want: 'you_want',
        to_add: 'to_add'
      });
    });
  });
});