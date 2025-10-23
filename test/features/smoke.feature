# How to run (local examples)
# - make functional-test
# - Or directly:
#   API_BASE_URL=http://localhost:8080/api CLIENT_BASE_URL=http://localhost:3000 npx playwright test --reporter=line

Feature: Todo App smoke (API + UI)
  As a user and as the system
  I want the core API and UI flows to function
  So that I can authenticate, manage todos, and log out without errors

  Background:
    Given API base URL "<api_base>"
    And Client base URL "<client_base>"

  Scenario: Unauthenticated users are redirected to login
    When I navigate to "<client_base>/"
    Then the current URL should match ".*/login$"
    And no JavaScript errors occurred on the page
    And no failed network requests were captured
    And no HTTP error responses (>= 400) were captured

  Scenario Outline: Login, add a todo, then logout
    Given a new user is registered via API at "<api_base>/users/register" with payload
      | key        | value        |
      | first_name | UI           |
      | last_name  | Smoke        |
      | email      | <email>      |
      | password   | <password>   |
      | picture    | null         |
    When I navigate to "<client_base>/login"
    And I fill locator "#inputEmail3" with "<email>"
    And I fill locator "#inputPassword3" with "<password>"
    And I click locator "css=button.btn.btn-primary[type='submit']"
    Then the current URL should equal "<client_base>/"
    And the element located by "#todo-head" should be visible
    And the element located by "css=button.btn-danger" should be visible

    # Expand the form and add an item using only locators
    When I click locator "css=button.btn-transparent"
    And I fill locator "#item" with "UI Smoke Task"
    And I click locator "css=form button[type='submit']"
    Then the number of elements located by "css=div.d-flex.mx-2.border-bottom" should equal 1

    # Logout
    When I click locator "css=button.btn-danger"
    Then the current URL should match ".*/login$"
    And no JavaScript errors occurred on the page
    And no failed network requests were captured
    And no HTTP error responses (>= 400) were captured

    Examples:
      | api_base                      | client_base                 | email                                 | password   |
      | http://localhost:8080/api     | http://localhost:3000       | ui_<timestamp>_<rand>@example.com     | Passw0rd!  |
