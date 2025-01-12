// describe('Admin Flow', () => {
//
//
//
//
//   it('Error Create Admin Flow', () => {
//     // Mock api call for admin authentication
//     cy.intercept('GET', '/api/auth/me', {
//       statusCode: 200,
//       body: {
//       firstName: 'John',
//       role: 'ADMIN',
//       verified: true,
//       },
//   }).as('getAdminUser');
//
//
//    // Mock api error response
//    cy.intercept('POST', '/api/users/admin', {
//     statusCode: 400,
//     body: {
//       message: 'A user with this email already exists.',
//     },
//   }).as('createAdminError');
//
//
//     // Visit the login page
//     cy.visit('/auth/login');
//
//
//     // Wait for the mocked API call
//     cy.wait('@getAdminUser');
//
//
//
//
//     // Visit Create Admin Page
//     cy.get('[data-test="create-admin-card"]').click()
//
//
//     // Verify proper errors shown when submit button clicked with no inputs added.
//     cy.get('[data-test="create-admin-btn"]').click()
//     cy.get('[data-test="email-error"]').contains(/Invalid email/i)
//     cy.get('[data-test="password-error"]').contains(/String must contain at least 8 character\(s\)/i);
//     cy.get('[data-test="passwordConfirm-error"]').contains(/String must contain at least 8 character\(s\)/i);
//
//
//      // Verify the passwords not matching error is displayed
//      cy.get('[data-test="firstName-input"]').type("John");
//      cy.get('[data-test="lastName-input"]').type("Doe");
//      cy.get('[data-test="email-input"]').type("admin@admin.com");
//      cy.get('[data-test="password-input"]').type("Test1234!");
//      cy.get('[data-test="passwordConfirm-input"]').type("Test1234");
//      cy.get('[data-test="create-admin-btn"]').click()
//      cy.get('[data-test="passwordConfirm-error"]').contains(/Passwords do not match/i);
//
//
//       // Verify the email already exists error is displayed
//       cy.get('[data-test="passwordConfirm-input"]').clear();
//       cy.get('[data-test="passwordConfirm-input"]').type("Test1234!");
//       cy.get('[data-test="create-admin-btn"]').click()
//       cy.wait('@createAdminError');
//       cy.get('[data-test="error-message"]').contains(/A user with this email already exists./i)
//
//   });
//
//
//   it("No Error Create Admin Flow", () =>{
//
//
//       // Mock api call for admin authentication
//       cy.intercept('GET', '/api/auth/me', {
//         statusCode: 200,
//         body: {
//         firstName: 'John',
//         role: 'ADMIN',
//         verified: true,
//         },
//     }).as('getAdminUser');
//
//       // Mock api error response
//       cy.intercept('POST', '/api/users/admin', {
//         statusCode: 200,
//         body: {
//           message: 'Admin created successfully',
//         },
//       }).as('createAdminSuccess');
//
//
//         // Visit the login page
//       cy.visit('/auth/login');
//
//
//       // Wait for the mocked API call
//       cy.wait('@getAdminUser');
//
//
//
//
//       // Visit Create Admin Page
//       cy.get('[data-test="create-admin-card"]').click()
//
//
//       // Fill out the registration form
//       cy.get('[data-test="firstName-input"]').type("John");
//       cy.get('[data-test="lastName-input"]').type("Doe");
//       cy.get('[data-test="email-input"]').type("admin@admin.com");
//       cy.get('[data-test="password-input"]').type("Test1234!");
//       cy.get('[data-test="passwordConfirm-input"]').type("Test1234!");
//
//
//       // Submit the form
//       cy.get('[data-test="create-admin-btn"]').click()
//
//
//       // Wait for the mocked API request
//       cy.wait('@createAdminSuccess');
//
//
//       //Verify redirect to adminDashboard and success toast
//       cy.contains(/Admin Dashboard/i).should('be.visible');
//       cy.get('.Toastify__toast') .should('be.visible') .contains('New admin created successfully');
//
//
//   })
//
//
//     it('Approve Pending Project Flow', () => {
//       // Mock API call for admin authentication
//       cy.intercept('GET', '/api/auth/me', {
//         statusCode: 200,
//         body: {
//           firstName: 'John',
//           role: 'ADMIN',
//           verified: true,
//         },
//       }).as('getAdminUser');
//        // Mock API call for fetching pending projects
//       cy.intercept('GET', '/api/admin/projects/pending/all', {
//         statusCode: 200,
//         body: [
//           {
//             id: 1,
//             title: 'Project One',
//             description: 'Description for Project One',
//             expirationDate: '2025-01-10',
//             visibilityExpirationDate: null,
//             category: 'Category One',
//             priceRange: '$1000 - $2000',
//             experienceLevel: 'Intermediate',
//             expectedDeliveryTime: '1 month',
//             projectStatus: 'pending',
//             tags: ['JAVA', 'JAVASCRIPT'],
//             clientId: 1,
//             selectedFreelancerId: null,
//             applications: [],
//           },
//         ],
//       }).as('getPendingProjects');
//        // Visit the login page
//       cy.visit('/auth/login');
//        // Wait for the mocked API call
//       cy.wait('@getAdminUser');
//        // Visit Pending Projects Page
//       cy.get('[data-test="pending-projects-card"]').click();
//        // Wait for the mocked API call to fetch pending projects
//       cy.wait('@getPendingProjects');
//        // Assert that the projects are displayed on the page
//       cy.contains('Project One').should('be.visible');
//
//
//       // Click the update Status button for first project
//       cy.get('[data-test="project-1"]').click();
//
//
//       // Open the dropdown to select the approved status
//       /*
//       cy.get('.lg\\:w-96').click();
//       cy.contains('Approved').click();
//       */
//
//
//       //Click the submit button to approve project
//       cy.get('[data-test="submit-project-btn"]').click();
//
//
//       //Verify modal popup for approved status and press confirm button
//       cy.contains('Are you sure you want to change the status to approved? This action cannot be undone.').should('be.visible');
//       cy.get('[data-test="modal-confirm-btn"]').click();
//
//
//        //Verify redirect to adminDashboard and success toast
//        cy.contains(/Admin Dashboard/i).should('be.visible');
//        cy.get('.Toastify__toast') .should('be.visible') .contains(/Project status is updated to approved!/i);
//
//
//
//
//     });
//
//     /*
//     it('Reject Pending Project Flow', () => {
//       // Mock API call for admin authentication
//       cy.intercept('GET', '/api/auth/me', {
//         statusCode: 200,
//         body: {
//           firstName: 'John',
//           role: 'ADMIN',
//           verified: true,
//         },
//       }).as('getAdminUser');
//        // Mock API call for fetching pending projects
//       cy.intercept('GET', '/api/admin/projects/pending/all', {
//         statusCode: 200,
//         body: [
//           {
//             id: 1,
//             title: 'Project One',
//             description: 'Description for Project One',
//             expirationDate: '2025-01-10',
//             visibilityExpirationDate: null,
//             category: 'Category One',
//             priceRange: '$1000 - $2000',
//             experienceLevel: 'Intermediate',
//             expectedDeliveryTime: '1 month',
//             projectStatus: 'pending',
//             tags: ['JAVA', 'JAVASCRIPT'],
//             clientId: 1,
//             selectedFreelancerId: null,
//             applications: [],
//           },
//         ],
//       }).as('getPendingProjects');
//        // Visit the login page
//       cy.visit('/auth/login');
//        // Wait for the mocked API call
//       cy.wait('@getAdminUser');
//        // Visit Pending Projects Page
//       cy.get('[data-test="pending-projects-card"]').click();
//        // Wait for the mocked API call to fetch pending projects
//       cy.wait('@getPendingProjects');
//        // Assert that the projects are displayed on the page
//       cy.contains('Project One').should('be.visible');
//
//
//
//       // Click the update Status button for first project
//       cy.get('[data-test="project-1"]').click();
//
//
//       // Open the dropdown to select the rejected status and write reason for rejection
//       cy.get('.lg\\:w-96').click();
//       cy.contains('Rejected').click();
//       cy.get('[data-test="rejection-reason-input"]').type("This project does not abide to our advertising products restrictions");
//
//
//       //Click the submit button to reject project
//       cy.get('[data-test="submit-project-btn"]').click();
//
//
//       //Verify modal popup for approved status and press confirm button
//       cy.contains('Are you sure you want to change the status to rejected? This action cannot be undone.').should('be.visible');
//       cy.get('[data-test="modal-confirm-btn"]').click();
//
//
//        //Verify redirect to adminDashboard and success toast
//        cy.contains(/Admin Dashboard/i).should('be.visible');
//        cy.get('.Toastify__toast') .should('be.visible') .contains(/Project status is updated to rejected!/i);
//
//
//
//
//     })*/
//
//  });
//