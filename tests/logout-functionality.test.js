const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const BASE_URL = "https://streamlist-app-admin.web.app/";

const EMAIL = process.env.STREAMLIST_EMAIL;
const PASSWORD = process.env.STREAMLIST_PASSWORD;

async function testLogout() {
  const options = new chrome.Options();

  options.addArguments("--headless=new");
  options.addArguments("--no-sandbox");
  options.addArguments("--disable-dev-shm-usage");
  options.addArguments("--window-size=1920,1080");

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    // Open app
    await driver.get(BASE_URL);

    // Wait for login fields
    const emailField = await driver.wait(
      until.elementLocated(By.css("input[type='email']")),
      15000
    );

    const passwordField = await driver.wait(
      until.elementLocated(By.css("input[type='password']")),
      15000
    );

    // Login
    await emailField.sendKeys(EMAIL);
    await passwordField.sendKeys(PASSWORD, Key.RETURN);

    // Wait for dashboard
    await driver.wait(
      until.elementLocated(
        By.xpath("//*[contains(text(),'Take Your Leave')]")
      ),
      15000
    );

    // Click logout
    const logoutButton = await driver.findElement(
      By.xpath("//*[contains(text(),'Take Your Leave')]")
    );

    await logoutButton.click();

    // Wait for login page to return
    await driver.wait(
      until.elementLocated(By.css("input[type='email']")),
      15000
    );

    const pageText = await driver.findElement(By.css("body")).getText();

    if (
      pageText.includes("PRESENT YOUR PAPERS") ||
      pageText.includes("JOIN THE GUILD")
    ) {
      console.log("PASS: Logout successful and login page displayed.");
    } else {
      throw new Error("Login page not found after logout.");
    }

  } catch (error) {
    console.log("FAIL: Logout test failed.");
    console.error(error.message);
    throw error;

  } finally {
    await driver.quit();
  }
}

testLogout();