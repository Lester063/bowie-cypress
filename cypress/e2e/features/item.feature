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

    Scenario Outline: Newly created item should be searchable

        Given I am logged in as an Admin
        And I navigated to Item page
        And the user has existing item, <itemName>, <itemCode>
        When I search the item thru its code, <itemCode>
        Then the table should be filtered based on the entered data, <itemCode>

        Examples:
            | itemName       | itemCode       | message                  |
            | Test Item Name | Test Item Code | Item added successfully. |

    Scenario Outline: I should not be able to add Item that code already exists

        Given I am logged in as an Admin
        And I navigated to Item page
        And the user has existing item, <itemName>, <itemCode>
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
        And the user has existing item, <itemName>, <itemCode>
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
        And the user has two item, <itemName1>, <itemCode1>, <itemName2>, <itemCode2>
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
        And the user has existing item, <itemName>, <itemCode>
        When I delete the item
        Then I should see a success message, <message>
        And the item should not be visible on the item table

        Examples:
            | itemName       | itemCode       | message                        |
            | Test Item Name | Test Item Code | Item was deleted successfully. |

    Scenario Outline: Deleted item should be move to deleted item page

        Given I am logged in as an Admin
        And I navigated to Item page
        And the user has existing item, <itemName>, <itemCode>
        And I delete the item
        When I navigate to Delete Item page
        Then I should see the item I deleted

        Examples:
            | itemName       | itemCode       |
            | Test Item Name | Test Item Code |


