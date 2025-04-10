describe('Freelancer Flow', () => {
  it('Submitting an Application For Project', () => {


    cy.intercept('GET', '/api/auth/me', {
      statusCode: 200,
      body: {
        firstName: 'Nermin',
        role: 'FREELANCER',
        verified: true,
      },
    }).as('getFreelancerUser');


    cy.intercept('GET', '/api/freelancer/projects/all?page=0&size=10', {
      statusCode: 200,
      body: {
        content: [
          {
            id: "351adc9f-4431-4d15-bb44-0edad5c068f8",
            title: "Project Title3",
            description: "<p>Project Description3</p>",
            expirationDate: "2025-03-11",
            category: "DIGITAL_MARKETING",
            priceRange: "MORE_10000",
            experienceLevel: "EXPERT",
            expectedDeliveryTime: "FLEXIBLE",
            projectStatus: "OPEN",
            tags: [],
            hasApplied: null
          },
          {
            id: "ad08a9d8-b07f-4dee-aa19-3ae3572ea6c4",
            title: "Project Title2",
            description: "<p>Project Description2</p>",
            expirationDate: "2025-03-11",
            category: "UI_UX_DESIGN",
            priceRange: "BETWEEN_1000_5000",
            experienceLevel: "INTERMEDIATE",
            expectedDeliveryTime: "WITHIN_A_MONTH",
            projectStatus: "OPEN",
            tags: [],
            hasApplied: null
          },
          {
            id: "749be68c-ef84-4a07-ab56-677c711e4c07",
            title: "Project Title1",
            description: "<p>Project Description1</p>",
            expirationDate: "2025-03-11",
            category: "WEB_DEVELOPMENT",
            priceRange: "LESS_500",
            experienceLevel: "JUNIOR",
            expectedDeliveryTime: "IMMEDIATELY",
            projectStatus: "OPEN",
            tags: [],
            hasApplied: null
          }
        ],
        metadata: {
          pageNumber: 0,
          pageSize: 10,
          totalElements: 3,
          totalPages: 1,
          first: true,
          last: true,
          sortBy: "creationDate",
          sortDirection: "desc"
        }
      }
    }).as('getProjects');




    cy.visit('/projects')




    cy.wait('@getFreelancerUser');












    cy.wait('@getProjects');








    cy.get('[data-test="Project Title3"]').click()




    cy.intercept('GET', '/api/freelancer/projects/351adc9f-4431-4d15-bb44-0edad5c068f8', {
      statusCode: 200,
      body: {
        id: "351adc9f-4431-4d15-bb44-0edad5c068f8",
        title: "Project Title3",
        description: "<p>Project Description3</p>",
        expirationDate: "2025-03-11",
        category: "DIGITAL_MARKETING",
        priceRange: "MORE_10000",
        experienceLevel: "EXPERT",
        expectedDeliveryTime: "FLEXIBLE",
        projectStatus: "OPEN",
        tags: [],
        hasApplied: null
      }
    }).as('getProject');




    cy.intercept('POST', '/api/freelancer/submit-application', {
      statusCode: 200,
      body: {


      },
    }).as('submitApplicationSuccess');




    cy.get('[data-test="header-project-title"]').contains(/Project title3/i)
    cy.get('[data-test="header-project-status"]').contains(/Open/i)
    cy.get('[data-test="header-project-category"]').contains(/Digital Marketing/i)
    cy.get('[data-test="header-project-priceRange"]').contains(/10000+/i)



    cy.get('[data-test="application-title"]').contains(/Submit Application/i)
    cy.get('[data-test="application-desc"]').contains(/Tell us why you're perfect for this project/i)
    cy.get('[data-test="application-label"]').contains(/Motivational Letter/i)
    cy.get('[data-test="application-advise"]').contains(/Be sure to include your relevant experience, skills, and why/i)
    cy.get('[data-test="application-word-count"]').contains(/1\/500 words/i);
    cy.get('[data-test="application-input"]').type('I think I will be a great fit for this project. I have XYZ experience in digital marketing');
    cy.get('[data-test="application-ack-checkbox"]').click();


    cy.get('[data-test="application-submit-btn"]').contains(/Submit Application/i).click();




    cy.wait('@submitApplicationSuccess');




    cy.get('.Toastify__toast').should('be.visible').contains(/Application submitted successfully/i);




    cy.intercept('GET', '/api/freelancer/applications/all', {
      statusCode: 200,
      body: {
        content: [
          {
            id: "af9630a1-01dc-44c9-9d28-2ea4ca2d3842",
            status: "APPLIED",
            projectId: "351adc9f-4431-4d15-bb44-0edad5c068f8",
            projectTitle: "Project title3",
            freelancerId: "4da59082-9e15-44ba-b8b6-874d1e20b091",
            freelancerProfile: {
              id: "2203d306-a56e-441b-a59f-f190ac817c0b",
              userId: "4da59082-9e15-44ba-b8b6-874d1e20b091",
              firstName: "Nermin",
              lastName: "Karapandzic",
              username: null,
              profileImageUrl: null,
              bio: "Nermin Karapandzic bio.",
              contactEmail: "freelancer@freelancer.com",
              city: null,
              state: null,
              experienceLevel: null,
              socialMediaLinks: [],
              skills: [],
              availability: null
            },
            creationDate: "2025-03-06T19:06:24.539778",
            message: "I think I will be a great fit for this project. I have XYZ experience in digital marketing"
          }
        ],
        metadata: {
          pageNumber: 0,
          pageSize: 10,
          totalElements: 1,
          totalPages: 1,
          first: true,
          last: true,
          sortBy: "creationDate",
          sortDirection: "desc"
        }
      }
    }).as('getFreelancerApplications');


    cy.get('[data-test="applied-status"]').contains(/Applied/i)
    cy.get('[data-test="application-submitted-title"]').contains(/Your Application/i)
    cy.get('[data-test="application-submitted-message"]').contains(/I think I will be a great fit for this project. I have XYZ experience in digital marketing/i)
    cy.get('[data-test="application-withdraw-btn"]').contains(/Withdraw Application/i)






  })




  it('Widthdrawing an Application For Project', () => {


    cy.intercept('GET', '/api/auth/me', {
      statusCode: 200,
      body: {
        firstName: 'Nermin',
        role: 'FREELANCER',
        verified: true,
      },
    }).as('getFreelancerUser');


    cy.intercept('GET', '/api/freelancer/projects/all?page=0&size=10', {
      statusCode: 200,
      body: {
        content: [
          {
            id: "351adc9f-4431-4d15-bb44-0edad5c068f8",
            title: "Project Title3",
            description: "<p>Project Description3</p>",
            expirationDate: "2025-03-11",
            category: "DIGITAL_MARKETING",
            priceRange: "MORE_10000",
            experienceLevel: "EXPERT",
            expectedDeliveryTime: "FLEXIBLE",
            projectStatus: "OPEN",
            tags: [],
            hasApplied: null
          },
          {
            id: "ad08a9d8-b07f-4dee-aa19-3ae3572ea6c4",
            title: "Project Title2",
            description: "<p>Project Description2</p>",
            expirationDate: "2025-03-11",
            category: "UI_UX_DESIGN",
            priceRange: "BETWEEN_1000_5000",
            experienceLevel: "INTERMEDIATE",
            expectedDeliveryTime: "WITHIN_A_MONTH",
            projectStatus: "OPEN",
            tags: [],
            hasApplied: null
          },
          {
            id: "749be68c-ef84-4a07-ab56-677c711e4c07",
            title: "Project Title1",
            description: "<p>Project Description1</p>",
            expirationDate: "2025-03-11",
            category: "WEB_DEVELOPMENT",
            priceRange: "LESS_500",
            experienceLevel: "JUNIOR",
            expectedDeliveryTime: "IMMEDIATELY",
            projectStatus: "OPEN",
            tags: [],
            hasApplied: null
          }
        ],
        metadata: {
          pageNumber: 0,
          pageSize: 10,
          totalElements: 3,
          totalPages: 1,
          first: true,
          last: true,
          sortBy: "creationDate",
          sortDirection: "desc"
        }
      }
    }).as('getProjects');




    cy.visit('/projects')




    cy.wait('@getFreelancerUser');












    cy.wait('@getProjects');








    cy.get('[data-test="Project Title3"]').click()




    cy.intercept('GET', '/api/freelancer/projects/351adc9f-4431-4d15-bb44-0edad5c068f8', {
      statusCode: 200,
      body: {
        id: "351adc9f-4431-4d15-bb44-0edad5c068f8",
        title: "Project Title3",
        description: "<p>Project Description3</p>",
        expirationDate: "2025-03-11",
        category: "DIGITAL_MARKETING",
        priceRange: "MORE_10000",
        experienceLevel: "EXPERT",
        expectedDeliveryTime: "FLEXIBLE",
        projectStatus: "OPEN",
        tags: [],
        hasApplied: null
      }
    }).as('getProject');












    cy.intercept('GET', '/api/freelancer/applications/all', {
      statusCode: 200,
      body: {
        content: [
          {
            id: "af9630a1-01dc-44c9-9d28-2ea4ca2d3842",
            status: "APPLIED",
            projectId: "351adc9f-4431-4d15-bb44-0edad5c068f8",
            projectTitle: "Project title3",
            freelancerId: "4da59082-9e15-44ba-b8b6-874d1e20b091",
            freelancerProfile: {
              id: "2203d306-a56e-441b-a59f-f190ac817c0b",
              userId: "4da59082-9e15-44ba-b8b6-874d1e20b091",
              firstName: "Nermin",
              lastName: "Karapandzic",
              username: null,
              profileImageUrl: null,
              bio: "Nermin Karapandzic bio.",
              contactEmail: "freelancer@freelancer.com",
              city: null,
              state: null,
              experienceLevel: null,
              socialMediaLinks: [],
              skills: [],
              availability: null
            },
            creationDate: "2025-03-06T19:06:24.539778",
            message: "I think I will be a great fit for this project. I have XYZ experience in digital marketing"
          }
        ],
        metadata: {
          pageNumber: 0,
          pageSize: 10,
          totalElements: 1,
          totalPages: 1,
          first: true,
          last: true,
          sortBy: "creationDate",
          sortDirection: "desc"
        }
      }
    }).as('getFreelancerApplications');




    cy.intercept('DELETE', '/api/freelancer/applications/af9630a1-01dc-44c9-9d28-2ea4ca2d3842', {
      statusCode: 200,
      body: {
        message: "Application deleted successfully.",
      }
    }).as('deleteFreelancerApplication');







  })




  it('Approved by client for project', () => {


    cy.intercept('GET', '/api/auth/me', {
      statusCode: 200,
      body: {
        firstName: 'Jessica',
        role: 'FREELANCER',
        verified: true,
      },
    }).as('getFreelancerUser');




    cy.visit('/dashboard');


    cy.wait('@getFreelancerUser');




    cy.intercept(
      'GET',
      '/api/freelancer/applications/all?page=0&size=5&sortBy=id&sortDirection=asc',
      {
        statusCode: 200,
        body: {
          content: [
            {
              id: "da69e945-f727-4c28-94f7-5f96e6179771",
              status: "ACCEPTED",
              projectId: "764f1bde-1eec-423f-9a28-3fbd700e7fc8",
              projectTitle: "Pizza place",
              freelancerId: "a8180746-f260-487d-b02d-c9faa5ada513",
              freelancerProfile: {
                id: "4b003f2b-d988-44bf-a916-4234d4e6ec4c",
                userId: "a8180746-f260-487d-b02d-c9faa5ada513",
                firstName: "Jessica",
                lastName: "Smith",
                username: "MyUsernameClient1234",
                profileImageUrl: null,
                bio: "Jessica Smith bio.",
                contactEmail: "freelancer@freelancer.com",
                city: null,
                state: null,
                experienceLevel: null,
                availability: null,
                socialMediaLinks: [],
                skills: [],
                languagesSpoken: [],
                projectExperiences: [],
                workExperiences: [],
                certifications: [],
                reviews: null,
                deleted: false
              },
              creationDate: "2025-04-09T23:28:57.593649",
              message: "I think I will be a good fit."
            }
          ],
          metadata: {
            pageNumber: 0,
            pageSize: 2,
            totalElements: 1,
            totalPages: 1,
            first: true,
            last: true,
            sortBy: "id",
            sortDirection: "asc"
          }
        }
      }
    ).as('getFreelancerApplications');






    cy.get('[data-test="Pizza place"]').contains(/Pizza/i)
    cy.get('[data-test="application-status"]').contains(/Accepted/i)




  })




  it('Rejected by client for project', () => {
    cy.intercept('GET', '/api/auth/me', {
      statusCode: 200,
      body: {
        firstName: 'Jessica',
        role: 'FREELANCER',
        verified: true,
      },
    }).as('getFreelancerUser');




    cy.visit('/dashboard');


    cy.wait('@getFreelancerUser');




    cy.intercept(
      'GET',
      '/api/freelancer/applications/all?page=0&size=5&sortBy=id&sortDirection=asc',
      {
        statusCode: 200,
        body: {
          content: [
            {
              id: "da69e945-f727-4c28-94f7-5f96e6179771",
              status: "REJECTED",
              projectId: "764f1bde-1eec-423f-9a28-3fbd700e7fc8",
              projectTitle: "Pizza place",
              freelancerId: "a8180746-f260-487d-b02d-c9faa5ada513",
              freelancerProfile: {
                id: "4b003f2b-d988-44bf-a916-4234d4e6ec4c",
                userId: "a8180746-f260-487d-b02d-c9faa5ada513",
                firstName: "Jessica",
                lastName: "Smith",
                username: "MyUsernameClient1234",
                profileImageUrl: null,
                bio: "Jessica Smith bio.",
                contactEmail: "freelancer@freelancer.com",
                city: null,
                state: null,
                experienceLevel: null,
                availability: null,
                socialMediaLinks: [],
                skills: [],
                languagesSpoken: [],
                projectExperiences: [],
                workExperiences: [],
                certifications: [],
                reviews: null,
                deleted: false
              },
              creationDate: "2025-04-09T23:28:57.593649",
              message: "I think I will be a good fit."
            }
          ],
          metadata: {
            pageNumber: 0,
            pageSize: 2,
            totalElements: 1,
            totalPages: 1,
            first: true,
            last: true,
            sortBy: "id",
            sortDirection: "asc"
          }
        }
      }
    ).as('getFreelancerApplications');






    cy.get('[data-test="Pizza place"]').contains(/Pizza/i)
    cy.get('[data-test="application-status"]').contains(/Rejected/i)
  });






  it('Error Flow for Edit Header Profile Component', () => {
    cy.intercept('GET', '/api/auth/me', {
      statusCode: 200,
      body: {
        firstName: 'Jessica',
        role: 'FREELANCER',
        username: 'MyUsernameClient123',
        verified: true,
      },
    }).as('getFreelancerUser');


    cy.intercept('GET', '/api/public/freelancer/profile/MyUsernameClient123', {
      statusCode: 200,
      body: {
        "id": "53ac2424-388d-4219-8b5b-37015196d130",
        "userId": "4d5d84a4-a815-4ab6-aa6a-4a0b6f625dac",
        "firstName": "",
        "lastName": "",
        "username": "MyUsernameClient123",
        "profileImageUrl": null,
        "bio": "Jessica Smith bio.",
        "contactEmail": "freelancer@freelancer.com",
        "city": null,
        "state": null,
        "experienceLevel": null,
        "socialMediaLinks": [],
        "skills": [],
        "availability": null,
        "workExperiences": [],
        "certifications": [],
        "languagesSpoken": [],
        "projectExperiences": [],
        "deleted": false,
        "reviews": []
      }
    }).as('getFreelancerProfile');






    cy.visit('/profile');


    cy.wait('@getFreelancerProfile');


    cy.get('[data-test="profile-header-edit-btn"]').click();
    cy.get('[data-test="profile-header-save-btn"]').click();


    cy.get('[data-test="profile-header-firstName-error"]').contains(/First name is required/i);
    cy.get('[data-test="profile-header-lastName-error"]').contains(/Last name is required/i);
    cy.get('[data-test="profile-header-city-error"]').contains(/City is required/i);
    cy.get('[data-test="profile-header-state-error"]').contains(/State\/Province is required/i);




  });


  it('Success Flow for Edit Header Profile Component', () => {
    cy.intercept('GET', '/api/auth/me', {
      statusCode: 200,
      body: {
        firstName: 'Jessica',
        role: 'FREELANCER',
        username: 'MyUsernameClient123',
        verified: true,
      },
    }).as('getFreelancerUser');


    cy.intercept('GET', '/api/public/freelancer/profile/MyUsernameClient123', {
      statusCode: 200,
      body: {
        "id": "53ac2424-388d-4219-8b5b-37015196d130",
        "userId": "4d5d84a4-a815-4ab6-aa6a-4a0b6f625dac",
        "firstName": "",
        "lastName": "",
        "username": "MyUsernameClient123",
        "profileImageUrl": null,
        "bio": "Jessica Smith bio.",
        "contactEmail": "freelancer@freelancer.com",
        "city": null,
        "state": null,
        "experienceLevel": null,
        "socialMediaLinks": [],
        "skills": [],
        "availability": null,
        "workExperiences": [],
        "certifications": [],
        "languagesSpoken": [],
        "projectExperiences": [],
        "deleted": false,
        "reviews": []
      }
    }).as('getFreelancerProfile');






    cy.visit('/profile');


    cy.wait('@getFreelancerProfile');


    cy.get('[data-test="profile-header-edit-btn"]').click();


    cy.intercept('PUT', '/api/freelancer/profile', {
      statusCode: 200,
      body: {
        message: 'Profile updated successfully'
      }
    }).as('updateFreelancerProfile');




    cy.get('[data-test="profile-header-input-firstName"]').type("Jessica");
    cy.get('[data-test="profile-header-input-lastName"]').type("Smith");
    cy.get('[data-test="profile-header-input-city"]').type("Montreal");
    cy.get('[data-test="profile-header-input-state"]').type("Quebec");


    cy.get('[data-test="profile-header-save-btn"]').click();




    cy.wait('@updateFreelancerProfile');


    cy.get('.Toastify__toast').should('contain', 'Profile updated successfully');






  });


  it('Success Flow for Edit About Component', () => {
    cy.intercept('GET', '/api/auth/me', {
      statusCode: 200,
      body: {
        firstName: 'Jessica',
        role: 'FREELANCER',
        username: 'MyUsernameClient123',
        verified: true,
      },
    }).as('getFreelancerUser');


    cy.intercept('GET', '/api/public/freelancer/profile/MyUsernameClient123', {
      statusCode: 200,
      body: {
        "id": "53ac2424-388d-4219-8b5b-37015196d130",
        "userId": "4d5d84a4-a815-4ab6-aa6a-4a0b6f625dac",
        "firstName": "",
        "lastName": "",
        "username": "MyUsernameClient123",
        "profileImageUrl": null,
        "bio": "",
        "contactEmail": "freelancer@freelancer.com",
        "city": null,
        "state": null,
        "experienceLevel": null,
        "socialMediaLinks": [],
        "skills": [],
        "availability": null,
        "workExperiences": [],
        "certifications": [],
        "languagesSpoken": [],
        "projectExperiences": [],
        "deleted": false,
        "reviews": []
      }
    }).as('getFreelancerProfile');






    cy.visit('/profile');


    cy.wait('@getFreelancerProfile');


    cy.get('[data-test="profile-about-edit-btn"]').click();




    cy.intercept('PUT', '/api/freelancer/profile', {
      statusCode: 200,
      body: {
        message: 'Profile updated successfully'
      }
    }).as('updateFreelancerProfile');


    cy.get('[data-test="about-profile-input"]').type("Jessica Smith bio.");


    cy.get('[data-test="profile-about-save-btn"]').click();


    cy.wait('@updateFreelancerProfile');


    cy.get('.Toastify__toast').should('contain', 'Profile updated successfully');






  });




  it('Success Flow for Edit Experience Component', () => {
    cy.intercept('GET', '/api/auth/me', {
      statusCode: 200,
      body: {
        firstName: 'Jessica',
        role: 'FREELANCER',
        username: 'MyUsernameClient123',
        verified: true,
      },
    }).as('getFreelancerUser');


    cy.intercept('GET', '/api/public/freelancer/profile/MyUsernameClient123', {
      statusCode: 200,
      body: {
        "id": "53ac2424-388d-4219-8b5b-37015196d130",
        "userId": "4d5d84a4-a815-4ab6-aa6a-4a0b6f625dac",
        "firstName": "",
        "lastName": "",
        "username": "MyUsernameClient123",
        "profileImageUrl": null,
        "bio": "",
        "contactEmail": "freelancer@freelancer.com",
        "city": null,
        "state": null,
        "experienceLevel": null,
        "socialMediaLinks": [],
        "skills": [],
        "availability": null,
        "workExperiences": [],
        "certifications": [],
        "languagesSpoken": [],
        "projectExperiences": [],
        "deleted": false,
        "reviews": []
      }
    }).as('getFreelancerProfile');






    cy.visit('/profile');


    cy.wait('@getFreelancerProfile');


    cy.get('[data-test="profile-experience-edit-btn"]').click();




    cy.intercept('PUT', '/api/freelancer/profile', {
      statusCode: 200,
      body: {
        message: 'Profile updated successfully'
      }
    }).as('updateFreelancerProfile');






    cy.get('[data-test="profile-experience-save-btn"]').click();


    cy.wait('@updateFreelancerProfile');


    cy.get('.Toastify__toast').should('contain', 'Profile updated successfully');






  });


  it('Success Flow for Edit Availability Component', () => {
    cy.intercept('GET', '/api/auth/me', {
      statusCode: 200,
      body: {
        firstName: 'Jessica',
        role: 'FREELANCER',
        username: 'MyUsernameClient123',
        verified: true,
      },
    }).as('getFreelancerUser');


    cy.intercept('GET', '/api/public/freelancer/profile/MyUsernameClient123', {
      statusCode: 200,
      body: {
        "id": "53ac2424-388d-4219-8b5b-37015196d130",
        "userId": "4d5d84a4-a815-4ab6-aa6a-4a0b6f625dac",
        "firstName": "",
        "lastName": "",
        "username": "MyUsernameClient123",
        "profileImageUrl": null,
        "bio": "",
        "contactEmail": "freelancer@freelancer.com",
        "city": null,
        "state": null,
        "experienceLevel": null,
        "socialMediaLinks": [],
        "skills": [],
        "availability": null,
        "workExperiences": [],
        "certifications": [],
        "languagesSpoken": [],
        "projectExperiences": [],
        "deleted": false,
        "reviews": []
      }
    }).as('getFreelancerProfile');






    cy.visit('/profile');


    cy.wait('@getFreelancerProfile');


    cy.get('[data-test="profile-availability-edit-btn"]').click();




    cy.intercept('PUT', '/api/freelancer/profile', {
      statusCode: 200,
      body: {
        message: 'Profile updated successfully'
      }
    }).as('updateFreelancerProfile');






    cy.get('[data-test="profile-availability-save-btn"]').click();


    cy.wait('@updateFreelancerProfile');


    cy.get('.Toastify__toast').should('contain', 'Profile updated successfully');






  });




  it('Success Flow for Edit Skills Component', () => {
    cy.intercept('GET', '/api/auth/me', {
      statusCode: 200,
      body: {
        firstName: 'Jessica',
        role: 'FREELANCER',
        username: 'MyUsernameClient123',
        verified: true,
      },
    }).as('getFreelancerUser');


    cy.intercept('GET', '/api/public/freelancer/profile/MyUsernameClient123', {
      statusCode: 200,
      body: {
        "id": "53ac2424-388d-4219-8b5b-37015196d130",
        "userId": "4d5d84a4-a815-4ab6-aa6a-4a0b6f625dac",
        "firstName": "",
        "lastName": "",
        "username": "MyUsernameClient123",
        "profileImageUrl": null,
        "bio": "",
        "contactEmail": "freelancer@freelancer.com",
        "city": null,
        "state": null,
        "experienceLevel": null,
        "socialMediaLinks": [],
        "skills": ["HTML",
          "JAVA",],
        "availability": null,
        "workExperiences": [],
        "certifications": [],
        "languagesSpoken": [],
        "projectExperiences": [],
        "deleted": false,
        "reviews": []
      }
    }).as('getFreelancerProfile');






    cy.visit('/profile');


    cy.wait('@getFreelancerProfile');


    cy.get('[data-test="profile-skills-edit-btn"]').click();




    cy.intercept('PUT', '/api/freelancer/profile', {
      statusCode: 200,
      body: {
        message: 'Profile updated successfully'
      }
    }).as('updateFreelancerProfile');






    cy.get('[data-test="profile-skills-save-btn"]').click();


    cy.wait('@updateFreelancerProfile');


    cy.get('.Toastify__toast').should('contain', 'Profile updated successfully');






  });


  it('Success Flow for Edit Languages Component', () => {
    cy.intercept('GET', '/api/auth/me', {
      statusCode: 200,
      body: {
        firstName: 'Jessica',
        role: 'FREELANCER',
        username: 'MyUsernameClient123',
        verified: true,
      },
    }).as('getFreelancerUser');


    cy.intercept('GET', '/api/public/freelancer/profile/MyUsernameClient123', {
      statusCode: 200,
      body: {
        "id": "53ac2424-388d-4219-8b5b-37015196d130",
        "userId": "4d5d84a4-a815-4ab6-aa6a-4a0b6f625dac",
        "firstName": "",
        "lastName": "",
        "username": "MyUsernameClient123",
        "profileImageUrl": null,
        "bio": "",
        "contactEmail": "freelancer@freelancer.com",
        "city": null,
        "state": null,
        "experienceLevel": null,
        "socialMediaLinks": [],
        "skills": [],
        "availability": null,
        "workExperiences": [],
        "certifications": [],
        "languagesSpoken": ["Spanish",
          "English"],
        "projectExperiences": [],
        "deleted": false,
        "reviews": []
      }
    }).as('getFreelancerProfile');






    cy.visit('/profile');


    cy.wait('@getFreelancerProfile');


    cy.get('[data-test="profile-languages-edit-btn"]').click();




    cy.intercept('PUT', '/api/freelancer/profile', {
      statusCode: 200,
      body: {
        message: 'Profile updated successfully'
      }
    }).as('updateFreelancerProfile');






    cy.get('[data-test="profile-languages-save-btn"]').click();


    cy.wait('@updateFreelancerProfile');


    cy.get('.Toastify__toast').should('contain', 'Profile updated successfully');






  });


  it('Success Flow for Edit Contact Component', () => {
    cy.intercept('GET', '/api/auth/me', {
      statusCode: 200,
      body: {
        firstName: 'Jessica',
        role: 'FREELANCER',
        username: 'MyUsernameClient123',
        verified: true,
      },
    }).as('getFreelancerUser');


    cy.intercept('GET', '/api/public/freelancer/profile/MyUsernameClient123', {
      statusCode: 200,
      body: {
        "id": "53ac2424-388d-4219-8b5b-37015196d130",
        "userId": "4d5d84a4-a815-4ab6-aa6a-4a0b6f625dac",
        "firstName": "",
        "lastName": "",
        "username": "MyUsernameClient123",
        "profileImageUrl": null,
        "bio": "",
        "contactEmail": "",
        "city": null,
        "state": null,
        "experienceLevel": null,
        "socialMediaLinks": [],
        "skills": [],
        "availability": null,
        "workExperiences": [],
        "certifications": [],
        "languagesSpoken": ["Spanish",
          "English"],
        "projectExperiences": [],
        "deleted": false,
        "reviews": []
      }
    }).as('getFreelancerProfile');






    cy.visit('/profile');


    cy.wait('@getFreelancerProfile');


    cy.get('[data-test="profile-contact-edit-btn"]').click();




    cy.intercept('PUT', '/api/freelancer/profile', {
      statusCode: 200,
      body: {
        message: 'Profile updated successfully'
      }
    }).as('updateFreelancerProfile');




    cy.get('[data-test="contact-email-input"]').type("Jessica@email.com");
    cy.get('[data-test="facebook-input"]').type("Jessica2005");
    cy.get('[data-test="twitter-input"]').type("Jessica2005");
    cy.get('[data-test="linkedin-input"]').type("Jessica2005");
    cy.get('[data-test="github-input"]').type("Jessica2005");




    cy.get('[data-test="profile-contact-save-btn"]').click();


    cy.wait('@updateFreelancerProfile');


    cy.get('.Toastify__toast').should('contain', 'Profile updated successfully');






  });


  it('Success Flow for Edit WorkExperience Component', () => {
    cy.intercept('GET', '/api/auth/me', {
      statusCode: 200,
      body: {
        firstName: 'Jessica',
        role: 'FREELANCER',
        username: 'MyUsernameClient123',
        verified: true,
      },
    }).as('getFreelancerUser');


    cy.intercept('GET', '/api/public/freelancer/profile/MyUsernameClient123', {
      statusCode: 200,
      body: {
        "id": "53ac2424-388d-4219-8b5b-37015196d130",
        "userId": "4d5d84a4-a815-4ab6-aa6a-4a0b6f625dac",
        "firstName": "",
        "lastName": "",
        "username": "MyUsernameClient123",
        "profileImageUrl": null,
        "bio": "",
        "contactEmail": "",
        "city": null,
        "state": null,
        "experienceLevel": null,
        "socialMediaLinks": [],
        "skills": [],
        "availability": null,
        "workExperiences": [{
          "id": "040807aa-7581-4605-ae01-06886e214f48",
          "companyName": "Tech Solutions Inc.",
          "role": "Software Engineer",
          "startDate": "2018-01-01",
          "endDate": "2020-12-31",
          "description": "Developed and maintained web applications.",
          "location": "New York"
        },],
        "certifications": [],
        "languagesSpoken": ["Spanish",
          "English"],
        "projectExperiences": [],
        "deleted": false,
        "reviews": []
      }
    }).as('getFreelancerProfile');






    cy.visit('/profile');


    cy.wait('@getFreelancerProfile');


    cy.get('[data-test="profile-work-edit-btn"]').click();




    cy.intercept('PUT', '/api/freelancer/profile', {
      statusCode: 200,
      body: {
        message: 'Profile updated successfully'
      }
    }).as('updateFreelancerProfile');






    cy.get('[data-test="profile-work-save-btn"]').click();


    cy.wait('@updateFreelancerProfile');


    cy.get('.Toastify__toast').should('contain', 'Profile updated successfully');






  });




  it('Success Flow for Edit ProjectExperience Component', () => {
    cy.intercept('GET', '/api/auth/me', {
      statusCode: 200,
      body: {
        firstName: 'Jessica',
        role: 'FREELANCER',
        username: 'MyUsernameClient123',
        verified: true,
      },
    }).as('getFreelancerUser');


    cy.intercept('GET', '/api/public/freelancer/profile/MyUsernameClient123', {
      statusCode: 200,
      body: {
        "id": "53ac2424-388d-4219-8b5b-37015196d130",
        "userId": "4d5d84a4-a815-4ab6-aa6a-4a0b6f625dac",
        "firstName": "",
        "lastName": "",
        "username": "MyUsernameClient123",
        "profileImageUrl": null,
        "bio": "",
        "contactEmail": "",
        "city": null,
        "state": null,
        "experienceLevel": null,
        "socialMediaLinks": [],
        "skills": [],
        "availability": null,
        "workExperiences": [],
        "certifications": [],
        "languagesSpoken": ["Spanish",
          "English"],
        "projectExperiences": [{
          "id": "5c5fa68b-6002-4ce4-bd70-1502dafeeece",
          "projectName": "E-commerce Website",
          "description": "Developed a full-featured e-commerce website.",
          "startDate": "2019-05-01",
          "endDate": "2020-05-01",
          "projectLink": "https://example.com/ecommerce"
        },],
        "deleted": false,
        "reviews": []
      }
    }).as('getFreelancerProfile');






    cy.visit('/profile');


    cy.wait('@getFreelancerProfile');


    cy.get('[data-test="profile-project-edit-btn"]').click();




    cy.intercept('PUT', '/api/freelancer/profile', {
      statusCode: 200,
      body: {
        message: 'Profile updated successfully'
      }
    }).as('updateFreelancerProfile');




    cy.get('[data-test="profile-project-save-btn"]').click();


    cy.wait('@updateFreelancerProfile');


    cy.get('.Toastify__toast').should('contain', 'Profile updated successfully');





  });




})
