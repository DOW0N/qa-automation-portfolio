const { test, expect } = require('@playwright/test');

test.describe('Main Flow 테스트 (화면 품질 + 안정성)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/login');
    await page.fill('#username', 'tomsmith');
    await page.fill('#password', 'SuperSecretPassword!');
    await page.click('button[type="submit"]');
  });

  test('Secure Area 페이지 진입 확인', async ({ page }) => {
    await expect(page.locator('h2')).toHaveText('Secure Area');
  });

  test('페이지 타이틀 검증', async ({ page }) => {
    await expect(page).toHaveTitle('The Internet');
  });

  test('Logout 버튼 존재 및 동작 확인', async ({ page }) => {
    const logoutBtn = page.locator('a.button.secondary.radius');

    await expect(logoutBtn).toBeVisible();

    await logoutBtn.click();
    await expect(page).toHaveURL(/login/);
  });

  test('내부 리소스 요청 실패 여부 확인', async ({ browser }) => {
    const page = await browser.newPage();
    const failedRequests = [];

    page.on('requestfailed', request => {
      const requestUrl = new URL(request.url());

      if (requestUrl.hostname === 'the-internet.herokuapp.com') {
        failedRequests.push({
          url: request.url(),
          method: request.method(),
          failure: request.failure(),
        });
      }
    });

    await page.goto('https://the-internet.herokuapp.com/login');

    await page.fill('#username', 'tomsmith');
    await page.fill('#password', 'SuperSecretPassword!');
    await page.click('button[type="submit"]');

    await page.waitForLoadState('networkidle');

    console.log('실패한 내부 리소스 요청 수:', failedRequests.length);

    for (const request of failedRequests) {
      console.log('실패 요청 상세:', request);
    }

    expect(failedRequests.length).toBe(0);

    await page.close();
  });

});