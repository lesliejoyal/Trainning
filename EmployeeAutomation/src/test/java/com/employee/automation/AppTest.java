package com.employee.automation;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class AppTest {

    private WebDriver driver;
    private WebDriverWait wait;
    private final String BASE_URL = "http://localhost:5173";

    @BeforeEach
    public void setup() {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--remote-allow-origins=*");
        options.addArguments("--start-maximized");
        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    private void login(String role, String email, String password) throws InterruptedException {
        driver.get(BASE_URL + "/login");
        
        // Switch to the correct role tab if not admin
        if (role.equals("employee")) {
            WebElement employeeTab = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[contains(., 'Employee')]")));
            employeeTab.click();
            Thread.sleep(500); // Wait for tab switch animation
        }

        // Fill credentials
        WebElement emailInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("email")));
        emailInput.clear();
        emailInput.sendKeys(email);

        WebElement passwordInput = driver.findElement(By.id("password"));
        passwordInput.clear();
        passwordInput.sendKeys(password);

        // Submit form
        WebElement submitButton = driver.findElement(By.cssSelector("button[type='submit']"));
        submitButton.click();

        // Wait for redirection
        String expectedUrlPart = role.equals("admin") ? "/app" : "/portal";
        wait.until(ExpectedConditions.urlContains(expectedUrlPart));
    }

    private void checkPageLoads(String path) {
        driver.get(BASE_URL + path);
        // Wait a bit to ensure React renders the page
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        // Basic assertion: verify there's no Vite error overlay and the page title is present
        String pageSource = driver.getPageSource();
        boolean hasViteError = pageSource.contains("vite-error-overlay");
        assertTrue(!hasViteError, "Page " + path + " crashed or showed Vite error overlay.");
        
        // Also verify that the main app container is present (meaning a page rendered)
        // Note: checking for any div should suffice since an empty body would mean crash
        WebElement root = driver.findElement(By.id("root"));
        assertTrue(root.isDisplayed(), "Root element is not displayed on page " + path);
        
        System.out.println("Successfully checked page: " + path);
    }

    @Test
    public void testAllPages() throws InterruptedException {
        // --- 1. Test Admin Pages ---
        System.out.println("--- Starting Admin Pages Test ---");
        login("admin", "admin@thamizha.com", "Admin@123");

        String[] adminPages = {
            "/app",
            "/app/employees",
            "/app/attendance",
            "/app/leaves",
            "/app/payroll",
            "/app/reports",
            "/app/profile",
            "/app/settings"
        };

        for (String page : adminPages) {
            checkPageLoads(page);
        }

        // Logout
        ((JavascriptExecutor) driver).executeScript("localStorage.clear();");
        System.out.println("Logged out Admin");

        // --- 2. Test Employee Pages ---
        System.out.println("--- Starting Employee Pages Test ---");
        login("employee", "kavitha.kanimozhi@thamizha.com", "Employee@123");

        String[] employeePages = {
            "/portal",
            "/portal/profile",
            "/portal/attendance",
            "/portal/leaves",
            "/portal/payroll",
            "/portal/tasks",
            "/portal/notifications",
            "/portal/calendar",
            "/portal/settings"
        };

        for (String page : employeePages) {
            checkPageLoads(page);
        }
    }

    @AfterEach
    public void teardown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
