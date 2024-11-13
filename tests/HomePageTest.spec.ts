import { test, expect } from "@playwright/test";
import { NewsPage } from "./NewsPage";
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

test.describe("Huhbtel Blog home page ", () => {
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

test.describe("Hubtel blog news page", () => {
  let newsPage: NewsPage;
  test.beforeEach(async ({ page }) => {
    newsPage = new NewsPage(page)
    await newsPage.goto()
  });
  test.afterEach(async ({ page }) => {
    await newsPage.close();
  });

  test("Check that page is the news page", async ({ page }) => {
    newsPage.verifyIsNewPage()
  });

  test("Verify new letters and that they lead to their respective pages", async ({
    page,
  }) => {
    await test.step("Verify that test container is not empty", async () => {
      const count = await newsPage.getNewsLetterCount()

      expect(count).toBeGreaterThan(0);
      expect(count).toBeLessThanOrEqual(12);
    });

    await test.step("Verify random news letter leads to its page", async () => {
      const randomChild = await newsPage.getRandomNewsLetter()

      await test.step("Verify random new letter has image", async () => {
        await newsPage.verifyNewsLetterHasImage(randomChild)
      });

      await test.step("Verify newsletter leads to its page", async () => {
        const {linkText, date} = await newsPage.clickRandomNewsLetter(randomChild)

        await newsPage.verifyNewsArticle(linkText, date)
      })

      await test.step("Verify the pagination buttons work", async () => {
        const paginator = page.locator("//ul[@class='pagination justify-content-center mb-0']")
        
        await test.step("Verify next button", async () => {
          
        })
      })
    });
  });
});
