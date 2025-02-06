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
     // Verify proper errors shown when submit button clicked with no inputs added to email and password fields.
    cy.get('[data-test="login-submit"]').click();
    cy.get('[data-test="email-input"]').contains(/Invalid email/i);
    cy.get('[data-test="password-input"]').contains(/String must contain at least 1 character\(s\)/i);
     // Verify proper error displayed if credentials are bad (Non-registered email or incorrect password with registered email)
    cy.get('[data-test="email-input"]').type("freelancer@freelancer.com");
    cy.get('[data-test="password-input"]').type("Test1234!");
    cy.get('[data-test="login-submit"]').click();
    cy.wait('@loginError');
    cy.get('[data-test="error-message"]').contains(/Bad credentials/i);
   });
   it("No Error Login Flow As A Client", () => {
 
    // Mock api call for client authentication
    cy.intercept('GET', '/api/auth/me', {
      statusCode: 200,
      body: {
        firstName: 'John',
        role: 'CLIENT',
        verified: true,
      },
    }).as('getClientUser');
     // Visit the login page
    cy.visit('/auth/login');
     // Wait for the mocked API call
    cy.wait('@getClientUser');
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
   it("No Error Login Flow As A Freelancer", () => {
     // Mock api call for freelancer authentication
    cy.intercept('GET', '/api/auth/me', {
      statusCode: 200,
      body: {
        firstName: 'John',
        role: 'FREELANCER',
        verified: true,
      },
    }).as('getFreelancerUser');
     // Visit the login page
    cy.visit('/auth/login');
     // Wait for the mocked API call
    cy.wait('@getFreelancerUser');
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
   it("No Error Login Flow As An Admin", () => {
     // Mock api call for admin authentication
    cy.intercept('GET', '/api/auth/me', {
      statusCode: 200,
      body: {
        firstName: 'John',
        role: 'ADMIN',
        verified: true,
      },
    }).as('getAdminUser');
     // Visit the login page
    cy.visit('/auth/login');
     // Wait for the mocked API call
    cy.wait('@getAdminUser');
     // Verify admin-specific content
    cy.contains(/Admin Dashboard/i).should('be.visible');
    cy.get('[data-test="create-admin-card"]').contains(/Create Admin/i);
    cy.get('[data-test="pending-projects-card"]').contains(/Pending Projects/i);
   });
 });

 