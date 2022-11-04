import { test, expect, type Page, request } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { Jwt } from '../helper/jwt.spec';

var url = 'http://localhost:8080/auth/realms/test/protocol/openid-connect/auth?client_id=test&redirect_uri=https://www.google.com&state=41dacfb3-fa49-499e-9797-2137c618a8a8&response_type=code&scope=openid';

test.describe('Login', () => {
  test('should allow login with account and validate JWT payload', async ({ page, request }) => {
    const env = getEnvVars()

    const loginPage = new LoginPage(page, url, request);
    let s = await loginPage.login(env.ID, env.PASSWORD);
    // loginPage.setCredentials(env.ID, env.PASSWORD);
    
    const jwt = new Jwt(await loginPage.exchange());
    console.log(await jwt.getPayloadAsJson());
  })
});

function getEnvVars() {
  const envVars = {
    ID: process.env.ID,
    PASSWORD: process.env.PASSWORD,
  };
  
  return envVars;
}

