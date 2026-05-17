const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const BASE_URL = "https://streamlist-app-admin.web.app/";

const EMAIL = process.env.STREAMLIST_EMAIL;
const PASSWORD = process.env.STREAMLIST_PASSWORD;

async function testAddToFavorites() {
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
        By.xpath("//*[contains(text(),'Nothing Lasts Forever')]")
      ),
      20000
    );

    // Open movie details
    const movieCard = await driver.findElement(
      By.xpath("//*[contains(text(),'Nothing Lasts Forever')]")
    );

    await driver.executeScript(
      "arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });",
      movieCard
    );

    await movieCard.click();

    // Wait for details page
    await driver.wait(
      until.elementLocated(
        By.xpath("//*[contains(text(),'Return to Gazette')]")
      ),
      15000
    );

    // Return to Gazette
    const returnButton = await driver.findElement(
      By.xpath("//*[contains(text(),'Return to Gazette')]")
    );

    await returnButton.click();

    // Wait for movie list again
    await driver.wait(
      until.elementLocated(
        By.xpath("//*[contains(text(),'Nothing Lasts Forever')]")
      ),
      15000
    );

    // Select movie checkbox
    const checkbox = await driver.findElement(
      By.css("input[type='checkbox']")
    );

    await checkbox.click();

    // Add to Cabinet
    const addToCabinetButton = await driver.findElement(
      By.xpath("//*[contains(text(),'Add to Cabinet')]")
    );

    await addToCabinetButton.click();

    // Navigate to Cabinet
    const cabinetLink = await driver.findElement(
      By.xpath("//*[contains(text(),'Cabinet')]")
    );

    await cabinetLink.click();

    // Wait for Cabinet page
    await driver.wait(
      until.urlContains("/cabinet"),
      15000
    );

    // Validate movie exists in Cabinet
    await driver.wait(
      until.elementLocated(
        By.xpath("//*[contains(text(),'Nothing Lasts Forever')]")
      ),
      15000
    );

    const pageText = await driver.findElement(By.css("body")).getText();

    if (pageText.includes("Nothing Lasts Forever")) {
      console.log("PASS: Movie successfully added to Cabinet.");
    } else {
      throw new Error("Movie was not found in Cabinet.");
    }

  } catch (error) {
    console.log("FAIL: Add to favorites test failed.");
    console.error(error.message);
    throw error;

  } finally {
    await driver.quit();
  }
}

testAddToFavorites();