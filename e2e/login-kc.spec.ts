import { firefox, test, expect, type Page, request } from '@playwright/test';


test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8080/auth/admin/');
});

var url = 'http://localhost:8080/auth/realms/test/protocol/openid-connect/auth?client_id=test&redirect_uri=https://www.google.com&state=41dacfb3-fa49-499e-9797-2137c618a8a8&response_type=code&scope=openid';

test.describe('Login', () => {
  test('should allow login with account and validate JWT payload', async ({ page, request }) => {
    const env = getEnvVars()
        
    await page.goto(url);
    await page.getByLabel('Username or email').click();
    await page.getByLabel('Username or email').fill(env.ID);
    await page.getByLabel('Username or email').press('Tab');
    await page.getByLabel('Password').fill(env.PASSWORD);
    await page.getByRole('button', { name: 'Sign In' }).click();

    await page.waitForURL('https://www.google.com/*');

    let s = page.url().indexOf("code=")

    let code = page.url().substring(s+5)

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

    let dot = token['access_token'].indexOf(".");
    let payload = token['access_token'].substring(dot + 1);
    dot = payload.indexOf(".");
    payload = payload.substring(0, dot);
    console.log(JSON.stringify(JSON.parse(Buffer.from(payload, 'base64').toString()),null,2)); 
  })
});

function getEnvVars() {
  const envVars = {
    ID: process.env.ID,
    PASSWORD: process.env.PASSWORD,
  };
  
  return envVars;
}



// interface AccessTokenResponse {
//   access_token: string;
// }

// let accessToken: (code: string) => AccessTokenResponse = function (
//   code: string
// ): AccessTokenResponse {
  
// };