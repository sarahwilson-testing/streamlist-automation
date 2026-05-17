const { Builder, By, Key, until } = require("selenium-webdriver");

const BASE_URL = "https://streamlist-app-admin.web.app/";

const EMAIL = process.env.STREAMLIST_EMAIL;
const PASSWORD = process.env.STREAMLIST_PASSWORD;

async function testLogin() {
  const driver = await new Builder().forBrowser("chrome").build();

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

    await driver.sleep(5000);

    const pageText = await driver.findElement(By.css("body")).getText();

    if (
      pageText.includes("Cabinet") &&
      pageText.includes("Gazette") &&
      pageText.includes("Take Your Leave")
    ) {
      console.log(
        "PASS: User successfully logged in and dashboard loaded."
      );
    } else {
      throw new Error("Dashboard elements not found after login.");
    }
  } catch (error) {
    console.log("FAIL: Login test failed.");
    console.error(error.message);
  } finally {
    await driver.quit();
  }
}

testLogin();