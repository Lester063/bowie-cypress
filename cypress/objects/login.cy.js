
class Login{
    enterCredentials(email,password){
        cy.get('#email').clear().type(email);
        cy.get('#password').clear().type(password);
    } 
    clickLogin(){
        cy.get('button[type="submit"]').click({force:true});
    }
    successLogin(){
        cy.url().should('eq', 'http://127.0.0.1:8000/dashboard')
    }
}

export default Login