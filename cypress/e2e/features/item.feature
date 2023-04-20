Feature: Item

    Scenario Outline: I should be able to add Item

        Given I am logged in as an Admin
        And I navigated to Item page
        When I click the Create button
        And I enter the required details, <itemName>, <itemCode>
        And I click the Submit button
        Then I should see a success message, <message>
        And the item should be added on the table

        Examples:
            | itemName       | itemCode       | message                  |
            | Test Item Name | Test Item Code | Item added successfully. |

    Scenario Outline: I should be able to  update Item

        Given I am logged in as an Admin
        And I navigated to Item page
        And the user has existing item, <itemName>, <itemCode>
        When I click the edit button of the item
        And I enter the new details, <newItemName>, <newItemCode>
        And I click the Submit button
        Then I should see a success message, <message>
        And the new details should reflect on the table

        Examples:
            | itemName       | itemCode       | message                   | newItemName    | newItemCode    |
            | Test Item Name | Test Item Code | Item updated successfully.| New Item Name  | New Item Code  |

    
