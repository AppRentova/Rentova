import { expect, test } from "@playwright/test";

test("sign-in page supports password reveal and submission feedback", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/login");

  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await page.getByLabel("Email address").fill("driver@rentova.com");
  await page.getByLabel("Password", { exact: true }).fill("rentova-demo");
  await page.getByRole("button", { name: "Show password" }).click();
  await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute("type", "text");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("status")).toContainText("Supabase Auth");
  await page.screenshot({ path: testInfo.outputPath("sign-in-page.png"), fullPage: true });
});

test("search toolbar opens the accessible rental calendar", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/search");

  await expect(page.getByLabel("Pick-up location")).toHaveValue(/Istanbul$/);
  await page.getByRole("button", { name: /Pick-up/ }).click();
  await expect(page.getByRole("application", { name: /Rental period/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "Previous month" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Next month" })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("rental-calendar.png"), fullPage: true });
});
