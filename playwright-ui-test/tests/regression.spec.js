const { test, expect } = require('@playwright/test');

test.describe('Regression 테스트 (릴리즈 관점 · 실무형)', () => {

  test('브라우저별 Secure Area 로딩 성능 회귀', async ({ page }) => {
    const thresholdByBrowser = {
      chromium: 5000,
      firefox: 5500,
      webkit: 5000,
    };

    const browserName = test.info().project.name;
    const threshold = thresholdByBrowser[browserName];

    const startTime = Date.now();

    await page.goto('https://the-internet.herokuapp.com/login');
    await page.fill('#username', 'tomsmith');
    await page.fill('#password', 'SuperSecretPassword!');
    await page.click('button[type="submit"]');

    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    console.log(
      `[${browserName}] Secure Area Load Time: ${loadTime}ms`
    );

    await expect(page.locator('h2')).toHaveText('Secure Area');

    expect(loadTime).toBeLessThan(threshold);
  });

  test('내부 리소스 요청 실패 여부 확인', async ({ page }) => {
    const failedRequests = [];

page.on('requestfailed', request => {
  const requestUrl = new URL(request.url());

  // 실제 테스트 대상 서비스의 호스트만 검증
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

    console.log(
      '실패한 내부 리소스 요청 수:',
      failedRequests.length
    );

    for (const request of failedRequests) {
      console.log('실패 요청 상세:', request);
    }

    expect(failedRequests.length).toBe(0);
  });

  test('Secure Area UI 스냅샷 회귀 테스트 (기준 브라우저)', async ({ page }) => {
    test.skip(test.info().project.name !== 'chromium');

    await page.goto('https://the-internet.herokuapp.com/login');
    await page.fill('#username', 'tomsmith');
    await page.fill('#password', 'SuperSecretPassword!');
    await page.click('button[type="submit"]');

    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('secure-area.png');
  });

});