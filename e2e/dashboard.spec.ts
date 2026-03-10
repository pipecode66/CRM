import { expect, test } from "@playwright/test";

test("redirects to localized dashboard", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/es\/dashboard/);
  await expect(page.getByRole("heading", { name: "MÃ©tricas en tiempo real" })).toBeVisible();
});

