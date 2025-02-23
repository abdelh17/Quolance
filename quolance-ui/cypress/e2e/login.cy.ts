describe("Login Flow", () => {

  it('Error Login Flow - No Inputs', () => {
    // Visit the login page
    cy.visit('/auth/login');
 
 
    // Attempt to login without filling any fields
    cy.get('[data-test="login-submit"]').click();
 
 
    // Verify proper error messages for empty inputs
    cy.get('[data-test="email-input"]').contains(/Invalid email/i);
    cy.get('[data-test="password-input"]').contains(/String must contain at least 1 character\(s\)/i);
 });
 
 
 it('Error Login Flow - Bad Credentials', () => {
  // Mock API error response for bad credentials
  cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: {
          message: 'Bad Credentials',
      },
  }).as('loginError');
 
 
  // Visit the login page
  cy.visit('/auth/login');
 
 
  // Fill out the form with bad credentials
  cy.get('[data-test="email-input"]').type('freelancer@freelancer.com');
  cy.get('[data-test="password-input"]').type('Test1234!');
 
 
  // Submit the form
  cy.get('[data-test="login-submit"]').click();
 
 
  // Wait for the mocked API error
  cy.wait('@loginError');
 
 
  // Verify the "Bad credentials" error is displayed
  cy.get('[data-test="error-message"]').contains(/Bad credentials/i);
 });
 
 
 
 
     it("Success Login Flow As A Client", () => {
 
      // Mock api call for client login
      cy.intercept('POST', '/api/auth/login', {
        statusCode: 200,
      }).as('getSignInUser');
        // Visit the login page
      cy.visit('/auth/login');
 
 
      cy.get('[data-test="email-input"]').type('client1@client.com');
      cy.get('[data-test="password-input"]').type('Test1234');
      cy.get('[data-test="login-submit"]').click();
 
 
      cy.wait('@getSignInUser')
 
 
      // Mock api call for client authentication
 
      cy.intercept('GET', '/api/auth/me', {
        statusCode: 200,
        body: {
          firstName: 'John',
          role: 'CLIENT',
          verified: true,
        },
      }).as('getClientUser');
 
 
      
       // Verify client-specific content
      cy.contains(/Welcome Back, John/i).should('be.visible');
      cy.contains(/Manage your projects and connect with top freelancers/i).should(
        'be.visible'
      );
      cy.contains(/Create your project/i).should('be.visible');
      cy.get('[data-test="post-project-btn"]').contains(/Post a Project/i);
      cy.contains(/Browse candidates/i).should('be.visible');
      cy.get('[data-test="check-repository-btn"]').contains(/Check Repository/i);
     });
 
 
 
 
     it("Success Login Flow As A Freelancer", () => {
      
       // Mock api call for freelancer login
 
       cy.intercept('POST', '/api/auth/login', {
        statusCode: 200,
      }).as('getSignInUser');
 
 
       // Visit the login page
      cy.visit('/auth/login');
      cy.get('[data-test="email-input"]').type('freelancer1@freelancer.com');
      cy.get('[data-test="password-input"]').type('Test1234');
      cy.get('[data-test="login-submit"]').click();
 
 
      cy.wait('@getSignInUser')
 

       // Mock api call for freelancer authentication
       cy.intercept('GET', '/api/auth/me', {
        statusCode: 200,
        body: {
          firstName: 'John',
          role: 'FREELANCER',
          verified: true,
        },
      }).as('getFreelancerUser');
 
 
       // Verify freelancer-specific content
      cy.contains(/Welcome Back, John/i).should('be.visible');
      cy.contains(/Manage your projects and connect with top clients all in one place. Track progress, review submissions, and achieve your goals./i).should(
        'be.visible'
      );
      cy.contains(/View available projects/i).should('be.visible');
      cy.get('[data-test="see-all-projects-btn"]').contains(/See all projects/i);
      cy.contains(/Build my profile/i).should('be.visible');
      cy.get('[data-test="build-profile-btn"]').contains(/Build profile/i);
     });
 
 
     it("Success Login Flow As An Admin", () => {
 
 
       // Mock api call for admin login
 
       cy.intercept('POST', '/api/auth/login', {
        statusCode: 200,
      }).as('getSignInUser');
    
       // Visit the login page
      cy.visit('/auth/login');
      cy.get('[data-test="email-input"]').type('admin1@admin.com');
      cy.get('[data-test="password-input"]').type('Test1234');
      cy.get('[data-test="login-submit"]').click();
     
      cy.wait('@getSignInUser')
 
 
        // Mock api call for admin authentication
        cy.intercept('GET', '/api/auth/me', {
          statusCode: 200,
          body: {
            firstName: 'John',
            role: 'ADMIN',
            verified: true,
          },
        }).as('getAdminUser');
 
 
       // Verify admin-specific content
      cy.contains(/Admin Dashboard/i).should('be.visible');
      cy.get('[data-test="create-admin-card"]').contains(/Create Admin/i);
      cy.get('[data-test="pending-projects-card"]').contains(/Pending Projects/i);
     });
   });
 