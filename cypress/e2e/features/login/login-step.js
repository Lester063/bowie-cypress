import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import loginPO from '../../../objects/login.cy.js';
const login = new loginPO();
Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
  })
Given('I am on the login page',()=>{
    cy.visit('http://127.0.0.1:8000/login');
});
When('I enter my credentials, {string} {string}',(email, password)=>{
    login.enterCredentials(email,password);
});
When('I click the login button',()=>{
    login.clickLogin();
});
Then('I should be able to login successfully',()=>{
    login.successLogin()
})