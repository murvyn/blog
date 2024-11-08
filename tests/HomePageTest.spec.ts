import { test, expect } from "@playwright/test";
const links = [
  { text: "News", url: "https://blog.hubtel.com/category/news/" },
  {
    text: "Press Releases",
    url: "https://blog.hubtel.com/category/press-releases/",
  },
  {
    text: "Customer Stories",
    url: "https://blog.hubtel.com/category/customer-stories/",
  },
  {
    text: "Product Updates",
    url: "https://blog.hubtel.com/category/product-updates/",
  },
  { text: "Guides", url: "https://blog.hubtel.com/category/guides/" },
  {
    text: "Inside Hubtel",
    url: "https://blog.hubtel.com/category/inside-hubtel/",
  },
];

test.describe("basics", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://blog.hubtel.com/");
  });
  test.afterEach(async ({ page }) => {
    await page.close();
  });

  test("Verify that the logo is displayed", async ({ page }) => {
    const nav = page.locator("nav.navbar a.navbar-brand");
    const logoImg = nav.getByRole("img");
    await expect(logoImg).toHaveAttribute(
      "src",
      "https://blog.hubtel.com/wp-content/themes/bloghubtel/images/logo.png"
    );
  });

  test("Verify header contains correct links", async ({ page }) => {
    const navbar = page.locator("nav.navbar");
    const blog = navbar.getByRole("link", { name: " Blog " });
    await expect(blog).toBeVisible();
    await expect(blog).toHaveAttribute("href", "https://blog.hubtel.com");

    for (const link of links) {
      const navLink = navbar.locator(`a:has-text("${link.text}")`);
      await expect(navLink).toBeVisible();
      await expect(navLink).toHaveAttribute("href", link.url);
    }
  });

  test("Verify that links lead to their urls", async ({ page }) => {
    const navbar = page.locator("nav.navbar");
    for (const link of links) {
      await navbar.locator(`a:has-text("${link.text}")`).click();
      const url = page.url();
      expect(url).toEqual(link.url);
      await page.goBack();
    }
  });
  test("Verify that links collapse when view size is reduced", async ({
    page,
  }) => {
    const navbar = page.locator("nav.navbar");
    await page.setViewportSize({ width: 768, height: 880 });
    const button = navbar.locator("button");
    await expect(button).toBeVisible();

    for (const link of links) {
      const navLink = navbar.locator(`a:has-text("${link.text}")`);
      await expect(navLink).not.toBeVisible();
    }

    await button.click();
    for (const link of links) {
      const collapseLink = navbar.locator(`a:has-text("${link.text}")`);
      await expect(collapseLink).toBeVisible();
    }
    for (const link of links) {
      await navbar.locator(`a:has-text("${link.text}")`).click();
      const url = page.url();
      expect(url).toEqual(link.url);
      await page.goBack();
      await button.click();
    }

    // const hamburger = navbar.getByRole('button', {name: 'Toggle navigation'})
  });
});
