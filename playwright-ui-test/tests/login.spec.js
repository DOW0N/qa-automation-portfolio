const { test, expect } = require('@playwright/test');

test.describe('Login 테스트 (기능 + UX + 비기능)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/login');
  });

  test('정상 로그인 성공 및 응답 시간 측정', async ({ page }) => {
    const startTime = Date.now();

    await page.fill('#username', 'tomsmith');
    await page.fill('#password', 'SuperSecretPassword!');
    await page.click('button[type="submit"]');

    const flash = page.locator('#flash');
    await expect(flash).toContainText('You logged into a secure area!');

    const responseTime = Date.now() - startTime;
    console.log(`Login Success Response Time: ${responseTime}ms`);

    expect(responseTime).toBeLessThan(3000);
  });

  test('잘못된 비밀번호 입력 시 에러 메시지 UX 확인', async ({ page }) => {
    await page.fill('#username', 'tomsmith');
    await page.fill('#password', 'wrongpassword');
    await page.click('button[type="submit"]');

    const errorMsg = page.locator('#flash');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('invalid');
  });

  test('빈 값 로그인 시 서버 검증 확인', async ({ page }) => {
    await page.click('button[type="submit"]');

    const errorMsg = page.locator('#flash');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('invalid');
  });

  test('연속 로그인 실패 시 응답 시간 변화 확인', async ({ page }) => {
    const times = [];

    for (let i = 0; i < 3; i++) {
      const start = Date.now();

      await page.fill('#username', 'tomsmith');
      await page.fill('#password', 'wrong');
      await page.click('button[type="submit"]');

      await page.locator('#flash').waitFor();
      times.push(Date.now() - start);
    }

    console.log('Login Fail Response Times:', times);
  });

});