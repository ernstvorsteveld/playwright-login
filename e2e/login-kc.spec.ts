import { firefox, test, expect, type Page, request } from '@playwright/test';


test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8080/auth/admin/');
});

var url = 'http://localhost:8080/auth/realms/test/protocol/openid-connect/auth?client_id=test&redirect_uri=https://www.google.com&state=41dacfb3-fa49-499e-9797-2137c618a8a8&response_type=code&scope=openid';

test.describe('Login', () => {
  test('should allow login as admin', async ({ page, request }) => {
    (async () => {
      const browser = await firefox.launch({
        logger: {
          isEnabled: (name, severity) => name === 'browser',
          log: (name, severity, message, args) => console.log(`${name} ${message}`)
        }
      });
    })();
        
    await page.goto(url);
    await page.getByLabel('Username or email').click();
    await page.getByLabel('Username or email').fill('test');
    await page.getByLabel('Username or email').press('Tab');
    await page.getByLabel('Password').fill("test");
    await page.getByRole('button', { name: 'Sign In' }).click();

    console.log(page.url());
    await page.waitForURL('https://www.google.com/*');

    let s = page.url().indexOf("code=")
    console.log(s)

    let code = page.url().substring(s+5)
    console.log(code)

    const formData = new URLSearchParams();
    formData.append('grant_type', 'authorization_code');
    formData.append('redirect_uri', 'https://www.google.com');
    formData.append('code', code);

    const tokenResponse = await request.post(
      'http://localhost:8080/auth/realms/test/protocol/openid-connect/token', 
      {
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization' : 'Basic dGVzdDpoTFA5Y0Zrb3BkSFEzMkMwTFh3NDVQZkhnc3MwY1YyYw=='
        },
        data: formData.toString()
      })
    expect(tokenResponse.ok()).toBeTruthy();
    const token = await tokenResponse.json();
    console.log(token);
    console.log(token['access_token']);
  })
});

// interface AccessTokenResponse {
//   access_token: string;
// }

// let accessToken: (code: string) => AccessTokenResponse = function (
//   code: string
// ): AccessTokenResponse {
  
// };