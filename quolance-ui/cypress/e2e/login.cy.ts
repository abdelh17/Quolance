describe("Login Flow", () => {


    it("Error Login Flow", () => {
       // Mock api error response
      cy.intercept('POST', '/api/auth/login', {
        statusCode: 401,
        body: {
          message: 'Bad Credentials',
        },
      }).as('loginError');
    
      // Visit the login page
      cy.visit('/auth/login');
     
     });
     
   });
 