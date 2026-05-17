const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const BASE_URL = "https://streamlist-app-admin.web.app/";

const EMAIL = process.env.STREAMLIST_EMAIL;
const PASSWORD = process.env.STREAMLIST_PASSWORD;

async function testLogin() {
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
    await driver.get(BASE_URL);

    const emailField = await driver.wait(
      until.elementLocated(By.css("input[type='email']")),
      10000
    );

    const passwordField = await driver.wait(
      until.elementLocated(By.css("input[type='password']")),
      10000
    );

    await emailField.sendKeys(EMAIL);
    await passwordField.sendKeys(PASSWORD, Key.RETURN);

    await driver.wait(until.urlContains("/streamlist"), 15000);

    const pageText = await driver.findElement(By.css("body")).getText();

    if (
      pageText.includes("Cabinet") &&
      pageText.includes("Gazette") &&
      pageText.includes("Take Your Leave")
    ) {
      console.log("PASS: User successfully logged in and dashboard loaded.");
    } else {
      throw new Error("Dashboard elements not found after login.");
    }
  } catch (error) {
    console.log("FAIL: Login test failed.");
    console.error(error.message);
    throw error;
  } finally {
    await driver.quit();
  }
}

testLogin();