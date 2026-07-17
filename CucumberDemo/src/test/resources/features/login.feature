Feature: Facebook Login

  Scenario: Login with valid credentials

    Given User opens the login page
    When user enters the username "test@gmail.com"
    And user enters the password "Password123"
    Then click the Login Button