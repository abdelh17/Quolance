describe('Registration Flow', () => {
    it('Error Registration Flow', () => {
      // Mock api error response
      cy.intercept('POST', '/api/users', {
        statusCode: 400,
        body: {
          message: 'A user with this email already exists.',
        },
      }).as('registerUserError');
      // Visit the registration page
      cy.visit('/auth/register');
    
    });
   
   });
   