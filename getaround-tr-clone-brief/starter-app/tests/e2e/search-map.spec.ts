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
