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
   /*
   cy.get('[data-test="header-project-expirationDate"]').contains(/Closing on March 10, 2025/i)


   cy.get('[data-test="application-title"]').contains(/Submit Application/i)
   cy.get('[data-test="application-desc"]').contains(/Tell us why you're perfect for this project/i)
   cy.get('[data-test="application-label"]').contains(/Motivational Letter/i)
   cy.get('[data-test="application-advise"]').contains(/Be sure to include your relevant experience, skills, and why/i)
   cy.get('[data-test="application-word-count"]').contains(/1\/500 words/i);
   cy.get('[data-test="application-input"]').type('I think I will be a great fit for this project. I have XYZ experience in digital marketing');
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
   cy.get('[data-test="application-submitted-id"]').contains(/af9630a1-01dc-44c9-9d28-2ea4ca2d3842/i)
   cy.get('[data-test="application-withdraw-btn"]').contains(/Withdraw Application/i)
*/

 
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




   /*
   cy.get('[data-test="application-withdraw-btn"]').contains(/Withdraw Application/i).click();


   cy.get('[data-test="modal-widthdraw-question"]').contains(/Are you sure you want to withdraw your application?/i)
   cy.get('[data-test="modal-widthdraw-statement1"]').contains(/Cannot be undone/i)
   cy.get('[data-test="modal-widthdraw-statement2"]').contains(/Will remove your application from consideration/i)
   cy.get('[data-test="modal-widthdraw-statement3"]').contains(/Will allow you to apply again if you change your mind/i)
   cy.get('[data-test="cancel-btn"]').contains(/Cancel/i)
   cy.get('[data-test="confirm-btn"]').contains(/Withdraw Application/i).click();




   cy.wait('@deleteFreelancerApplication');


   cy.get('.Toastify__toast').should('be.visible').contains(/Application cancelled successfully/i);
 
 })


 it('Approved by client for project', () => {
  
   cy.intercept('GET', '/api/auth/me', {
     statusCode: 200,
     body: {
       firstName: 'Nermin',
       role: 'FREELANCER',
       verified: true,
     },
   }).as('getFreelancerUser');


   cy.visit('/dashboard');
  
   cy.wait('@getFreelancerUser');


   cy.intercept(
     'GET',
     '/api/freelancer/applications/all?page=0&size=2&sortBy=id&sortDirection=asc',
     {
       statusCode: 200,
       body: {
         content: [
           {
             id: "f672cd6b-af4c-4245-9551-94940d95b71b",
             status: "ACCEPTED",
             projectId: "4b499a54-df51-45d3-8801-e02116de3d5e",
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
             creationDate: "2025-03-06T20:16:46.484514",
             message: "I think I will be a great fit for this project. I have XYZ experience in digital marketing"
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
  


   cy.get('[data-test="Project title3"]').contains(/Project title3/i)
   cy.get('[data-test="f672cd6b-af4c-4245-9551-94940d95b71b"]').contains(/f672cd6b-af4c-4245-9551-94940d95b71b/i)
   cy.get('[data-test="4b499a54-df51-45d3-8801-e02116de3d5e"]').contains(/4b499a54-df51-45d3-8801-e02116de3d5e/i)
   cy.get('[data-test="application-status"]').contains(/Accepted/i)
  */
 })


 it('Rejected by client for project', () => {
  
   cy.intercept('GET', '/api/auth/me', {
     statusCode: 200,
     body: {
       firstName: 'Nermin',
       role: 'FREELANCER',
       verified: true,
     },
   }).as('getFreelancerUser');


   cy.visit('/dashboard');
  
   cy.wait('@getFreelancerUser');


   cy.intercept(
     'GET',
     '/api/freelancer/applications/all?page=0&size=2&sortBy=id&sortDirection=asc',
     {
       statusCode: 200,
       body: {
         content: [
           {
             id: "f672cd6b-af4c-4245-9551-94940d95b71b",
             status: "REJECTED",
             projectId: "4b499a54-df51-45d3-8801-e02116de3d5e",
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
             creationDate: "2025-03-06T20:16:46.484514",
             message: "I think I will be a great fit for this project. I have XYZ experience in digital marketing"
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
  


   cy.get('[data-test="Project title3"]').contains(/Project title3/i)
   cy.get('[data-test="f672cd6b-af4c-4245-9551-94940d95b71b"]').contains(/f672cd6b-af4c-4245-9551-94940d95b71b/i)
   cy.get('[data-test="4b499a54-df51-45d3-8801-e02116de3d5e"]').contains(/4b499a54-df51-45d3-8801-e02116de3d5e/i)
   cy.get('[data-test="application-status"]').contains(/Rejected/i)
 
 })
})
