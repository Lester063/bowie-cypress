Feature: Item

    Scenario Outline: I should be able to logged in as an Admin

        Given I am on the login page
        When I enter my credentials, '<email>' '<password>'
        And I click the login button
        Then I should be able to login successfully

        Examples:
            |email|password|
            |lester@gmail.com|password|
            |test1@gmail.com|password|

    Scenario Outline: I should be able to add Item

        Given I am logged in as an Admin
        And I navigated to Item page
        And the item with this code does not exist on item table, <itemCode>
        When I click the Create button
        And I enter the required details, <itemName>, <itemCode>
        And I click the Submit button
        Then I should see a success message, <message>
        And the item should be added on the table

        Examples:
            | itemName       | itemCode       | message                  |
            | Test Item Name | Test Item Code | Item added successfully. |

    Scenario Outline: Newly created item should be searchable

        Given I am logged in as an Admin
        And I navigated to Item page
        And there is an existing item, <itemName>, <itemCode>
        When I search the item thru its code, <itemCode>
        Then the table should be filtered based on the entered data, <itemCode>

        Examples:
            | itemName       | itemCode       | message                  |
            | Test Item Name | Test Item Code | Item added successfully. |

    Scenario Outline: I should not be able to add Item that code already exists

        Given I am logged in as an Admin
        And I navigated to Item page
        And there is an existing item, <itemName>, <itemCode>
        And I click the Create button
        When I enter the same details with the existing item, <itemName>, <itemCode>
        And I click the Submit button
        Then I should see an error message, <message>

        Examples:
            | itemName       | itemCode       | message                  |
            | Test Item Name | Test Item Code | Item code already exist. |

    Scenario Outline: I should be able to  update Item

        Given I am logged in as an Admin
        And I navigated to Item page
        And there is an existing item, <itemName>, <itemCode>
        When I click the edit button of the item
        And I enter the new details, <newItemName>, <newItemCode>
        And I click the Submit button
        Then I should see a success message, <message>
        And the new details should reflect on the table

        Examples:
            | itemName       | itemCode       | message                    | newItemName   | newItemCode   |
            | Test Item Name | Test Item Code | Item updated successfully. | New Item Name | New Item Code |

    Scenario Outline: I should not be be able to update Item when the new item code already used with other item

        Given I am logged in as an Admin
        And I navigated to Item page
        And there are two item, <itemName1>, <itemCode1>, <itemName2>, <itemCode2>
        When I click the edit button of the item
        And I enter the new details, <itemName1>, <itemCode1>
        And I click the Submit button
        Then I should see an error message, <message>

        Examples:
            | itemName1        | itemCode1        | itemName2        | itemCode2        | message                  |
            | Test Item Name1  | Test Item Code1  | Test Item Name2  | Test Item Code2  | Code already exist.      |

    Scenario Outline: I should be able to delete an Item

        Given I am logged in as an Admin
        And I navigated to Item page
        And there is an existing item, <itemName>, <itemCode>
        When I delete the item
        Then I should see a success message, <message>
        And the item should not be visible on the item table

        Examples:
            | itemName       | itemCode       | message                        |
            | Test Item Name | Test Item Code | Item was deleted successfully. |

    Scenario Outline: Deleted item should be move to deleted item page

        Given I am logged in as an Admin
        And I navigated to Item page
        And there is an existing item, <itemName>, <itemCode>
        And I delete the item
        When I navigate to Delete Item page
        Then I should see the item I deleted

        Examples:
            | itemName       | itemCode       |
            | Test Item Name | Test Item Code |

    Scenario Outline: I should be able to restore deleted item

        Given I am logged in as an Admin
        And the item with this code does not exist on item table, <itemCode>
        And I navigated to Item page > Deleted Item
        And there is an existing deleted item, <itemName>, <itemCode>
        When I restore the item
        Then I should see the restored item in the table of item page

        Examples:
            | itemName       | itemCode       |
            | Test Item Name | Test Item Code |

    Scenario Outline: I should see an error when restoring an item that code is already existing on item table

        Given I am logged in as an Admin
        And the item with this code does exist on item table, <itemName>, <itemCode>
        And I navigated to Item page > Deleted Item
        And there is an existing deleted item, <itemName>, <itemCode>
        When I restore the item
        Then I should see an error message saying the code already exist on database, <message>

        Examples:
            | itemName       | itemCode       | message |
            | Test Item Name | Test Item Code | Item with the same code does exist on database.|

    Scenario Outline: A message 'There are no items to show.' should be displayed when the data entered on the search bar does not matched to data stored on database

        Given I am logged in as an Admin
        And I navigated to Item page
        When I enter a data on the search bar, <data>
        Then I should see a message 'There are no items to show.'

        Examples:
            |data|
            |12as|

    Scenario: User should be able to request an item

        Given there is an item Available
        And I am logged in as a User
        And I navigated to Available Item page
        When I click the request
        Then the success message should be displayed
        And I will be navigated to my request item page

    Scenario Outline: Admin should be able to approved a request

        Given there is an existing request
        And I am logged in as an Admin
        And I navigated to Request page
        When I click the Edit button of the request
        And I select the PROCESSED
        And I click Submit
        Then I should see a success message, <message>
        And the status should be change to PROCESSED

        Examples:
            |message|
            |Request updated successfully|

