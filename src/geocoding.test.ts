import { getGeocode } from "./geocoding";

describe('Geocoding', () => {
  describe('getGeocode', () => {
    it('should return', async () => {
      const result = await getGeocode("福岡県福岡市博多区博多駅前1-1");
      expect(result.lat).toBe(33.5904778);
      expect(result.lng).toBe(130.4172874);
    });
  });
});