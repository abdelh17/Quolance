describe('Settings flow', () => {


    it('Error Changing Password Flow', () => {
        // Mock api call for client authentication
        cy.intercept('GET', '/api/auth/me', {
          statusCode: 200,
          body: {
          firstName: 'John',
          role: 'CLIENT',
          verified: true,
          },
      }).as('getClientUser');
       // Mock api error response for wrong current password
      cy.intercept('PATCH', '/api/users/password', {
        statusCode: 400,
        body: {
         message:"Wrong password"
        },
    }).as('currentPasswordError');
 
 
        // Visit the login page
        cy.visit("/setting");
      
     });
    
   });
 