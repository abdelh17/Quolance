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
     // Wait for user authentication to complete
    cy.wait('@getAdminUser');
    // Ensure the create-admin-card exists and is visible
    cy.get('[data-test="create-admin-card"]').should('exist').and('be.visible').click();
    cy.get('[data-test="create-admin-title"]').contains(/Create a new admin/i)
     // Validate empty form errors
    cy.get('[data-test="create-admin-btn"]').click();
    cy.get('[data-test="email-error"]').should('contain.text', 'Invalid email');
    cy.get('[data-test="username-error"]').should('contain.text', 'Username must be between 5 and 50 characters');
    cy.get('[data-test="password-error"]').should('contain.text', 'New password must be at least 8 characters long');
    cy.get('[data-test="passwordConfirm-error"]').should('contain.text', 'Password confirmation is required');
     // Fill in form with mismatched passwords
    cy.get('[data-test="email-input"]').type('admin@admin.com');
    cy.get('[data-test="username-input"]').type('MyUsernameClient123');
    cy.get('[data-test="password-input"]').type('Test1234!');
    cy.get('[data-test="passwordConfirm-input"]').type('Test1234');
    cy.get('[data-test="firstName-input"]').type('John');
    cy.get('[data-test="lastName-input"]').type('Doe');
    cy.get('[data-test="create-admin-btn"]').click();
    cy.get('[data-test="passwordConfirm-error"]').should('contain.text', 'Passwords do not match');
     // Correct passwords but email already exists
    cy.get('[data-test="passwordConfirm-input"]').clear().type('Test1234!');
    cy.get('[data-test="create-admin-btn"]').click();
    cy.wait('@createAdminError');
    cy.get('[data-test="email-error"]').should('contain.text', 'A user with this email already exists.');
  });

  it('Success Create Admin Flow', () => {
    // Mock api call for admin authentication
    cy.intercept('GET', '/api/auth/me', {
      statusCode: 200,
      body: {
        firstName: 'John',
        role: 'ADMIN',
        verified: true,
      },
    }).as('getAdminUser');
    // Mock api success response
    cy.intercept('POST', '/api/users/admin', {
      statusCode: 200,
      body: {
        message: 'Admin created successfully',
      },
    }).as('createAdminSuccess');
    cy.visit('/adminDashboard')
    // Wait for the mocked API call
    cy.wait('@getAdminUser');
    // Visit Create Admin Page
    cy.get('[data-test="create-admin-card"]').click();
    cy.get('[data-test="create-admin-title"]').contains(/Create a new admin/i)
    // Fill out the registration form
    cy.get('[data-test="email-input"]').type('admin@admin.com');
    cy.get('[data-test="username-input"]').type('MyUsernameClient123');
    cy.get('[data-test="password-input"]').type('Test1234!');
    cy.get('[data-test="passwordConfirm-input"]').type('Test1234!');
    cy.get('[data-test="firstName-input"]').type('John');
    cy.get('[data-test="lastName-input"]').type('Doe');
    // Submit the form
    cy.get('[data-test="create-admin-btn"]').click();
    // Wait for the mocked API request
    cy.wait('@createAdminSuccess');
    // Verify redirect to adminDashboard and success toast
    cy.contains(/Admin Dashboard/i).should('be.visible');
    cy.get('.Toastify__toast').should('be.visible').contains('New admin created successfully');
  });
  
  it('Approve Pending Project Flow', () => {
    // Mock API call for admin authentication
    cy.intercept('GET', '/api/auth/me', {
      statusCode: 200,
      body: {
        firstName: 'John',
        role: 'ADMIN',
        verified: true,
      },
    }).as('getAdminUser');
    // Mock API call for fetching pending projects
    cy.intercept(
      'GET',
      '/api/admin/projects/pending/all?page=0&size=5',
      {
        statusCode: 200,
        body: {
          content: [
            {
              id: "1611cfeb-02ac-418a-a03c-d8a9fd203ade",
              title: 'Project One',
              description: 'Description for Project One',
            },
          ],
          pageable: {
            pageNumber: 0,
            pageSize: 5,
          },
          totalElements: 1,
          totalPages: 1,
        },
      }
    ).as('getPendingProjects');
 
 
  
    // Visit the login page
    //cy.visit('/auth/login');
    cy.visit('/adminDashboard')
    // Wait for the mocked API call
    cy.wait('@getAdminUser');
    // Wait for the mocked API call to fetch pending projects
    cy.wait('@getPendingProjects');
    // Visit Pending Projects Page
    cy.get('[data-test="pending-projects-card"]').click();
    cy.get('[data-test="update-project-status"]').contains(/Update Project Status/i).should('be.visible')
    // Assert that the projects are displayed on the page
    cy.contains('Project One').should('be.visible');
    // Click the update Status button for the first project
    cy.get('[data-test="project-1611cfeb-02ac-418a-a03c-d8a9fd203ade"]').click();
 
 
     // Open the dropdown
     cy.get('[data-test="status-dropdown"]').click();
 
 
     // Select the "Approved" option
     cy.get('[data-test="status-options"]')
       .find('[data-test="status-option-Approved"]')
       .click();
    // Click the submit button to approve project
    cy.get('[data-test="submit-project-btn"]').click();
    // Verify modal popup for approved status and press confirm button
    cy.get('[data-test="warning-modal-message"]').contains('Are you sure you want to change the status to approved? This action cannot be undone.').should('be.visible');
   
    cy.get('[data-test="modal-confirm-btn"]').should('be.visible');
    cy.get('[data-test="modal-confirm-btn"]').click();
    // Verify redirect to adminDashboard and success toast
   cy.contains(/Admin Dashboard/i).should('be.visible');
   cy.get('.Toastify__toast').should('be.visible').contains(/Project status is updated to approved!/i);
  });
 
 
  it('Reject Pending Project Flow', () => {
    // Mock API call for admin authentication
    cy.intercept('GET', '/api/auth/me', {
      statusCode: 200,
      body: {
        firstName: 'Tom',
        role: 'ADMIN',
        verified: true,
      },
    }).as('getAdminUser');
    // Mock API call for fetching pending projects
    cy.intercept(
      'GET',
      '/api/admin/projects/pending/all?page=0&size=5',
      {
        statusCode: 200,
        body: {
          content: [
            {
              id: "1611cfeb-02ac-418a-a03c-d8a9fd203afe",
              title: 'Project One',
              description: 'Description for Project One',
            },
          ],
          pageable: {
            pageNumber: 0,
            pageSize: 5,
          },
          totalElements: 1,
          totalPages: 1,
        },
      }
    ).as('getPendingProjects');
 
 
  
    // Visit the login page
    //cy.visit('/auth/login');
    cy.visit('/adminDashboard')
    // Wait for the mocked API call
    cy.wait('@getAdminUser');
    // Wait for the mocked API call to fetch pending projects
    cy.wait('@getPendingProjects');
    // Visit Pending Projects Page
    cy.get('[data-test="pending-projects-card"]').click();
    cy.get('[data-test="update-project-status"]').contains(/Update Project Status/i).should('be.visible')
    // Assert that the projects are displayed on the page
    cy.contains('Project One').should('be.visible');
    // Click the update Status button for the first project
    cy.get('[data-test="project-1611cfeb-02ac-418a-a03c-d8a9fd203afe"]').click();
 
 
     // Open the dropdown
     cy.get('[data-test="status-dropdown"]').click();
 
 
     // Select the "Rejected" option
     cy.get('[data-test="status-options"]')
       .find('[data-test="status-option-Rejected"]')
       .click();
 
 
    cy.contains(/Reason for Rejection/i)
 
 
    cy.get('[data-test="submit-project-btn"]').should('be.disabled')
 
 
    cy.get('[data-test="rejection-reason-input"]').type("This project is rejected for breaking Quolance rules.")
    // Click the submit button to reject project
    cy.get('[data-test="submit-project-btn"]').click();
    // Verify modal popup for approved status and press confirm button
    cy.get('[data-test="warning-modal-message"]').contains('Are you sure you want to change the status to rejected? This action cannot be undone.').should('be.visible');
   
    cy.get('[data-test="modal-confirm-btn"]').should('be.visible');
    cy.get('[data-test="modal-confirm-btn"]').click();
    // Verify redirect to adminDashboard and success toast
   cy.contains(/Admin Dashboard/i).should('be.visible');
   cy.get('.Toastify__toast').should('be.visible').contains(/Project status is updated to rejected!/i);
  });
 
 
 });
 