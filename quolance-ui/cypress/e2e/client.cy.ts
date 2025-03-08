describe('Client Flow', () => {
  
  it('Error Create Project Flow', () => {
   
    cy.intercept('GET', '/api/auth/me', {
      statusCode: 200,
      body: {
        firstName: 'John',
        role: 'CLIENT',
        verified: true,
      },
    }).as('getClientUser');
 
 
    cy.visit('/dashboard')
    // Wait for user authentication to complete
   cy.wait('@getClientUser');
 
 
   cy.get('[data-test="create-project-title"]').contains(/Create your project/i);
   cy.get('[data-test="create-project-desc"]').contains(/Create a project and get the best freelancers to work on it./i);
   cy.get('[data-test="post-project-btn"]').click();
 
 
   cy.get('[data-test="project-step1-title"]').contains(/Basic Project Information/i);
 
 
 
 
   cy.get('[data-test="next-btn-step1"]').click();
   cy.get('[data-test="project-title-error"]').contains(/Project Title is required/i);
   cy.get('[data-test="project-desc-error"]').contains(/Project Description is required/i);
   cy.get('[data-test="project-location-error"]').contains(/Location is required/i);
 
 
   })
 
 
  it('Success Edit Project Flow', () => {
   
    cy.intercept('GET', '/api/auth/me', {
      statusCode: 200,
      body: {
        id:"1eb87a21-c6cb-423b-aa36-48c453e0ddde",
        firstName: 'John',
        role: 'CLIENT',
        verified: true,
      },
    }).as('getClientUser');
 
 
    cy.visit('/dashboard')
    // Wait for user authentication to complete
   cy.wait('@getClientUser');
 
 
   cy.intercept(
    'GET',
    '/api/client/projects/all?page=0&size=2&sortBy=id&sortDirection=asc',
    {
      statusCode: 200,
      body: {
        "content": [
            {
                "id": "cf5408bf-c564-4323-91cc-6f9a7cc993ff",
                "title": "Project title1",
                "description": "Project description",
                "expirationDate": "2025-11-12",
                "visibilityExpirationDate": null,
                "category": "WEB_DEVELOPMENT",
                "priceRange": "LESS_500",
                "experienceLevel": "JUNIOR",
                "expectedDeliveryTime": "IMMEDIATELY",
                "projectStatus": "PENDING",
                "tags": ["JAVA"],
                "clientId": "1eb87a21-c6cb-423b-aa36-48c453e0ddde",
                "selectedFreelancerId": null,
                "applications": [],
                "creationDate": "2025-02-20T15:10:14.27422"
            }
        ],
        "metadata": {
            "pageNumber": 0,
            "pageSize": 2,
            "totalElements": 1,
            "totalPages": 1,
            "first": true,
            "last": true,
            "sortBy": "id",
            "sortDirection": "asc"
        }
      }
    }
  ).as('getClientProjects');
  
  cy.get('[data-test="edit-project-btn"]').click();
 
 
  cy.intercept(
    'GET',
    '/api/client/projects/cf5408bf-c564-4323-91cc-6f9a7cc993ff',
    {
      statusCode: 200,
      body: {
                "id": "cf5408bf-c564-4323-91cc-6f9a7cc993ff",
                "title": "Project title1",
                "description": "Project description",
                "expirationDate": "2025-11-12",
                "visibilityExpirationDate": null,
                "category": "WEB_DEVELOPMENT",
                "priceRange": "LESS_500",
                "experienceLevel": "JUNIOR",
                "expectedDeliveryTime": "IMMEDIATELY",
                "projectStatus": "PENDING",
                "tags": ["JAVA"],
                "clientId": "1eb87a21-c6cb-423b-aa36-48c453e0ddde",
                "selectedFreelancerId": null,
                "applications": [],
                "creationDate": "2025-02-20T15:10:14.27422"
      }
    }
  ).as('getClientProject');
  
 
 
  cy.intercept(
    'PUT',
    '/api/client/projects/cf5408bf-c564-4323-91cc-6f9a7cc993ff',
    {
      statusCode: 200,
      body: {
                "id": "cf5408bf-c564-4323-91cc-6f9a7cc993ff",
                "title": "Updated Project Title",
                "description": "Updated Project description",
                "expirationDate": "2025-11-12",
                "visibilityExpirationDate": null,
                "category": "WEB_DEVELOPMENT",
                "priceRange": "LESS_500",
                "experienceLevel": "JUNIOR",
                "expectedDeliveryTime": "IMMEDIATELY",
                "projectStatus": "PENDING",
                "tags": ["JAVA"],
                "clientId": "1eb87a21-c6cb-423b-aa36-48c453e0ddde",
                "selectedFreelancerId": null,
                "applications": [],
                "creationDate": "2025-02-20T15:10:14.27422"
      }
    }
  ).as('getUpdateClientProject');
 
 
  cy.get('[data-test="update-project-btn"]').click();
 
 
  cy.get('.Toastify__toast').should('be.visible').contains(/Project updated successfully/i);
 
 
   })
 
 
  it('Verify Update Button is Not Visible When Project Is Open', () => {
   
    cy.intercept('GET', '/api/auth/me', {
      statusCode: 200,
      body: {
        id:"1eb87a21-c6cb-423b-aa36-48c453e0ddde",
        firstName: 'John',
        role: 'CLIENT',
        verified: true,
      },
    }).as('getClientUser');
 
 
    cy.visit('/dashboard')
    // Wait for user authentication to complete
   cy.wait('@getClientUser');
 
 
   cy.intercept(
    'GET',
    '/api/client/projects/all?page=0&size=2&sortBy=id&sortDirection=asc',
    {
      statusCode: 200,
      body: {
        "content": [
            {
                "id": "cf5408bf-c564-4323-91cc-6f9a7cc993ff",
                "title": "Project title1",
                "description": "Project description",
                "expirationDate": "2025-11-12",
                "visibilityExpirationDate": null,
                "category": "WEB_DEVELOPMENT",
                "priceRange": "LESS_500",
                "experienceLevel": "JUNIOR",
                "expectedDeliveryTime": "IMMEDIATELY",
                "projectStatus": "OPEN",
                "tags": ["JAVA"],
                "clientId": "1eb87a21-c6cb-423b-aa36-48c453e0ddde",
                "selectedFreelancerId": null,
                "applications": [],
                "creationDate": "2025-02-20T15:10:14.27422"
            }
        ],
        "metadata": {
            "pageNumber": 0,
            "pageSize": 2,
            "totalElements": 1,
            "totalPages": 1,
            "first": true,
            "last": true,
            "sortBy": "id",
            "sortDirection": "asc"
        }
      }
    }
  ).as('getClientProjects');
  
  cy.get('[data-test="edit-project-btn"]').click();
 
 
  cy.intercept(
    'GET',
    '/api/client/projects/cf5408bf-c564-4323-91cc-6f9a7cc993ff',
    {
      statusCode: 200,
      body: {
                "id": "cf5408bf-c564-4323-91cc-6f9a7cc993ff",
                "title": "Project title3",
                "description": "Project description3",
                "expirationDate": "2025-11-12",
                "visibilityExpirationDate": null,
                "category": "WEB_DEVELOPMENT",
                "priceRange": "LESS_500",
                "experienceLevel": "JUNIOR",
                "expectedDeliveryTime": "IMMEDIATELY",
                "projectStatus": "OPEN",
                "tags": ["JAVA"],
                "clientId": "1eb87a21-c6cb-423b-aa36-48c453e0ddde",
                "selectedFreelancerId": null,
                "applications": [],
                "creationDate": "2025-02-20T15:10:14.27422"
      }
    }
  ).as('getClientProject');
  
 
 
  cy.get('[data-test="update-project-btn"]').should('not.exist');
 
 
 
 
 
 
   })
 
 
  it('Verify Update Button is Not Visible When Project Is Rejected', () => {
   
    cy.intercept('GET', '/api/auth/me', {
      statusCode: 200,
      body: {
        id:"1eb87a21-c6cb-423b-aa36-48c453e0ddde",
        firstName: 'John',
        role: 'CLIENT',
        verified: true,
      },
    }).as('getClientUser');
 
 
    cy.visit('/dashboard')
    // Wait for user authentication to complete
   cy.wait('@getClientUser');
 
 
   cy.intercept(
    'GET',
    '/api/client/projects/all?page=0&size=2&sortBy=id&sortDirection=asc',
    {
      statusCode: 200,
      body: {
        "content": [
            {
                "id": "cf5408bf-c564-4323-91cc-6f9a7cc993ff",
                "title": "Project title2",
                "description": "Project description2",
                "expirationDate": "2025-11-12",
                "visibilityExpirationDate": null,
                "category": "WEB_DEVELOPMENT",
                "priceRange": "LESS_500",
                "experienceLevel": "JUNIOR",
                "expectedDeliveryTime": "IMMEDIATELY",
                "projectStatus": "REJECTED",
                "tags": ["JAVA"],
                "clientId": "1eb87a21-c6cb-423b-aa36-48c453e0ddde",
                "selectedFreelancerId": null,
                "applications": [],
                "creationDate": "2025-02-20T15:10:14.27422"
            }
        ],
        "metadata": {
            "pageNumber": 0,
            "pageSize": 2,
            "totalElements": 1,
            "totalPages": 1,
            "first": true,
            "last": true,
            "sortBy": "id",
            "sortDirection": "asc"
        }
      }
    }
  ).as('getClientProjects');
  
  cy.get('[data-test="edit-project-btn"]').click();
 
 
  cy.intercept(
    'GET',
    '/api/client/projects/cf5408bf-c564-4323-91cc-6f9a7cc993ff',
    {
      statusCode: 200,
      body: {
                "id": "cf5408bf-c564-4323-91cc-6f9a7cc993ff",
                "title": "Project title2",
                "description": "Project description2",
                "expirationDate": "2025-11-12",
                "visibilityExpirationDate": null,
                "category": "WEB_DEVELOPMENT",
                "priceRange": "LESS_500",
                "experienceLevel": "JUNIOR",
                "expectedDeliveryTime": "IMMEDIATELY",
                "projectStatus": "REJECTED",
                "tags": ["JAVA"],
                "clientId": "1eb87a21-c6cb-423b-aa36-48c453e0ddde",
                "selectedFreelancerId": null,
                "applications": [],
                "creationDate": "2025-02-20T15:10:14.27422"
      }
    }
  ).as('getClientProject');
  
 
 
  cy.get('[data-test="update-project-btn"]').should('not.exist');
 
 
 
 
 
 
   })
 
 
  it('Approve Application Flow', () => {
   
    cy.intercept('GET', '/api/auth/me', {
      statusCode: 200,
      body: {
        id:"1eb87a21-c6cb-423b-aa36-48c453e0ddde",
        firstName: 'John',
        role: 'CLIENT',
        verified: true,
      },
    }).as('getClientUser');
 
 
    cy.visit('/dashboard')
    // Wait for user authentication to complete
   cy.wait('@getClientUser');
 
 
   cy.intercept(
    'GET',
    '/api/client/projects/all?page=0&size=2&sortBy=id&sortDirection=asc',
    {
      statusCode: 200,
      body: {
        "content": [
            {
                "id": "cf5408bf-c564-4323-91cc-6f9a7cc993ff",
                "title": "Project title20",
                "description": "Project description20",
                "expirationDate": "2025-11-12",
                "visibilityExpirationDate": null,
                "category": "WEB_DEVELOPMENT",
                "priceRange": "LESS_500",
                "experienceLevel": "JUNIOR",
                "expectedDeliveryTime": "IMMEDIATELY",
                "projectStatus": "OPEN",
                "tags": ["JAVA"],
                "clientId": "1eb87a21-c6cb-423b-aa36-48c453e0ddde",
                "selectedFreelancerId": null,
                "applications": [
                  {
                    "id": "0774fd97-6e72-430c-91c0-d1fcef1cdad1",
                    "status": "APPLIED",
                    "projectId": "cf5408bf-c564-4323-91cc-6f9a7cc993ff",
                    "projectTitle": "Project title20",
                    "freelancerId": "41d21fbf-4386-4e92-978c-ef425794c991",
                    "freelancerProfile": {
                        "id": "a9d50868-58a6-4fe0-b3ce-79aad1ed21b6",
                        "userId": "41d21fbf-4386-4e92-978c-ef425794c991",
                        "firstName": "Nermin",
                        "lastName": "Karapandzic",
                        "username": null,
                        "profileImageUrl": null,
                        "bio": "Nermin Karapandzic bio.",
                        "contactEmail": "freelancer@freelancer.com",
                        "city": null,
                        "state": null,
                        "experienceLevel": null,
                        "socialMediaLinks": [],
                        "skills": [],
                        "availability": null
                    },
                    "creationDate": "2025-02-20T22:11:47.435626"
                },
                ],
                "creationDate": "2025-02-20T15:10:14.27422"
            }
        ],
        "metadata": {
            "pageNumber": 0,
            "pageSize": 2,
            "totalElements": 1,
            "totalPages": 1,
            "first": true,
            "last": true,
            "sortBy": "id",
            "sortDirection": "asc"
        }
      }
    }
  ).as('getClientProjects');
  
  cy.get('[data-test="view-applicants-btn"]').click();
 
 
  cy.intercept(
    'GET',
    '/api/client/projects/cf5408bf-c564-4323-91cc-6f9a7cc993ff',
    {
      statusCode: 200,
      body: {
                "id": "cf5408bf-c564-4323-91cc-6f9a7cc993ff",
                "title": "Project title20",
                "description": "Project description20",
                "expirationDate": "2025-11-12",
                "visibilityExpirationDate": null,
                "category": "WEB_DEVELOPMENT",
                "priceRange": "LESS_500",
                "experienceLevel": "JUNIOR",
                "expectedDeliveryTime": "IMMEDIATELY",
                "projectStatus": "OPEN",
                "tags": ["JAVA"],
                "clientId": "1eb87a21-c6cb-423b-aa36-48c453e0ddde",
                "selectedFreelancerId": null,
                "applications": [
                  {
                    "id": "0774fd97-6e72-430c-91c0-d1fcef1cdad1",
                    "status": "APPLIED",
                    "projectId": "cf5408bf-c564-4323-91cc-6f9a7cc993ff",
                    "projectTitle": "Project title20",
                    "freelancerId": "41d21fbf-4386-4e92-978c-ef425794c991",
                    "freelancerProfile": {
                        "id": "a9d50868-58a6-4fe0-b3ce-79aad1ed21b6",
                        "userId": "41d21fbf-4386-4e92-978c-ef425794c991",
                        "firstName": "Nermin",
                        "lastName": "Karapandzic",
                        "username": null,
                        "profileImageUrl": null,
                        "bio": "Nermin Karapandzic bio.",
                        "contactEmail": "freelancer@freelancer.com",
                        "city": null,
                        "state": null,
                        "experienceLevel": null,
                        "socialMediaLinks": [],
                        "skills": [],
                        "availability": null
                    },
                    "creationDate": "2025-02-20T22:11:47.435626"
                },
                ],
                "creationDate": "2025-02-20T15:10:14.27422"
      }
    }
  ).as('getClientProject');
 
 
  cy.intercept(
    'GET',
    '/api/client/projects/cf5408bf-c564-4323-91cc-6f9a7cc993ff/applications/all',
    {
      statusCode: 200,
      body: [
        {
            "id": "0774fd97-6e72-430c-91c0-d1fcef1cdad1",
            "status": "APPLIED",
            "projectId": "cf5408bf-c564-4323-91cc-6f9a7cc993ff",
            "projectTitle": "Project title20",
            "freelancerId": "41d21fbf-4386-4e92-978c-ef425794c991",
            "freelancerProfile": {
                "id": "a9d50868-58a6-4fe0-b3ce-79aad1ed21b6",
                "userId": "41d21fbf-4386-4e92-978c-ef425794c991",
                "firstName": "Nermin",
                "lastName": "Karapandzic",
                "username": null,
                "profileImageUrl": null,
                "bio": "Nermin Karapandzic bio.",
                "contactEmail": "freelancer@freelancer.com",
                "city": null,
                "state": null,
                "experienceLevel": null,
                "socialMediaLinks": [],
                "skills": [],
                "availability": null
            },
            "creationDate": "2025-02-20T22:11:47.435626"
        }
      ]
    }
 ).as('getClientProjectApplications');
 
 
 // Ensure the status is correct before interacting
cy.contains('Approve Submission').should('exist');

// Check if the button exists and is not disabled
cy.get('[data-test="approve-submission-btn"]')
  .should('exist')
  .should('not.be.disabled')
  .click();
 
 
 //cy.get('[data-test="approve-submission-btn"]').click();
 
 
 cy.intercept(
  'POST',
  '/api/client/applications/0774fd97-6e72-430c-91c0-d1fcef1cdad1/select-freelancer',
  {
    statusCode: 200,
    body: {
      message:"Freelancer selected successfully"
    }
  }
 ).as('getFreelancerSelected');
 
 
 cy.get('[data-test="approve-submission-modal-btn"]').click();
 
 
 cy.get('.Toastify__toast').should('be.visible').contains(/Freelancer selected successfully/i);

 
   })

   it('Reject Application Flow', () => {
 
    cy.intercept('GET', '/api/auth/me', {
      statusCode: 200,
      body: {
        id:"1eb87a21-c6cb-423b-aa36-48c453e0ddde",
        firstName: 'John',
        role: 'CLIENT',
        verified: true,
      },
    }).as('getClientUser');
    cy.visit('/dashboard')
    // Wait for user authentication to complete
   cy.wait('@getClientUser');
   cy.intercept(
    'GET',
    '/api/client/projects/all?page=0&size=2&sortBy=id&sortDirection=asc',
    {
      statusCode: 200,
      body: {
        "content": [
            {
                "id": "cf5408bf-c564-4323-91cc-6f9a7cc993ff",
                "title": "Project title20",
                "description": "Project description20",
                "expirationDate": "2025-11-12",
                "visibilityExpirationDate": null,
                "category": "WEB_DEVELOPMENT",
                "priceRange": "LESS_500",
                "experienceLevel": "JUNIOR",
                "expectedDeliveryTime": "IMMEDIATELY",
                "projectStatus": "OPEN",
                "tags": ["JAVA"],
                "clientId": "1eb87a21-c6cb-423b-aa36-48c453e0ddde",
                "selectedFreelancerId": null,
                "applications": [
                  {
                    "id": "0774fd97-6e72-430c-91c0-d1fcef1cdad1",
                    "status": "APPLIED",
                    "projectId": "cf5408bf-c564-4323-91cc-6f9a7cc993ff",
                    "projectTitle": "Project title20",
                    "freelancerId": "41d21fbf-4386-4e92-978c-ef425794c991",
                    "freelancerProfile": {
                        "id": "a9d50868-58a6-4fe0-b3ce-79aad1ed21b6",
                        "userId": "41d21fbf-4386-4e92-978c-ef425794c991",
                        "firstName": "Nermin",
                        "lastName": "Karapandzic",
                        "username": null,
                        "profileImageUrl": null,
                        "bio": "Nermin Karapandzic bio.",
                        "contactEmail": "freelancer@freelancer.com",
                        "city": null,
                        "state": null,
                        "experienceLevel": null,
                        "socialMediaLinks": [],
                        "skills": [],
                        "availability": null
                    },
                    "creationDate": "2025-02-20T22:11:47.435626"
                },
                ],
                "creationDate": "2025-02-20T15:10:14.27422"
            }
        ],
        "metadata": {
            "pageNumber": 0,
            "pageSize": 2,
            "totalElements": 1,
            "totalPages": 1,
            "first": true,
            "last": true,
            "sortBy": "id",
            "sortDirection": "asc"
        }
      }
    }
  ).as('getClientProjects');
   cy.get('[data-test="view-applicants-btn"]').click();
  cy.intercept(
    'GET',
    '/api/client/projects/cf5408bf-c564-4323-91cc-6f9a7cc993ff',
    {
      statusCode: 200,
      body: {
                "id": "cf5408bf-c564-4323-91cc-6f9a7cc993ff",
                "title": "Project title20",
                "description": "Project description20",
                "expirationDate": "2025-11-12",
                "visibilityExpirationDate": null,
                "category": "WEB_DEVELOPMENT",
                "priceRange": "LESS_500",
                "experienceLevel": "JUNIOR",
                "expectedDeliveryTime": "IMMEDIATELY",
                "projectStatus": "OPEN",
                "tags": ["JAVA"],
                "clientId": "1eb87a21-c6cb-423b-aa36-48c453e0ddde",
                "selectedFreelancerId": null,
                "applications": [
                  {
                    "id": "0774fd97-6e72-430c-91c0-d1fcef1cdad1",
                    "status": "APPLIED",
                    "projectId": "cf5408bf-c564-4323-91cc-6f9a7cc993ff",
                    "projectTitle": "Project title20",
                    "freelancerId": "41d21fbf-4386-4e92-978c-ef425794c991",
                    "freelancerProfile": {
                        "id": "a9d50868-58a6-4fe0-b3ce-79aad1ed21b6",
                        "userId": "41d21fbf-4386-4e92-978c-ef425794c991",
                        "firstName": "Nermin",
                        "lastName": "Karapandzic",
                        "username": null,
                        "profileImageUrl": null,
                        "bio": "Nermin Karapandzic bio.",
                        "contactEmail": "freelancer@freelancer.com",
                        "city": null,
                        "state": null,
                        "experienceLevel": null,
                        "socialMediaLinks": [],
                        "skills": [],
                        "availability": null
                    },
                    "creationDate": "2025-02-20T22:11:47.435626"
                },
                ],
                "creationDate": "2025-02-20T15:10:14.27422"
      }
    }
  ).as('getClientProject');
  cy.intercept(
    'GET',
    '/api/client/projects/cf5408bf-c564-4323-91cc-6f9a7cc993ff/applications/all',
    {
      statusCode: 200,
      body: [
        {
            "id": "0774fd97-6e72-430c-91c0-d1fcef1cdad1",
            "status": "APPLIED",
            "projectId": "cf5408bf-c564-4323-91cc-6f9a7cc993ff",
            "projectTitle": "Project title20",
            "freelancerId": "41d21fbf-4386-4e92-978c-ef425794c991",
            "freelancerProfile": {
                "id": "a9d50868-58a6-4fe0-b3ce-79aad1ed21b6",
                "userId": "41d21fbf-4386-4e92-978c-ef425794c991",
                "firstName": "Nermin",
                "lastName": "Karapandzic",
                "username": null,
                "profileImageUrl": null,
                "bio": "Nermin Karapandzic bio.",
                "contactEmail": "freelancer@freelancer.com",
                "city": null,
                "state": null,
                "experienceLevel": null,
                "socialMediaLinks": [],
                "skills": [],
                "availability": null
            },
            "creationDate": "2025-02-20T22:11:47.435626"
        }
      ]
    }
 ).as('getClientProjectApplications');
 
 
 cy.intercept('POST', '/api/client/applications/bulk/reject-freelancer', {
  statusCode: 206,
  body: {
    message: "Some rejection requests could not be processed.",
    status: 206,
    errors: {
      "[Request 1] Rejecting application with ID 0774fd97-6e72-430c-91c0-d1fcef1cdad1: ": "successful"
    },
    generalErrors: null
  }
 }).as('rejectFreelancer');
 cy.get('[data-test="reject-application-btn"]').click({ force: true });
 
 
 cy.get('[data-test="reject-selected-btn"]').click({ force: true });
 
 
 cy.get('[data-test="modal-refuse-submission-title"]').contains(/Refuse Submissions/i);
 cy.get('[data-test="modal-refuse-submission-question"]').contains(/Are you sure you want to refuse/i);
 cy.get('[data-test="modal-refuse-submission-statement1"]').contains(/Mark the submissions as rejected/i);
 cy.get('[data-test="modal-refuse-submission-statement2"]').contains(/Notify the freelancers/i);
 cy.get('[data-test="modal-refuse-submission-statement3"]').contains(/Remove them from consideration/i);
 cy.get('[data-test="modal-refuse-submission-btn"]').contains(/Confirm Rejection/i).click();
 
 
 cy.wait('@rejectFreelancer')
 
 
 cy.get('.Toastify__toast').should('be.visible').contains(/Freelancers rejected successfully/i);
 
 
   })
 
 
 
 
 })
 