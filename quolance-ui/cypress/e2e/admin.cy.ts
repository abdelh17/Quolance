describe('Admin Flow', () => {
  it('Error Create Admin Flow', () => {
    cy.intercept('GET', '/api/auth/me', {
      statusCode: 200,
      body: {
        firstName: 'John',
        role: 'ADMIN',
        verified: true,
      },
    }).as('getAdminUser');
     cy.intercept('POST', '/api/users/admin', {
      statusCode: 400,
      body: {
        message: 'A user with this email already exists.',
      },
    }).as('createAdminError');
    
    cy.visit('/adminDashboard')
    
  });
 
 

 });
 