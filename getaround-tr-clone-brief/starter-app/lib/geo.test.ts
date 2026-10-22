import { describe, expect, it } from "vitest";
import { distanceInKilometers, formatDistance } from "./geo";

describe("GPS distance helpers", () => {
  it("calculates a useful Istanbul neighbourhood distance", () => {
    const distance = distanceInKilometers({ lat: 40.9906, lng: 29.0271 }, { lat: 41.0433, lng: 29.0094 });
    expect(distance).toBeGreaterThan(5);
    expect(distance).toBeLessThan(7);
  });

  it("formats near and far distances", () => {
    expect(formatDistance(0.35)).toBe("350 m");
    expect(formatDistance(2.45)).toBe("2.5 km");
  });
});
