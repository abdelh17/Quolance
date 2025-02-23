describe('Settings flow', () => {

  it('Error Changing Password Flow - No Input', () => {
    // Mock API call for client authentication
    cy.intercept('GET', '/api/auth/me', {
        statusCode: 200,
        body: {
            firstName: 'John',
            role: 'CLIENT',
            verified: true,
        },
    }).as('getClientUser');
 
 
    // Visit the settings page
    cy.visit('/setting');
 
 
    // Wait for the mocked API call
    cy.wait('@getClientUser');
 
 
    // Attempt to change the password without entering any input
    cy.get('[data-test="change-password-btn"]').click();
 
 
    // Verify proper error messages for empty inputs
    cy.get('[data-test="old-password-error"]').contains(/Current password is required/i);
    cy.get('[data-test="new-password-error"]').contains(/New password must be at least 8 characters long/i);
    cy.get('[data-test="confirm-password-error"]').contains(/Password confirmation is required/i);
 });
 
 
 it('Error Changing Password Flow - Mismatched Passwords', () => {
  // Mock API call for client authentication
  cy.intercept('GET', '/api/auth/me', {
      statusCode: 200,
      body: {
          firstName: 'John',
          role: 'CLIENT',
          verified: true,
      },
  }).as('getClientUser');
 
 
  // Visit the settings page
  cy.visit('/setting');
 
 
  // Wait for the mocked API call
  cy.wait('@getClientUser');
 
 
  // Fill out the form with mismatched passwords
  cy.get('[data-test="old-password-input"]').type('Test1234!');
  cy.get('[data-test="new-password-input"]').type('Password123');
  cy.get('[data-test="confirm-password-input"]').type('Password123!'); // Mismatched password
 
 
  // Submit the form
  cy.get('[data-test="change-password-btn"]').click();
 
 
  // Verify the passwords not matching error is displayed
  cy.get('[data-test="confirm-password-error"]').contains(/Passwords do not match/i);
 });
 
 
 it('Error Changing Password Flow - Current Password Incorrect', () => {
  // Mock API call for client authentication
  cy.intercept('GET', '/api/auth/me', {
      statusCode: 200,
      body: {
          firstName: 'John',
          role: 'CLIENT',
          verified: true,
      },
  }).as('getClientUser');
 
 
  // Mock API error response for incorrect current password
  cy.intercept('PATCH', '/api/users/password', {
      statusCode: 400,
      body: {
          message: 'Wrong password',
      },
  }).as('currentPasswordError');
 
 
  // Visit the settings page
  cy.visit('/setting');
 
 
  // Wait for the mocked API call
  cy.wait('@getClientUser');
 
 
  // Fill out the form with an incorrect current password
  cy.get('[data-test="old-password-input"]').type('Test1234');
  cy.get('[data-test="new-password-input"]').type('Password123');
  cy.get('[data-test="confirm-password-input"]').type('Password123');
 
 
  // Submit the form
  cy.get('[data-test="change-password-btn"]').click();
 
 
  // Wait for the mocked API error
  cy.wait('@currentPasswordError');
 
 
  // Verify the wrong current password error is displayed
  cy.get('[data-test="old-password-error"]').contains(/Current password is incorrect/i);
 });
 
     it("Success Changing Password Flow", () => {
          // Mock api call for client authentication
          cy.intercept('GET', '/api/auth/me', {
            statusCode: 200,
            body: {
            firstName: 'John',
            role: 'CLIENT',
            verified: true,
            },
        }).as('getClientUser');
         // Mock api success response for changing current password
        cy.intercept('PATCH', '/api/users/password', {
          statusCode: 200,
          body: {
          id:1,
          role:"CLIENT",
          firstName:"John"
          },
      }).as('currentPasswordError');
       // Visit the login page
       cy.visit("/setting");
       // Wait for the mocked API call
      cy.wait('@getClientUser');
      // Fill out inputs and submit
     cy.get('[data-test="old-password-input"]').type("Test1234!");
     cy.get('[data-test="new-password-input"]').type("Password123");
     cy.get('[data-test="confirm-password-input"]').type("Password123");
     cy.get('[data-test="change-password-btn"]').click();
      // Verify the toast message for successful password change
     cy.get('.Toastify__toast').should('be.visible').contains(/The password has been changed successfully/i);
     });
   });
 