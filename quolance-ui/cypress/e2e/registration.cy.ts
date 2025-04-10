describe('Registration Flow', () => {


    it('Error Registration Flow - No Input', () => {
        // Visit the registration page
        cy.visit('/auth/register');


        // Verify proper label of 'Create an account' on button when first navigating to the registration page
        cy.get('[data-test="select-role"]').contains(/Create an account/i);


        // Select "Freelancer" role
        cy.get('[data-test="freelancer-role"]').click();
        cy.get('[data-test="select-role"]').contains(/Join as a freelancer/i);


        // Attempt to register without filling any fields
        cy.get('[data-test="select-role"]').click();
        cy.get('[data-test="register-submit"]').contains(/Register as a freelancer/i);
        cy.get('[data-test="register-submit"]').click();


        // Verify error messages for empty inputs
        cy.contains('Invalid email').should('exist');
        cy.contains('Username must be at least 8 characters').should('exist');
        cy.contains('Password must be at least 8 characters long').should('exist');
        cy.contains('String must contain at least 8 character(s)').should('exist');
    });




    it('Error Registration Flow - Mismatched Passwords', () => {
        cy.visit('/auth/register');


        cy.get('[data-test="select-role"]').contains(/Create an account/i);
        cy.get('[data-test="freelancer-role"]').click();
        cy.get('[data-test="select-role"]').contains(/Join as a freelancer/i);


        cy.get('[data-test="select-role"]').click();
        cy.get('[data-test="register-submit"]').contains(/Register as a freelancer/i);


        cy.get('[data-test="firstName-input"]').type('John');
        cy.get('[data-test="lastName-input"]').type('Doe');
        cy.get('[data-test="email-input"]').type('freelancer@freelancer.com');
        cy.get('[data-test="username-input"]').type('Username12345');
        cy.get('[data-test="password-input"]').type('Test1234!');
        cy.get('[data-test="passwordConfirm-input"]').type('Test1234'); // Mismatched password


        cy.get('[data-test="register-submit"]').click();


        cy.get('[data-test="passwordConfirm-input"]').contains(/Passwords do not match/i);
    });






    it('Error Registration Flow - Email Exists', () => {
        cy.intercept('POST', '/api/users', {
            statusCode: 400,
            body: {
                message: 'A user with this email already exists.',
            },
        }).as('registerUserError');


        cy.visit('/auth/register');


        cy.get('[data-test="select-role"]').contains(/Create an account/i);
        cy.get('[data-test="freelancer-role"]').click();
        cy.get('[data-test="select-role"]').contains(/Join as a freelancer/i);


        cy.get('[data-test="select-role"]').click();
        cy.get('[data-test="register-submit"]').contains(/Register as a freelancer/i);


        cy.get('[data-test="firstName-input"]').type('John');
        cy.get('[data-test="lastName-input"]').type('Doe');
        cy.get('[data-test="email-input"]').type('freelancer@freelancer.com');
        cy.get('[data-test="username-input"]').type('Username12345');
        cy.get('[data-test="password-input"]').type('Test1234!');
        cy.get('[data-test="passwordConfirm-input"]').type('Test1234!');


        cy.get('[data-test="register-submit"]').click();
        cy.wait('@registerUserError');
        cy.get('[data-test="error-message"]').contains(/A user with this email already exists./i);
    });


    it("Success Registration Flow For Freelancer Option", () => {
        cy.intercept('POST', '/api/users', {
            statusCode: 200,
            body: {
                message: 'Account created successfully',
            },
        }).as('registerUserSuccess');


        cy.visit('/auth/register');


        cy.get('[data-test="freelancer-role"]').click();
        cy.get('[data-test="select-role"]').click();


        cy.contains(/Discover projects that match your skills/i);


        cy.get('[data-test="firstName-input"]').type('John');
        cy.get('[data-test="lastName-input"]').type('Doe');
        cy.get('[data-test="email-input"]').type('freelancer@freelancer.com');
        cy.get('[data-test="username-input"]').clear().type('Username12345');
        cy.get('[data-test="password-input"]').type('Test1234!');
        cy.get('[data-test="passwordConfirm-input"]').type('Test1234!');


        cy.get('[data-test="register-submit"]').contains(/Register as a freelancer/i);
        cy.get('[data-test="register-submit"]').click();


        cy.wait('@registerUserSuccess');
        cy.get('[data-test="success-message"]').contains(/Account Created/i);
    });






    it("Success Registration Flow For Client Option", () => {
        cy.intercept('POST', '/api/users', {
            statusCode: 200,
            body: {
                message: 'Account created successfully',
            },
        }).as('registerUserSuccess');


        cy.visit('/auth/register');


        cy.get('[data-test="client-role"]').click();
        cy.get('[data-test="select-role"]').click();


        cy.contains(/Find the perfect talent for your projects/i);
        cy.get('[data-test="firstName-input"]').type("Sam");
        cy.get('[data-test="lastName-input"]').type("Thompson");
        cy.get('[data-test="email-input"]').type("client@client.com");
        cy.get('[data-test="username-input"]').type("Username123456");
        cy.get('[data-test="password-input"]').type("Test1234!");
        cy.get('[data-test="passwordConfirm-input"]').type("Test1234!");


        cy.get('[data-test="register-submit"]').contains(/Register as a client/i);
        cy.get('[data-test="register-submit"]').click();


        cy.wait('@registerUserSuccess');
        cy.get('[data-test="success-message"]').contains(/Account Created/i);
    });


});





