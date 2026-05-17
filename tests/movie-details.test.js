const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const BASE_URL = "https://streamlist-app-admin.web.app/";

const EMAIL = process.env.STREAMLIST_EMAIL;
const PASSWORD = process.env.STREAMLIST_PASSWORD;

async function testMovieDetails() {
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

    // Login
    const emailField = await driver.wait(
      until.elementLocated(By.css("input[type='email']")),
      15000
    );

    const passwordField = await driver.wait(
      until.elementLocated(By.css("input[type='password']")),
      15000
    );

    await emailField.sendKeys(EMAIL);
    await passwordField.sendKeys(PASSWORD, Key.RETURN);

    // Wait for dashboard
    await driver.wait(
      until.elementLocated(
        By.xpath("//*[contains(text(),'Gazette')]")
      ),
      15000
    );

    // Navigate to Gazette
    const gazetteLink = await driver.findElement(
      By.xpath("//*[contains(text(),'Gazette')]")
    );

    await gazetteLink.click();

    // Wait for movies page
    await driver.wait(
      until.urlContains("/movies"),
      15000
    );

    // Search for Sheldon
    const searchInput = await driver.wait(
      until.elementLocated(By.css("input[type='text']")),
      15000
    );

    await searchInput.clear();
    await searchInput.sendKeys("sheldon");

    const searchButton = await driver.findElement(
      By.xpath("//*[contains(text(),'Summon Films')]")
    );

    await searchButton.click();

    // Wait for results
    await driver.wait(
      until.elementLocated(
        By.xpath("//*[contains(text(),'Sheldon')]")
      ),
      20000
    );

    // Scroll down to Nothing Lasts Forever
    const movieCard = await driver.wait(
      until.elementLocated(
        By.xpath("//*[contains(text(),'Nothing Lasts Forever')]")
      ),
      20000
    );

    await driver.executeScript(
      "arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });",
      movieCard
    );

    // Click movie details
    await movieCard.click();

    // Wait for details page/modal
    await driver.wait(
      until.elementLocated(
        By.xpath("//*[contains(text(),'Nothing Lasts Forever')]")
      ),
      15000
    );

    const pageText = await driver.findElement(By.css("body")).getText();

    if (pageText.includes("Nothing Lasts Forever")) {
      console.log("PASS: Movie details opened successfully.");
    } else {
      throw new Error("Movie details page did not open.");
    }

  } catch (error) {
    console.log("FAIL: Movie details test failed.");
    console.error(error.message);
    throw error;

  } finally {
    await driver.quit();
  }
}

testMovieDetails();