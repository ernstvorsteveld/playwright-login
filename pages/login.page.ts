import { Page, APIRequestContext, expect } from '@playwright/test';
export class LoginPage {
    readonly url: string;
    readonly page: Page;
    readonly redirectUrl: string;
    readonly tokenUrl: string;
    request: APIRequestContext;

    constructor(page: Page, url: string, request: APIRequestContext) {
        this.page = page;
        this.url = url;
        this.redirectUrl = 'https://www.google.com/*';
        this.tokenUrl = 'http://localhost:8080/auth/realms/test/protocol/openid-connect/token';
        this.request = request;
    }

    async login(id: string, password: string) {
        await this.page.goto(this.url);
        await this.page.getByLabel('Username or email').click();
        await this.page.getByLabel('Username or email').fill(id);
        await this.page.getByLabel('Username or email').press('Tab');
        await this.page.getByLabel('Password').fill(password);
        await this.page.getByRole('button', { name: 'Sign In' }).click();
        await this.page.waitForURL(this.redirectUrl);
    }

    async exchange() {
        let s = this.page.url().indexOf("code=");
        let code = this.page.url().substring(s + 5)

        const formData = new URLSearchParams();
        formData.append('grant_type', 'authorization_code');
        formData.append('redirect_uri', 'https://www.google.com');
        formData.append('code', code);

        const tokenResponse = await this.request.post(
            this.tokenUrl,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic dGVzdDpoTFA5Y0Zrb3BkSFEzMkMwTFh3NDVQZkhnc3MwY1YyYw=='
                },
                data: formData.toString()
            });
        expect(tokenResponse.ok()).toBeTruthy();
        console.log(tokenResponse);
        return await tokenResponse.json();
    }

}