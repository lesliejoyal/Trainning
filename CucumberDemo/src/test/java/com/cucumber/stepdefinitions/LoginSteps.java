package com.cucumber.stepdefinitions;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.github.bonigarcia.wdm.WebDriverManager;

public class LoginSteps {

    WebDriver driver;
    WebDriverWait wait;

    @Given("User opens the login page")
public void user_opens_the_login_page() throws Exception {

    WebDriverManager.chromedriver().setup();

    driver = new ChromeDriver();

    driver.manage().window().maximize();

    driver.get("https://www.facebook.com/");

    Thread.sleep(10000);

    System.out.println("TITLE = " + driver.getTitle());
    System.out.println("URL = " + driver.getCurrentUrl());

    // Leave the browser open
    Thread.sleep(600000);
}

    @When("user enters the username {string}")
    public void user_enters_the_username(String username) {

        try {

            WebElement email = wait.until(
                    ExpectedConditions.visibilityOfElementLocated(By.id("email")));

            email.clear();
            email.sendKeys(username);

        } catch (TimeoutException e) {

            System.out.println("Email textbox not found.");
            System.out.println("Current URL : " + driver.getCurrentUrl());
            System.out.println("Current Title : " + driver.getTitle());

            throw e;
        }
    }

    @When("user enters the password {string}")
    public void user_enters_the_password(String password) {

        WebElement pass = wait.until(
                ExpectedConditions.visibilityOfElementLocated(By.id("pass")));

        pass.clear();
        pass.sendKeys(password);

    }

    @Then("click the Login Button")
    public void click_the_login_button() throws Exception {

        WebElement login = wait.until(
                ExpectedConditions.elementToBeClickable(By.name("login")));

        login.click();

        // Thread.sleep(5000);

        // driver.quit();
    }
}