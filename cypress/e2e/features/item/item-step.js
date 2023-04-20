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
    var email='lester@gmail.com';
    var password = 'password';
    cy.visit('http://127.0.0.1:8000/login');
    login.enterCredentials(email,password)
    login.clickLogin()
    login.successLogin()
});
Given('I navigated to Item page', () => {
    item.navigateItemPage();
});
When ('I click the Create button', () => {
    item.triggerCreateButton();
});
When('I enter the required details, {}, {}', (itemName, itemCode) => {
    item.inputItemDetails(itemName, itemCode);
});
When('I click the Submit button', () => {
    item.triggerSubmit();
});
Then ('I should see a success message, {}', (message) => {
    item.successMessage(message);
});
Then('the item should be added on the table', () => {
    item.validateCreatedItem();

    item.getItemIndexThruCode();
    item.deleteItemThruItemCode();
});

//Scenario Outline: I should be able to  update Item
Given('the user has existing item, {}, {}', (itemName, itemCode) => {
    item.triggerCreateButton();
    item.inputItemDetails(itemName, itemCode);
    item.triggerSubmit();

    item.validateModalNotVisible()
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