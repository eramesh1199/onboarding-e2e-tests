import { test, expect } from "@playwright/test";
const { chromium } = require("playwright");

let browser;
let context;
let page;

test.beforeEach(async () => {
  browser = await chromium.launch();
  context = await browser.newContext({
    storageState: "e2e/sessions/storageState.json",
  });
  page = await context.newPage();
  await page.waitForLoadState("networkidle");
  await page.goto("/nr1-core/install-newrelic/installation-plan?e2e-test&");
});

test.afterEach(async () => {
  await context.close();
});

test.afterAll(async () => {
  await browser.close();
});

test("should guide on steps to install Docker", async () => {
  test.slow();

  await page.getByRole("radio", { name: "Docker" }).click();

  await page
    .getByRole("button", { name: "Select your environment (Docker)" })
    .isVisible();

  await page.getByRole("button", { name: "Begin installation" }).click();

  await page
    .getByText(
      "The New Relic infrastructure agent monitors Docker on your host automatically."
    )
    .isVisible();

  await page.getByText("NRIA_LICENSE_KEY").isVisible();

  const [docsLink] = await Promise.all([
    page.waitForEvent("popup"),
    page.getByRole("link", { name: "See our docs" }).click(),
  ]);

  await page
    .getByRole("heading", { name: "Guided install overview" })
    .isVisible();

  await docsLink.close();

  await page.getByText("Give feedback").click();

  await expect(page.getByText("Help us improve New Relic One")).toBeVisible();

  await page.getByRole("button", { name: "Close modal" }).click();

  //await page.getByRole('button', { name: 'Back' }).click();
});