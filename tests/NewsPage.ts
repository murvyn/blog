import { Locator, Page, expect } from "@playwright/test";

export class NewsPage {
  private page: Page;
  private newsHeadng: Locator;
  private newsletters: Locator;
  constructor(page: Page) {
    this.page = page;
    this.newsHeadng = page.getByRole("heading", { name: "News" });
    this.newsletters = page.locator(
      "(//div[@class='col-12 col-md-6 col-lg-4 col-xl-3'])"
    );
  }

  async goto() {
    await this.page.goto("https://blog.hubtel.com/category/news/");
  }

  async close() {
    await this.page.close();
  }

  async verifyIsNewPage() {
    const url = this.page.url();
    expect(url).toMatch(/news/);
    await expect(this.newsHeadng).toBeVisible();
  }

  async getNewsLetterCount() {
    return await this.newsletters.count();
  }

  async getRandomNewsLetter() {
    const newsletterCount = await this.getNewsLetterCount();
    const randomIndex = Math.floor(Math.random() * newsletterCount);
    return this.newsletters.nth(randomIndex);
  }

  async verifyNewsLetterHasImage(randomNewsletter: Locator) {
    const image = randomNewsletter.locator("img");
    await expect(image).toBeVisible();
  }

  async clickRandomNewsLetter(randomNewsletter: Locator) {
    const date = await randomNewsletter
      .locator(".blog-card-body p")
      .nth(1)
      .innerText();
    const link = randomNewsletter.locator(".blog-card-body a");
    const linkText = await link.innerText();

    await link.click();
    return { linkText, date };
  }

  async verifyNewsArticle(linkText: string | RegExp, date: string | RegExp) {
    const heading = await this.page
      .locator("//h3[@class='fw-bold mb-4']")
      .innerText();
    const newsDate = await this.page
      .locator("//h6[@class='mb-4 text-muted small']")
      .innerText();

    expect(heading).toMatch(linkText);
    expect(newsDate).toMatch(date);
  }
}
