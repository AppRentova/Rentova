import { expect, test } from "@playwright/test";

test("desktop map shows price pins and vehicle details on hover", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/search");

  await expect(page.locator(".vehicle-map")).toHaveAttribute("data-marker-count", "10");
  await page.locator(".search-result-card").first().hover();

  const popup = page.locator(".map-popup-card");
  await expect(popup).toBeVisible();
  await expect(popup).toContainText("Renault Clio");
  await expect(popup.getByRole("link", { name: "View car details" })).toHaveAttribute("href", "/cars/renault-clio-kadikoy");
  await page.screenshot({ path: testInfo.outputPath("desktop-map.png"), fullPage: true });
});

test("mobile defers map traffic until the user opens it", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const tileRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("tiles.openfreemap.org")) tileRequests.push(request.url());
  });

  await page.goto("/search");
  const mobileMenu = page.locator(".mobile-navigation summary");
  await mobileMenu.click();
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
  await mobileMenu.click();
  const openMap = page.getByRole("button", { name: "Map", exact: true });
  await expect(openMap).toBeVisible();
  expect(tileRequests).toHaveLength(0);

  await openMap.click();
  await expect(page.locator(".vehicle-map")).toHaveAttribute("data-marker-count", "10");
  await page.getByRole("button", { name: "List", exact: true }).click();
  await page.locator(".search-result-card").first().hover();
  await page.getByRole("button", { name: "Map", exact: true }).click();
  await expect(page.locator(".map-popup-card")).toContainText("Renault Clio");
  expect(tileRequests.length).toBeGreaterThan(0);
  await page.screenshot({ path: testInfo.outputPath("mobile-map.png"), fullPage: true });
});

test("GPS sorts nearby cars and places the user on the map", async ({ context, page }) => {
  await context.grantPermissions(["geolocation"], { origin: "http://127.0.0.1:3100" });
  await context.setGeolocation({ latitude: 41.02, longitude: 29.0 });
  await page.goto("/search");
  await page.getByRole("button", { name: "Use my location" }).click();
  await expect(page.getByRole("status")).toContainText("cars within 35 km");
  await expect(page.locator(".results-heading")).toContainText("Sorted by GPS distance");
  await expect(page.locator(".vehicle-map")).toHaveAttribute("data-marker-count", "10");
});

test("owner can capture GPS and save a local vehicle draft", async ({ context, page }, testInfo) => {
  await context.grantPermissions(["geolocation"], { origin: "http://127.0.0.1:3100" });
  await context.setGeolocation({ latitude: 40.991, longitude: 29.027 });
  await page.goto("/owner");
  await page.getByLabel("Make").fill("Honda");
  await page.getByLabel("Model").fill("Civic");
  await page.getByLabel("Year").fill("2025");
  await page.getByLabel("Plate").fill("34 TEST 34");
  await page.getByLabel("District").fill("Kadıköy");
  await page.getByRole("button", { name: "Capture vehicle location" }).click();
  await expect(page.getByText("Approximate location captured", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Save vehicle draft" }).click();
  await expect(page.getByText("Honda Civic")).toBeVisible();
  await expect(page.getByText("Draft", { exact: true })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("owner-gps-draft.png"), fullPage: true });
});
