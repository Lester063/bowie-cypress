import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import loginPO from '../../../objects/login.cy.js';
import itemPO from '../../../objects/item.cy.js';
const login = new loginPO();
const item = new itemPO();
Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
});

Given('I am logged in as an Admin', () => {
    var email = 'lester@gmail.com';
    var password = 'password';
    cy.visit('http://127.0.0.1:8000/login');
    login.enterCredentials(email, password)
    login.clickLogin()
    login.successLogin()
});
Given('I navigated to Item page', () => {
    item.navigateItemPage();
});
When('I click the Create button', () => {
    item.triggerCreateButton();

    item.validateModalVisible();
});
When('I enter the required details, {}, {}', (itemName, itemCode) => {
    item.inputItemDetails(itemName, itemCode);
});
When('I click the Submit button', () => {
    item.triggerSubmit();
});
Then('I should see a success message, {}', (message) => {
    item.successMessage(message);
});
Then('the item should be added on the table', () => {
    item.validateCreatedItem();

    item.getItemIndexThruCode();
    item.deleteItemThruItemCode();
});

//Scenario Outline: Newly created item should be searchable
When('I search the item thru its code, {}', (itemCode) => {
    item.inputSearch(itemCode);
});
Then('the table should be filtered based on the entered data, {}', (itemCode) => {
    item.validateModalNotVisible();
    item.tableCodeOnlyEqualToParam(itemCode);

    item.deleteAllItemWithSameItemCode(itemCode);
});
//Scenario Outline: I should be able to  update Item
Given('there is an existing item, {}, {}', (itemName, itemCode) => {
    item.triggerCreateButton();
    item.inputItemDetails(itemName, itemCode);
    item.triggerSubmit();

    item.validateModalNotVisible();
    item.getItemIndexThruCode();
});
When('I click the edit button of the item', () => {
    item.triggerEditButton();
});
When('I enter the new details, {}, {}', (newItemName, newItemCode) => {
    item.inputItemDetails(newItemName, newItemCode);
});
Then('the new details should reflect on the table', () => {
    item.validateItemUpdateData();

    item.deleteItemThruItemCode();
});

//Scenario Outline: I should not be be able to update Item when the new item code already used with other item
Given('there are two item, {}, {}, {}, {}', (itemName1, itemCode1, itemName2, itemCode2) => {
    item.triggerCreateButton();
    item.inputItemDetails(itemName1, itemCode1);
    item.triggerSubmit();

    item.validateModalNotVisible();

    item.triggerCreateButton();
    item.inputItemDetails(itemName2, itemCode2);
    item.triggerSubmit();

    item.validateModalNotVisible();
    item.getItemIndexThruCode();
});

//Scenario Outline: I should be able to delete an Item
When('I delete the item', () => {
    item.deleteItemThruItemCode();
});
Then('the item should not be visible on the item table', () => {
    item.itemIsNotVisibleOnTable();
});

//Scenario Outline: Deleted item should be move to deleted item page
When('I navigate to Delete Item page', () => {
    item.navigateToDeletedItem();
    item.assertHeaderTwo('Deleted Item');
});
Then('I should see the item I deleted', () => {
    item.getItemIndexThruCode();
    item.itemIsVisibleOnTable();
});

//Scenario Outline: I should not be able to add Item that code already exists
When('I enter the same details with the existing item, {}, {}', (itemName, itemCode) => {
    item.inputItemDetails(itemName, itemCode);
});
Then('I should see an error message, {}', (message) => {
    item.errorMessage(message);

    //item.deleteItemThruItemCode();
    item.deleteAllItemWithSameItemCode('Test Item Code');
});
//Scenario Outline: I should be able to restore deleted item
Given('the item with this code does not exist on item table, {}', (itemCode) => {
    item.navigateItemPage();

    item.isDataExist('', itemCode);
    item.setDataNotExistInItem();

})
Given('I navigated to Item page > Deleted Item', () => {
    item.navigateItemPage();

    item.navigateToDeletedItem();
    item.assertHeaderTwo('Deleted Item');
});
Given('there is an existing deleted item, {}, {}', (itemName, itemCode) => {
    item.storeData(itemName, itemCode);
    item.isDataExist(itemName, itemCode);

    item.setDataExistInDeletedItem();
});
When('I restore the item', () => {
    item.restoreDeletedItemThruIndex();
});
Then ('I should see the restored item in the table of item page', () => {
    item.navigateItemPage();
    item.assertUrlItemPage();
    item.assertHeaderTwo('Item');

    item.itemIsVisibleOnTable();
});

//Scenario Outline: I should see an error when restoring an item that code is already existing on item table
Given('the item with this code does exist on item table, {}, {}', (itemName, itemCode) => {
    item.navigateItemPage();

    item.isDataExist('', itemCode);
    item.setDataToExistInItem();
});
Then('I should see an error message saying the code already exist on database, {}', (message) => {
    item.errorMessage(message);
});


//Scenario: A message 'There are no items to show.' should be displayed when the data entered on the search bar does not matched to data stored on database
When('I enter a data on the search bar, {}', (data) => {
    item.inputSearch(data);
});
Then ("I should see a message 'There are no items to show.'", () => {
    item.tableNoItemToShow();
});


//Scenario Outline: User should be able to request an item
Given('there is an item Available', ()=> {
    var email = 'lester@gmail.com';
    var password = 'password';
    cy.visit('http://127.0.0.1:8000/login');
    login.enterCredentials(email, password)
    login.clickLogin();
    login.successLogin();

    item.navigateItemPage();
    var itemName='Test Request Item';
    var itemCode='Test Request Code';
    // item.deleteAllItemWithSameItemCode(itemCode)

    // item.triggerCreateButton();
    // item.validateModalVisible();

    // item.inputItemDetails(itemName, itemCode);
    // item.triggerSubmit();

    item.createItem(itemName, itemCode);
    item.userLogout();

})
Given('I am logged in as a User', () => {
    var email = 'automation@gmail.com';
    var password = 'password';
    cy.visit('http://127.0.0.1:8000/login');
    login.enterCredentials(email, password)
    login.clickLogin();
    login.successLogin();
});
Given('I navigated to Available Item page', () => {
    item.navigateAvailableItemPage();
    item.assertAvailableItemPage();
});
When('I click the request', () => {
    item.requestItem();
});
Then('the success message should be displayed', () => {
    item.successMessage('Request added successfully');
});
Then('I will be navigated to my request item page', () => {
    item.assertUserRequestPage();

    //login admin to delete request
    item.userLogout();
    var email = 'lester@gmail.com';
    var password = 'password';
    cy.visit('http://127.0.0.1:8000/login');
    login.enterCredentials(email, password)
    login.clickLogin();
    login.successLogin();

    item.navigateRequestPage();
    item.assertRequestPage();
    item.deleteRequest();
});