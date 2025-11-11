const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // 0. Set the viewport to a desktop resolution
  await page.setViewportSize({ width: 1280, height: 720 });

  // 1. Navigate to the signup page
  await page.goto('http://localhost:8000');
  await page.screenshot({ path: 'verification/01-signup-page.png' });

  // 2. Click the "Sign Up" button to switch to the signup form
  await page.click('#signUp');

  // 3. Fill in the signup form and submit
  await page.fill('#signup-name', 'testuser');
  await page.fill('#signup-email', 'test@example.com');
  await page.fill('#signup-password', 'password');
  await page.click('#signup-form button[type="submit"]');

  // 4. Take a screenshot of the login form after signup
  await page.screenshot({ path: 'verification/02-login-form-after-signup.png' });

  // 5. Fill in the login form and submit
  await page.fill('#login-email', 'test@example.com');
  await page.fill('#login-password', 'password');
  await page.click('#login-form button[type="submit"]');

  // 6. Take a screenshot of the dashboard after login
  await page.screenshot({ path: 'verification/03-dashboard-after-login.png' });

  // 7. Navigate to another protected page
  await page.goto('http://localhost:8000/badges.html');
  await page.screenshot({ path: 'verification/04-badges-page-after-login.png' });

  // 8. Click the logout button
  await page.click('#logout-btn');

  // 9. Take a screenshot of the login page after logout
  await page.screenshot({ path: 'verification/05-login-page-after-logout.png' });

  // 10. Try to access a protected page
  await page.goto('http://localhost:8000/dashboard.html');
  await page.screenshot({ path: 'verification/06-dashboard-page-after-logout.png' });


  await browser.close();
})();
