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
      // Verify proper label of 'Create an account' on button when first navigating to the registration page.
      cy.get('[data-test="select-role"]').contains(/Create an account/i);
      // Verify proper label of 'Join as a client' on button when clicking on 'I'm a client...' card.
      cy.get('[data-test="client-role"]').click();
      cy.get('[data-test="select-role"]').contains(/Join as a client/i);
      // Verify proper label of 'Apply as a freelancer' on button when clicking on 'I'm a freelancer...' card.
      cy.get('[data-test="freelancer-role"]').click();
      cy.get('[data-test="select-role"]').contains(/Join as a freelancer/i);
      // Verify proper errors shown when submit button clicked with no inputs added to email, username, password, and confirm password fields.
      cy.get('[data-test="select-role"]').click();
      cy.get('[data-test="register-submit"]').contains(/Register as a freelancer/i);
      cy.get('[data-test="register-submit"]').click();
      cy.get('[data-test="email-input"]').contains(/Invalid email/i);
      cy.get('[data-test="username-input"]').contains(/String must contain at least 8 character\(s\)/i);
      cy.get('[data-test="password-input"]').contains(/String must contain at least 8 character\(s\)/i);
      cy.get('[data-test="passwordConfirm-input"]').contains(/String must contain at least 8 character\(s\)/i);
      // Verify the passwords not matching error is displayed
      cy.get('[data-test="firstName-input"]').type("John");
      cy.get('[data-test="lastName-input"]').type("Doe");
      cy.get('[data-test="email-input"]').type("freelancer@freelancer.com");
      cy.get('[data-test="username-input"]').type("Username12345");
      cy.get('[data-test="password-input"]').type("Test1234!");
      cy.get('[data-test="passwordConfirm-input"]').type("Test1234");
      cy.get('[data-test="register-submit"]').click();
      cy.get('[data-test="passwordConfirm-input"]').contains(/Passwords do not match/i);
      // Verify the email already exists error is displayed
      cy.get('[data-test="passwordConfirm-input"] input').clear();
      cy.get('[data-test="passwordConfirm-input"]').type("Test1234!");
      cy.get('[data-test="register-submit"]').click();
      cy.wait('@registerUserError');
      cy.get('[data-test="error-message"]').contains(/A user with this email already exists./i);
    });
    it("No Error Registration Flow For Freelancer Option", () => {
       // Mock api success response
      cy.intercept('POST', '/api/users', {
        statusCode: 200,
        body: {
          message: 'Account created successfully',
        },
      }).as('registerUserSuccess');
      // Visit the registration page
      cy.visit('/auth/register');
      // Select the "Freelancer" option
      cy.get('[data-test="freelancer-role"]').click();
      // Click the submit button to proceed
      cy.get('[data-test="select-role"]').click();
      // Fill out the registration form
      cy.get('[data-test="firstName-input"]').type("John");
      cy.get('[data-test="lastName-input"]').type("Doe");
      cy.get('[data-test="email-input"]').type("freelancer@freelancer.com");
      cy.get('[data-test="username-input"]').type("Username12345");
      cy.get('[data-test="password-input"]').type("Test1234!");
      cy.get('[data-test="passwordConfirm-input"]').type("Test1234!");
      // Submit the form
      cy.get('[data-test="register-submit"]').click();
      // Wait for the mocked API request
      cy.wait('@registerUserSuccess');
      // Verify the success message is displayed
      cy.get('[data-test="success-message"]').contains(/Account Created/i);
    });
   });
   