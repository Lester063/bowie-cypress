import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import bowPO from '../../../objects/bow.cy.js';
const bowie = new bowPO();
Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
});
//login
Given('I am on the login page',()=>{
    cy.visit('http://127.0.0.1:8000/login');
});
When('I enter my credentials, {string} {string}',(email, password)=>{
    bowie.enterCredentials(email,password);
});
When('I click the login button',()=>{
    bowie.clickLogin();
});
Then('I should be able to login successfully',()=>{
    bowie.successLogin()
})

Given('I am logged in as an Admin', () => {
    var email = 'lester@gmail.com';
    var password = 'password';
    cy.visit('http://127.0.0.1:8000/login');
    bowie.enterCredentials(email, password)
    bowie.clickLogin()
    bowie.successLogin()
});
Given('I navigated to Item page', () => {
    bowie.navigateItemPage();
});
When('I click the Create button', () => {
    bowie.triggerCreateButton();

    bowie.validateModalVisible();
});
When('I enter the required details, {}, {}', (itemName, itemCode) => {
    bowie.inputItemDetails(itemName, itemCode);
});
When('I click the Submit button', () => {
    bowie.triggerSubmit();
});
Then('I should see a success message, {}', (message) => {
    bowie.successMessage(message);
});
Then('the item should be added on the table', () => {
    bowie.validateCreatedItem();

    bowie.getItemIndexThruCode();
    bowie.deleteItemThruItemCode();
});

//Scenario Outline: Newly created item should be searchable
When('I search the item thru its code, {}', (itemCode) => {
    bowie.inputSearch(itemCode);
});
Then('the table should be filtered based on the entered data, {}', (itemCode) => {
    bowie.validateModalNotVisible();
    bowie.tableCodeOnlyEqualToParam(itemCode);

    bowie.deleteAllItemWithSameItemCode(itemCode);
});
//Scenario Outline: I should be able to  update Item
Given('there is an existing item, {}, {}', (itemName, itemCode) => {
    bowie.triggerCreateButton();
    bowie.inputItemDetails(itemName, itemCode);
    bowie.triggerSubmit();

    bowie.validateModalNotVisible();
    bowie.getItemIndexThruCode();
});
When('I click the edit button of the item', () => {
    bowie.triggerEditButton();
});
When('I enter the new details, {}, {}', (newItemName, newItemCode) => {
    bowie.inputItemDetails(newItemName, newItemCode);
});
Then('the new details should reflect on the table', () => {
    bowie.validateItemUpdateData();

    bowie.deleteItemThruItemCode();
});

//Scenario Outline: I should not be be able to update Item when the new item code already used with other item
Given('there are two item, {}, {}, {}, {}', (itemName1, itemCode1, itemName2, itemCode2) => {
    bowie.triggerCreateButton();
    bowie.inputItemDetails(itemName1, itemCode1);
    bowie.triggerSubmit();

    bowie.validateModalNotVisible();

    bowie.triggerCreateButton();
    bowie.inputItemDetails(itemName2, itemCode2);
    bowie.triggerSubmit();

    bowie.validateModalNotVisible();
    bowie.getItemIndexThruCode();
});

//Scenario Outline: I should be able to delete an Item
When('I delete the item', () => {
    bowie.deleteItemThruItemCode();
});
Then('the item should not be visible on the item table', () => {
    bowie.itemIsNotVisibleOnTable();
});

//Scenario Outline: Deleted item should be move to deleted item page
When('I navigate to Delete Item page', () => {
    bowie.navigateToDeletedItem();
    bowie.assertHeaderTwo('Deleted Item');
});
Then('I should see the item I deleted', () => {
    bowie.getItemIndexThruCode();
    bowie.itemIsVisibleOnTable();
});

//Scenario Outline: I should not be able to add Item that code already exists
When('I enter the same details with the existing item, {}, {}', (itemName, itemCode) => {
    bowie.inputItemDetails(itemName, itemCode);
});
Then('I should see an error message, {}', (message) => {
    bowie.errorMessage(message);

    //item.deleteItemThruItemCode();
    bowie.deleteAllItemWithSameItemCode('Test Item Code');
});
//Scenario Outline: I should be able to restore deleted item
Given('the item with this code does not exist on item table, {}', (itemCode) => {
    bowie.navigateItemPage();
    bowie.storeData('', itemCode)

    bowie.isDataExist('', itemCode);
    bowie.setDataNotExistInItem();

})
Given('I navigated to Item page > Deleted Item', () => {
    bowie.navigateItemPage();

    bowie.navigateToDeletedItem();
    bowie.assertHeaderTwo('Deleted Item');
});
Given('there is an existing deleted item, {}, {}', (itemName, itemCode) => {
    bowie.storeData(itemName, itemCode);
    bowie.isDataExist(itemName, itemCode);

    bowie.setDataExistInDeletedItem();
});
When('I restore the item', () => {
    bowie.restoreDeletedItemThruIndex();
});
Then('I should see the restored item in the table of item page', () => {
    bowie.navigateItemPage();
    bowie.assertUrlItemPage();
    bowie.assertHeaderTwo('Item');

    bowie.itemIsVisibleOnTable();


    bowie.navigateItemPage();
    bowie.assertUrlItemPage();
    bowie.assertHeaderTwo('Item');
    bowie.getItemIndexThruCode();
    bowie.deleteItemThruItemCode();
});

//Scenario Outline: I should see an error when restoring an item that code is already existing on item table
Given('the item with this code does exist on item table, {}, {}', (itemName, itemCode) => {
    bowie.navigateItemPage();
    bowie.assertUrlItemPage();
    bowie.assertHeaderTwo('Item');

    bowie.isDataExist(itemName, itemCode);
    bowie.setDataToExistInItem();
});
Then('I should see an error message saying the code already exist on database, {}', (message) => {
    bowie.errorMessage(message);

    bowie.navigateItemPage();
    bowie.assertUrlItemPage();
    bowie.assertHeaderTwo('Item');
    bowie.getItemIndexThruCode();
    bowie.deleteItemThruItemCode();
});


//Scenario: A message 'There are no items to show.' should be displayed when the data entered on the search bar does not matched to data stored on database
When('I enter a data on the search bar, {}', (data) => {
    bowie.inputSearch(data);
});
Then ("I should see a message 'There are no items to show.'", () => {
    bowie.tableNoItemToShow();
});


//Scenario Outline: User should be able to request an item
Given('there is an item Available', ()=> {
    var email = 'lester@gmail.com';
    var password = 'password';
    cy.visit('http://127.0.0.1:8000/login');
    bowie.enterCredentials(email, password)
    bowie.clickLogin();
    bowie.successLogin();

    bowie.navigateItemPage();
    var itemName='Test Request Item';
    var itemCode='Test Request Code';

    bowie.createItem(itemName, itemCode);
    bowie.userLogout();

})
Given('I am logged in as a User', () => {
    var email = 'automation@gmail.com';
    var password = 'password';
    cy.visit('http://127.0.0.1:8000/login');
    bowie.enterCredentials(email, password)
    bowie.clickLogin();
    bowie.successLogin();
});
Given('I navigated to Available Item page', () => {
    bowie.navigateAvailableItemPage();
    bowie.assertAvailableItemPage();
});
When('I click the request', () => {
    bowie.requestItem();
});
Then('the success message should be displayed', () => {
    bowie.successMessage('Request added successfully');
});
Then('I will be navigated to my request item page', () => {
    bowie.assertUserRequestPage();

    //login admin to delete request
    bowie.userLogout();
    var email = 'lester@gmail.com';
    var password = 'password';
    cy.visit('http://127.0.0.1:8000/login');
    bowie.enterCredentials(email, password)
    bowie.clickLogin();
    bowie.successLogin();

    bowie.navigateRequestPage();
    bowie.assertRequestPage();
    bowie.deleteRequest();

    bowie.navigateItemPage();
    bowie.assertUrlItemPage();
    bowie.assertHeaderTwo('Item');
    bowie.getItemIndexThruCode();
    bowie.deleteItemThruItemCode();
});


//Scenario Outline: Admin should be able to approved a request
Given ('there is an existing request', () => {
    // var email = 'lester@gmail.com';
    // var password = 'password';
    bowie.loginUser('lester@gmail.com', 'password');

    bowie.navigateItemPage();
    var itemName='Test Request Item';
    var itemCode='Test Request Code';
    bowie.createItem(itemName, itemCode);
    bowie.userLogout();

    bowie.loginUser('automation@gmail.com', 'password');
    bowie.navigateAvailableItemPage();
    bowie.assertAvailableItemPage();
    bowie.requestItem();
    bowie.successMessage('Request added successfully');
    bowie.userLogout();
});
Given('I navigated to Request page', () => {
    bowie.navigateRequestPage();
    bowie.assertRequestPage();
});
When('I click the Edit button of the request', () => {
    bowie.getItemIndexThruCode();
    bowie.triggerEditButton('request');
    bowie.validateModalVisible();
});
When('I select the PROCESSED', ()=>{
    bowie.selectStatusOption('PROCESSED')
});
When('I click Submit', ()=>{
    bowie.triggerSubmit();
});
Then('the status should be change to PROCESSED', ()=>{
    bowie.assertRequestStatus('PROCESSED');

    bowie.deleteItemThruItemCode();

    //delete item
    bowie.navigateItemPage();
    bowie.assertUrlItemPage();
    bowie.assertHeaderTwo('Item');
    bowie.getItemIndexThruCode();
    bowie.deleteItemThruItemCode();
})