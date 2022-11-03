import { expect, Locator, Page } from '@playwright/test';
export class LoginPage {
    readonly url: string;
    readonly page: Page;

    constructor(page: Page, url: string) {
        this.page = page;
        this.url = url;
    }

    async goto() {
        await this.page.goto(this.url);
    }
    async clickOnProducts() {
        await this.productsMenu.waitFor({ state: "visible" });
        await this.productsMenu.click();
    }
}