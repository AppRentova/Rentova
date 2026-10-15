import { describe, expect, it } from "vitest";
import { bookingSchema } from "./validation";

describe("bookingSchema", () => {
  it("accepts a valid booking window", () => {
    const result = bookingSchema.safeParse({ vehicleId: "vehicle_1", startsAt: "2026-10-18T10:00:00Z", endsAt: "2026-10-19T10:00:00Z", protectionPlan: "STANDARD", additionalDriver: false, idempotencyKey: "f44cc4b4-4f56-4df5-88e8-f97b49a0dbdb" });
    expect(result.success).toBe(true);
  });

  it("rejects an overlapping negative booking window", () => {
    const result = bookingSchema.safeParse({ vehicleId: "vehicle_1", startsAt: "2026-10-19T10:00:00Z", endsAt: "2026-10-18T10:00:00Z", protectionPlan: "STANDARD", additionalDriver: false, idempotencyKey: "f44cc4b4-4f56-4df5-88e8-f97b49a0dbdb" });
    expect(result.success).toBe(false);
  });
});
