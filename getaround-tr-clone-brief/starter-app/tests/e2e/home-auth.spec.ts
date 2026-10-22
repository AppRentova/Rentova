import { expect, test } from "@playwright/test";

test("home booking form uses GPS and the supplied calendar component", async ({ context, page }, testInfo) => {
  await context.grantPermissions(["geolocation"], { origin: "http://127.0.0.1:3100" });
  await context.setGeolocation({ latitude: 40.991, longitude: 29.027 });
  await page.goto("/");

  await page.getByRole("button", { name: "Use my current location" }).click();
  await expect(page.getByLabel("Pick-up location")).toHaveValue("40.99100, 29.02700");
  await expect(page.getByRole("status")).toContainText("Current location added");
  await page.getByRole("button", { name: /Pick-up: / }).click();
  await expect(page.getByRole("application", { name: /Pick-up date/ })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("home-gps-calendar.png"), fullPage: true });
});

test("create account page validates input and profile requires authentication", async ({ page }) => {
  await page.goto("/register");
  await expect(page.getByRole("heading", { name: "Create account" })).toBeVisible();
  await page.getByLabel("Full name").fill("Rentova Test");
  await page.getByLabel("Email address").fill("test@rentova.example");
  await page.getByLabel("Password", { exact: true }).fill("secret12");
  await page.getByLabel("Confirm password").fill("different12");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByText("Passwords do not match.", { exact: true })).toBeVisible();

  await page.goto("/profile");
  await expect(page).toHaveURL(/\/login$/);
});
