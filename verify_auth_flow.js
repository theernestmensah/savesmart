const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // 0. Set the viewport to a desktop resolution
  await page.setViewportSize({ width: 1280, height: 720 });

  // 1. Navigate to the new landing page
  await page.goto('http://localhost:8000');
  await page.screenshot({ path: 'verification/01-landing-page.png' });

  // 2. Toggle dark mode on landing page
  await page.click('#theme-toggle');
  await page.screenshot({ path: 'verification/02-landing-page-dark-mode.png' });

  // 3. Click the "Get Started" button
  await page.click('#cta-button');
  await page.screenshot({ path: 'verification/03-auth-page.png' });

  // 4. Toggle dark mode on auth page
  await page.click('#theme-toggle');
  await page.screenshot({ path: 'verification/04-auth-page-dark-mode.png' });

  // 5. Click the "Sign Up" button to switch to the signup form
  await page.click('#signUp');

  // 6. Fill in the signup form and submit
  await page.fill('#signup-name', 'testuser');
  await page.fill('#signup-email', 'test@example.com');
  await page.fill('#signup-password', 'password');
  await page.click('#signup-form button[type="submit"]');

  // 7. Take a screenshot of the login form after signup
  await page.screenshot({ path: 'verification/05-login-form-after-signup.png' });

  // 8. Fill in the login form and submit
  await page.fill('#login-email', 'test@example.com');
  await page.fill('#login-password', 'password');
  await page.click('#login-form button[type="submit"]');

  // 9. Take a screenshot of the dashboard after login
  await page.screenshot({ path: 'verification/06-dashboard-after-login.png' });

  // 10. Toggle dark mode on dashboard
  await page.click('#theme-toggle');
  await page.screenshot({ path: 'verification/07-dashboard-dark-mode.png' });

  // 11. Navigate to another protected page
  await page.goto('http://localhost:8000/badges.html');
  await page.screenshot({ path: 'verification/08-badges-page-after-login.png' });

  // 12. Toggle dark mode on badges page
  await page.click('#theme-toggle');
  await page.screenshot({ path: 'verification/09-badges-page-dark-mode.png' });

  // 13. Click the logout button
  await page.click('#logout-btn');

  // 14. Take a screenshot of the auth page after logout
  await page.screenshot({ path: 'verification/10-auth-page-after-logout.png' });

  // 15. Try to access a protected page
  await page.goto('http://localhost:8000/dashboard.html');
  await page.screenshot({ path: 'verification/11-dashboard-page-after-logout.png' });


  await browser.close();
})();
