Feature: Login

    Scenario Outline: I should be able to logged in as an Admin

        Given I am on the login page
        When I enter my credentials, '<email>' '<password>'
        And I click the login button
        Then I should be able to login successfully

        Examples:
            |email|password|
            |lester@gmail.com|password|
            |test1@gmail.com|password|