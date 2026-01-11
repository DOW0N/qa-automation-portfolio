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

  test('콘솔 에러 발생 여부 확인', async ({ page }) => {
    const consoleErrors = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.waitForLoadState('networkidle');
    expect(consoleErrors.length).toBe(0);
  });

});
