const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const BASE_URL = "https://streamlist-app-admin.web.app/";

const EMAIL = process.env.STREAMLIST_EMAIL;
const PASSWORD = process.env.STREAMLIST_PASSWORD;

async function testSearchFunctionality() {
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
        By.xpath("//*[contains(text(),'Gazette')]")
      ),
      15000
    );

    // Navigate to Gazette page
    const gazetteLink = await driver.findElement(
      By.xpath("//*[contains(text(),'Gazette')]")
    );

    await gazetteLink.click();

    // Wait for movies page
    await driver.wait(
      until.urlContains("/movies"),
      15000
    );

    // Wait for search input
    const searchInput = await driver.wait(
      until.elementLocated(By.css("input[type='text']")),
      15000
    );

    // Enter movie search
    await searchInput.clear();
    await searchInput.sendKeys("sheldon");

    // Click search button
    const searchButton = await driver.findElement(
      By.xpath("//*[contains(text(),'Summon Films')]")
    );

    await searchButton.click();

    // Wait for results to load
    await driver.wait(
      until.elementLocated(
        By.xpath("//*[contains(text(),'Sheldon')]")
      ),
      20000
    );

    // Validate results
    const pageText = await driver.findElement(By.css("body")).getText();

    if (pageText.toLowerCase().includes("sheldon")) {
      console.log("PASS: Search functionality returned movie results.");
    } else {
      throw new Error("Search results were not found.");
    }

  } catch (error) {
    console.log("FAIL: Search functionality test failed.");
    console.error(error.message);
    throw error;

  } finally {
    await driver.quit();
  }
}

testSearchFunctionality();