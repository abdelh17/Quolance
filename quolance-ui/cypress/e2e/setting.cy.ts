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
    cy.visit('/auth/login');


    // Wait for the mocked API call
    cy.wait('@getClientUser');


    // Visit the login page
    cy.visit("/setting")


    // Verify proper errors shown when submit button clicked with no inputs added to current password, new password, confirm password
    cy.get('[data-test="change-password-btn"]').click()
    cy.get('[data-test="old-password-error"]').contains(/Current password is required/i)
    cy.get('[data-test="new-password-error"]').contains(/New password must be at least 8 characters long/i);
    cy.get('[data-test="confirm-password-error"]').contains(/Password confirmation is required/i);


     // Verify the passwords not matching error is displayed
     cy.get('[data-test="old-password-input"]').type("Test1234!")
    cy.get('[data-test="new-password-input"]').type("Password123")
    cy.get('[data-test="confirm-password-input"]').type("Password123!")
    cy.get('[data-test="change-password-btn"]').click()
    cy.get('[data-test="confirm-password-error"]').contains(/Passwords do not match/i);


    // Verify the wrong current password error is displayed
    cy.get('[data-test="old-password-input"]').clear().type("Test1234")
    cy.get('[data-test="confirm-password-input"]').clear().type("Password123")
    cy.get('[data-test="change-password-btn"]').click()
    cy.wait('@currentPasswordError');
    cy.get('[data-test="old-password-error"]').contains(/Current password is incorrect/i)


})


it("No Error Changing Password Flow",()=>{
 
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
    cy.visit('/auth/login');


    // Wait for the mocked API call
    cy.wait('@getClientUser');


    // Visit the login page
    cy.visit("/setting")


   // Fill out inputs and submit
   cy.get('[data-test="old-password-input"]').type("Test1234!")
   cy.get('[data-test="new-password-input"]').type("Password123")
   cy.get('[data-test="confirm-password-input"]').type("Password123")
   cy.get('[data-test="change-password-btn"]').click()


   //Verify the toast message for successfull password change
   cy.get('.Toastify__toast') .should('be.visible') .contains(/The password has been changed successfully/i);




})


})
