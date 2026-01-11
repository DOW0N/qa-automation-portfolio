const { test, expect } = require('@playwright/test');

test.describe('Regression 테스트 (릴리즈 관점 · 실무형)', () => {

  test('브라우저별 Secure Area 로딩 성능 회귀', async ({ page }) => {
    // ▶ 브라우저 엔진별 성능 허용 기준
    const thresholdByBrowser = {
      chromium: 4000,
      firefox: 5500,
      webkit: 5000,
    };

    const browserName = test.info().project.name;
    const threshold = thresholdByBrowser[browserName];

    const startTime = Date.now();

    // 로그인 → Secure Area
    await page.goto('https://the-internet.herokuapp.com/login');
    await page.fill('#username', 'tomsmith');
    await page.fill('#password', 'SuperSecretPassword!');
    await page.click('button[type="submit"]');

    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;
    console.log(`[${browserName}] Secure Area Load Time: ${loadTime}ms`);

    // 기능 검증
    await expect(page.locator('h2')).toHaveText('Secure Area');

    // ▶ 회귀 성능 기준 검증
    expect(loadTime).toBeLessThan(threshold);
  });

  test('내부 리소스 요청 실패 여부 확인', async ({ page }) => {
    const failedRequests = [];

    page.on('requestfailed', request => {
      // ▶ 내부 서비스 도메인만 품질 대상에 포함
      if (request.url().includes('the-internet.herokuapp.com')) {
        failedRequests.push(request.url());
      }
    });

    await page.goto('https://the-internet.herokuapp.com/login');
    await page.fill('#username', 'tomsmith');
    await page.fill('#password', 'SuperSecretPassword!');
    await page.click('button[type="submit"]');

    await page.waitForLoadState('networkidle');

    // ▶ 내부 리소스 기준으로 실패 없어야 함
    expect(failedRequests.length).toBe(0);
  });

  test('Secure Area UI 스냅샷 회귀 테스트 (기준 브라우저)', async ({ page }) => {
    // ▶ 스냅샷은 기준 브라우저(Chromium)에서만 수행
    test.skip(test.info().project.name !== 'chromium');

    await page.goto('https://the-internet.herokuapp.com/login');
    await page.fill('#username', 'tomsmith');
    await page.fill('#password', 'SuperSecretPassword!');
    await page.click('button[type="submit"]');

    await page.waitForLoadState('networkidle');

    // ▶ UI 변경 감지용 스냅샷
    await expect(page).toHaveScreenshot('secure-area.png');
  });

});

