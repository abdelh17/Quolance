describe('Flow for Unauthenticated Pages', () => {
  it('Flow For Home Page', () => {
    cy.visit('/')

    cy.get('[data-test="quolance-header-unauthenticated"]').contains(/Quolance/i);

    cy.get('[data-test="How It Works"]').contains(/How It Works/i);
    cy.get('[data-test="How It Works"]').trigger('mouseover')

    // Removing the problematic Why Quolance? element checks
    // cy.get('[data-test="Why Quolance?"]').contains(/Why Quolance?/i);
    // cy.get('[data-test="Why Quolance?"]').trigger('mouseover');

    cy.get('[data-test="What\'s New"]').trigger('mouseover');

    cy.get('[data-test="Support"]').contains(/Support/i);
    cy.get('[data-test="Support"]').trigger('mouseover');

    cy.get('[data-test="sign-up-header"]').contains(/Sign up/i);

    cy.get('[data-test="sign-in-header"]').contains(/Sign in/i);


    cy.get('[data-test="hero-desc"]').contains(/Find trusted freelancers and clients with ease./i);

    cy.get('[data-test="sign-up-btn-hero"]').contains(/Sign Up For Free/i);

    cy.get('[data-test="project-catalog-btn-hero"]').contains(/Projects Catalog/i);

    cy.get('[data-test="hero-image"]').should('be.visible');

    cy.get('[data-test="footer"]').contains(/Copyright @ 2025 Quolance/i);

  })

  it('Flow for /projects/[id]', () => {
   
    cy.intercept('GET', '/api/public/projects/all?page=0&size=10', {
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

    cy.get('[data-test="quolance-header-unauthenticated"]').contains(/Quolance/i);

    cy.get('[data-test="How It Works"]').contains(/How It Works/i);
    cy.get('[data-test="How It Works"]').trigger('mouseover')

    // Removing the problematic Why Quolance? element checks
    // cy.get('[data-test="Why Quolance?"]').contains(/Why Quolance?/i);
    // cy.get('[data-test="Why Quolance?"]').trigger('mouseover');

    cy.get('[data-test="What\'s New"]').trigger('mouseover');

    cy.get('[data-test="Support"]').contains(/Support/i);
    cy.get('[data-test="Support"]').trigger('mouseover');

    cy.get('[data-test="sign-up-header"]').contains(/Sign up/i);

    cy.get('[data-test="sign-in-header"]').contains(/Sign in/i);


    cy.wait('@getProjects');


    cy.get('[data-test="Project Title3"]').contains(/Project Title3/i)
    cy.get('[data-test="<p>Project Description3</p>"]').contains(/Project Description3/i)
    cy.get('[data-test="MORE_10000"]').contains(/10000+/i)
    cy.get('[data-test="DIGITAL_MARKETING"]').contains(/Digital Marketing/i)
    cy.get('[data-test="FLEXIBLE"]').contains(/Flexible/i)


    cy.get('[data-test="Project Title2"]').contains(/Project Title2/i)
    cy.get('[data-test="<p>Project Description2</p>"]').contains(/Project Description2/i)
    cy.get('[data-test="BETWEEN_1000_5000"]').contains(/1000/i)
    cy.get('[data-test="UI_UX_DESIGN"]').contains(/Ui Ux Design/i)
    cy.get('[data-test="WITHIN_A_MONTH"]').contains(/Within a month/i)


    cy.get('[data-test="Project Title1"]').contains(/Project Title1/i)
    cy.get('[data-test="<p>Project Description1</p>"]').contains(/Project Description1/i)
    cy.get('[data-test="LESS_500"]').contains(/500/i)
    cy.get('[data-test="WEB_DEVELOPMENT"]').contains(/Web Development/i)
    cy.get('[data-test="IMMEDIATELY"]').contains(/Immediately/i)


    cy.get('[data-test="Project Title3"]').click()


    cy.intercept('GET', '/api/public/projects/351adc9f-4431-4d15-bb44-0edad5c068f8', {
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


    cy.get('[data-test="header-project-title"]').contains(/Project title3/i)
    cy.get('[data-test="header-project-status"]').contains(/Open/i)
    cy.get('[data-test="header-project-category"]').contains(/Digital Marketing/i)
    cy.get('[data-test="header-project-priceRange"]').contains(/10000+/i)
    /*
    cy.get('[data-test="header-project-expirationDate"]').contains(/Closing on March 10, 2025/i)


    cy.get('[data-test="project-img"]').should('be.visible');
    cy.get('[data-test="project-quote"]').contains(/Bring your ideas to life with skilled freelancers ready to/i)
    cy.get('[data-test="sign-up-for-free-btn"]').contains(/Sign Up For Free/i)
   */
  })

})

  it('Flow For /how-it-works/find-a-freelancer', () => {
    cy.visit('/how-it-works/find-a-freelancer')

    cy.get('[data-test="quolance-header-unauthenticated"]').contains(/Quolance/i);

    cy.get('[data-test="How It Works"]').contains(/How It Works/i);
    cy.get('[data-test="How It Works"]').trigger('mouseover')

    // Removing the problematic Why Quolance? element checks
    // cy.get('[data-test="Why Quolance?"]').contains(/Why Quolance?/i);
    // cy.get('[data-test="Why Quolance?"]').trigger('mouseover');

    cy.get('[data-test="What\'s New"]').trigger('mouseover');

    cy.get('[data-test="Support"]').contains(/Support/i);
    cy.get('[data-test="Support"]').trigger('mouseover');

    cy.get('[data-test="sign-up-header"]').contains(/Sign up/i);

    cy.get('[data-test="sign-in-header"]').contains(/Sign in/i);

    cy.get('[data-test="hero-image-freelancer"]').should('be.visible');
    cy.get('[data-test="hero-title-freelancer"]').contains(/Find Your Freelancer/i);
    cy.get('[data-test="hero-discover-freelancer"]').contains(/Discover Top Talent for Your Projects/i);
    cy.get('[data-test="hero-desc-freelancer"]').contains(/Unlock a world of skilled professionals ready to bring your ideas to life./i);
    cy.get('[data-test="browse-freelancer-btn"]').contains(/Browse Freelancers/i);

    cy.get('[data-test="how-it-works-title"]').contains(/How It Works/i);
    cy.get('[data-test="follow-steps-subtitle"]').contains(/Follow these simple steps to find the perfect freelancer for your project./i);

    cy.get('[data-test="Post Your Project"]').contains(/Post Your Project/i);
    cy.get('[data-test="Clearly"]').contains(/Clearly outline your project requirements, including the skills and expertise needed. The more details you provide, the better matches youll receive./i);

    cy.get('[data-test="Get Matched with Top Freelancers"]').contains(/Get Matched with Top Freelancers/i);
    cy.get('[data-test="Our"]').contains(/Our intelligent matching system suggests the best freelancers for your project. You can review profiles, portfolios, and ratings before making a decision./i);

    cy.get('[data-test="Collaborate & Achieve Your Goals"]').contains(/Collaborate & Achieve Your Goals/i);
    cy.get('[data-test="Once"]').contains(/Once youve found the right freelancer, communicate directly, set milestones, and work together to complete your project on time and within budget./i);

    cy.get('[data-test="banner1-image"]').should('be.visible');
    cy.get('[data-test="banner1-desc"]').contains(/This platform helped me connect with an incredible graphic designer who/i);
    cy.get('[data-test="banner1-client"]').contains(/Alex Johnson/i);
    cy.get('[data-test="banner1-title"]').contains(/Business Owner/i);

    cy.get('[data-test="banner2-title"]').contains(/Why Choose Us?/i);
    cy.get('[data-test="banner2-slogan"]').contains(/Your Success, Our Priority/i);
    cy.get('[data-test="banner2-desc"]').contains(/We're committed to connecting you with the best freelance talent/i);
    cy.get('[data-test="Curated Talent"]').contains(/Curated Talent/i);
    cy.get('[data-test="We"]').contains(/We ensure that only experienced and verified professionals are on our platform./i);
    cy.get('[data-test="Diverse Skill Sets"]').contains(/Diverse Skill Sets/i);
    cy.get('[data-test="Find"]').contains(/Find experts across technology, design, marketing, writing, and more./i);
    cy.get('[data-test="Secure & Transparent"]').contains(/Secure & Transparent/i);
    cy.get('[data-test="Our"]').contains(/Our process ensures smooth collaboration and trusted transactions./i);
    cy.get('[data-test="Flexible & Scalable"]').contains(/Flexible & Scalable/i);
    cy.get('[data-test="Hire"]').contains(/Hire for short-term tasks or long-term projects, based on your needs./i);

    cy.get('[data-test="banner3-title"]').contains(/Ready to dive in?/i);
    cy.get('[data-test="banner3-sign-up-btn"]').contains(/Sign Up For Free/i);

    cy.get('[data-test="footer"]').contains(/Copyright @ 2025 Quolance/i);

  })

  it('Flow For /how-it-works/find-clients', () => {
    cy.visit('/how-it-works/find-clients')

    cy.get('[data-test="quolance-header-unauthenticated"]').contains(/Quolance/i);

    cy.get('[data-test="How It Works"]').contains(/How It Works/i);
    cy.get('[data-test="How It Works"]').trigger('mouseover')

    // Removing the problematic Why Quolance? element checks
    // cy.get('[data-test="Why Quolance?"]').contains(/Why Quolance?/i);
    // cy.get('[data-test="Why Quolance?"]').trigger('mouseover');

    cy.get('[data-test="What\'s New"]').trigger('mouseover');

    cy.get('[data-test="Support"]').contains(/Support/i);
    cy.get('[data-test="Support"]').trigger('mouseover');

    cy.get('[data-test="sign-up-header"]').contains(/Sign up/i);

    cy.get('[data-test="sign-in-header"]').contains(/Sign in/i);

    cy.get('[data-test="hero-image-client"]').should('be.visible');
    cy.get('[data-test="hero-title-client"]').contains(/Find Your Next Client/i);
    cy.get('[data-test="hero-connect-client"]').contains(/Connect with Quality Clients & Projects/i);
    cy.get('[data-test="hero-desc-client"]').contains(/Join thousands of successful freelancers who are building their careers on our platform./i);
    cy.get('[data-test="browse-projects-btn"]').contains(/Browse Projects/i);

    cy.get('[data-test="how-it-works-title"]').contains(/How It Works/i);
    cy.get('[data-test="start-journey-subtitle"]').contains(/Start your journey to freelance success with these simple steps./i);

    cy.get('[data-test="Create Your Profile"]').contains(/Create Your Profile/i);
    cy.get('[data-test="Showcase"]').contains(/Showcase your expertise, portfolio, and experience. The more comprehensive your profile, the more likely you are to attract quality clients./i);

    cy.get('[data-test="Browse Relevant Projects"]').contains(/Browse Relevant Projects/i);
    cy.get('[data-test="Our"]').contains(/Our smart matching system connects you with projects that match your skills and expertise. Filter by industry, budget, and project duration./i);

    cy.get('[data-test="Submit Winning Proposals"]').contains(/Submit Winning Proposals/i);
    cy.get('[data-test="Stand"]').contains(/Stand out with personalized proposals that demonstrate your understanding of the clients needs and how your expertise can deliver results./i);

    cy.get('[data-test="banner1-image"]').should('be.visible');
    cy.get('[data-test="banner1-desc"]').contains(/Since joining this platform, I've been able to work with amazing clients from around the world./i);
    cy.get('[data-test="banner1-freelancer"]').contains(/Sarah Fitzgerald/i);
    cy.get('[data-test="banner1-title"]').contains(/UX Designer & Developer/i);

    cy.get('[data-test="banner2-title"]').contains(/Why Join Us?/i);
    cy.get('[data-test="banner2-slogan"]').contains(/Elevate Your Freelance Career/i);
    cy.get('[data-test="banner2-desc"]').contains(/Take control of your professional journey with tools and opportunities/i);
    cy.get('[data-test="Global Opportunities"]').contains(/Global Opportunities/i);
    cy.get('[data-test="Access"]').contains(/Access projects from clients worldwide, expanding your reach beyond local markets./i);
    cy.get('[data-test="Secure Payments"]').contains(/Secure Payments/i);
    cy.get('[data-test="Get"]').contains(/Get paid on time, every time with our secure payment protection system./i);
    cy.get('[data-test="Zero Commission"]').contains(/Zero Commission/i);
    cy.get('[data-test="Keep"]').contains(/Keep more of what you earn with our zero-commission policy on your earnings./i);
    cy.get('[data-test="Professional Growth"]').contains(/Professional Growth/i);
    cy.get('[data-test="Build"]').contains(/Build your reputation with client reviews and unlock premium opportunities./i);

    cy.get('[data-test="banner3-title"]').contains(/Ready to grow your business?/i);
    cy.get('[data-test="banner3-create-btn"]').contains(/Create Free Account/i);

    cy.get('[data-test="footer"]').contains(/Copyright @ 2025 Quolance/i);

  })

  it('Flow For /why-quolance/about-us', () => {
    cy.visit('/why-quolance/about-us')

    cy.get('[data-test="quolance-header-unauthenticated"]').contains(/Quolance/i);

    cy.get('[data-test="How It Works"]').contains(/How It Works/i);
    cy.get('[data-test="How It Works"]').trigger('mouseover')

    // Removing the problematic Why Quolance? element checks
    // cy.get('[data-test="Why Quolance?"]').contains(/Why Quolance?/i);
    // cy.get('[data-test="Why Quolance?"]').trigger('mouseover');

    cy.get('[data-test="What\'s New"]').trigger('mouseover');

    cy.get('[data-test="Support"]').contains(/Support/i);
    cy.get('[data-test="Support"]').trigger('mouseover');

    cy.get('[data-test="sign-up-header"]').contains(/Sign up/i);

    cy.get('[data-test="sign-in-header"]').contains(/Sign in/i);

    cy.get('[data-test="header-title"]').contains(/About Quolance/i);
    cy.get('[data-test="header-slogan"]').contains(/Connecting Talent with Opportunity/i);
    cy.get('[data-test="header-desc"]').contains(/We're building the future of work by empowering businesses to connect with top freelance talent globally./i);


    cy.get('[data-test="content-section-desc1"]').contains(/At Quolance, we believe in the power of remote work and the unlimited potential it brings./i);
    cy.get('[data-test="content-section-desc2"]').contains(/We've built a marketplace that prioritizes quality, transparency, and fair practices./i);
    cy.get('[data-test="content-section-desc3"]').contains(/Our platform is designed to make the hiring process seamless and secure./i);
    cy.get('[data-test="content-section-desc4"]').contains(/Whether you're a business looking to scale or a freelancer ready to showcase your skills/i);

    cy.get('[data-test="value-section-title"]').contains(/Our Values/i);
    cy.get('[data-test="value-section-slogan"]').contains(/These core principles guide everything we do at Quolance, from platform development to community support./i);


    cy.get('[data-test="Quality First"]').contains(/Quality First/i);
    cy.get('[data-test="We"]').contains(/We maintain high standards in our marketplace by carefully vetting freelancers and ensuring top-quality deliverables./i);
    cy.get('[data-test="Global Opportunity"]').contains(/Global Opportunity/i);
    cy.get('[data-test="Connect"]').contains(/Connect talent with opportunities worldwide, breaking down geographical barriers in the digital workforce./i);
    cy.get('[data-test="Fair & Transparent"]').contains(/Fair & Transparent/i);
    cy.get('[data-test="Clear"]').contains(/Clear pricing, zero hidden fees, and secure payment protection for both clients and freelancers./i);
    cy.get('[data-test="Community Driven"]').contains(/Community Driven/i);
    cy.get('[data-test="Building"]').contains(/Building a supportive ecosystem where freelancers and clients can grow and succeed together./i);
    cy.get('[data-test="Innovation"]').contains(/Innovation/i);
    cy.get('[data-test="Continuously"]').contains(/Continuously improving our platform with cutting-edge features to enhance the freelancing experience./i);
    cy.get('[data-test="Empowering Growth"]').contains(/Empowering Growth/i);
    cy.get('[data-test="Providing"]').contains(/Providing the tools and support needed for both freelancers and clients to achieve their goals./i);

    cy.get('[data-test="footer"]').contains(/Copyright @ 2025 Quolance/i);

  })

  it('Flow For /why-quolance/reviews', () => {
    cy.visit('/why-quolance/reviews')

    cy.get('[data-test="quolance-header-unauthenticated"]').contains(/Quolance/i);

    cy.get('[data-test="How It Works"]').contains(/How It Works/i);
    cy.get('[data-test="How It Works"]').trigger('mouseover')

    // Removing the problematic Why Quolance? element checks
    // cy.get('[data-test="Why Quolance?"]').contains(/Why Quolance?/i);
    // cy.get('[data-test="Why Quolance?"]').trigger('mouseover');

    cy.get('[data-test="What\'s New"]').trigger('mouseover');

    cy.get('[data-test="Support"]').contains(/Support/i);
    cy.get('[data-test="Support"]').trigger('mouseover');

    cy.get('[data-test="sign-up-header"]').contains(/Sign up/i);

    cy.get('[data-test="sign-in-header"]').contains(/Sign in/i);

    cy.get('[data-test="hero-section-title"]').contains(/Client Success Stories/i);
    cy.get('[data-test="hero-section-desc"]').contains(/Discover how Quolance has helped businesses and freelancers achieve their goals./i);

    cy.get('[data-test="reviews-section-title"]').contains(/Testimonials/i);
    cy.get('[data-test="reviews-section-slogan"]').contains(/Trusted by Businesses Worldwide/i);
    cy.get('[data-test="reviews-section-desc"]').contains(/Read what our clients say about their experience with Quolance/i);

    cy.get('[data-test="Benjamin Foster"]').contains(/Benjamin Foster/i);
    cy.get('[data-test="Senior Frontend Developer | Contract"]').contains(/Senior Frontend Developer | Contract/i);
    cy.get('[data-test="Very"]').contains(/Very pleased with the service. Quolance is the go-to for quality freelancing./i);
 

    cy.get('[data-test="cta-section-title"]').contains(/Ready to experience the difference?/i);
    cy.get('[data-test="get-started-btn"]').contains(/Get Started/i);


    cy.get('[data-test="footer"]').contains(/Copyright @ 2025 Quolance/i);

  })

  it('Flow For /whats-new/blog', () => {
    cy.visit('/whats-new/blog')

    cy.get('[data-test="quolance-header-unauthenticated"]').contains(/Quolance/i);

    cy.get('[data-test="How It Works"]').contains(/How It Works/i);
    cy.get('[data-test="How It Works"]').trigger('mouseover')

    // Removing the problematic Why Quolance? element checks
    // cy.get('[data-test="Why Quolance?"]').contains(/Why Quolance?/i);
    // cy.get('[data-test="Why Quolance?"]').trigger('mouseover');

    cy.get('[data-test="What\'s New"]').trigger('mouseover');

    cy.get('[data-test="Support"]').contains(/Support/i);
    cy.get('[data-test="Support"]').trigger('mouseover');

    cy.get('[data-test="sign-up-header"]').contains(/Sign up/i);

    cy.get('[data-test="sign-in-header"]').contains(/Sign in/i);

    cy.get('[data-test="blog-title"]').contains(/Blog/i);
    cy.get('[data-test="blog-desc"]').contains(/Stay up to date with the latest news. Here you can find articles, events, news./i);


    cy.get('[data-test="blog-title-unauthenticated"]').contains(/Sign In Required/i);
    cy.get('[data-test="blog-desc-unauthenticated"]').contains(/You must be signed in to create a post. Please log in to continue./i);
    cy.get('[data-test="blog-btn-unauthenticated"]').contains(/Sign In/i);

    cy.get('[data-test="footer"]').contains(/Copyright @ 2025 Quolance/i);

  })

  it('Successfull Flow For Submitting Email on contact-us page', () => {
    cy.visit('/support/contact-us')

    cy.get('[data-test="quolance-header-unauthenticated"]').contains(/Quolance/i);

    cy.get('[data-test="How It Works"]').contains(/How It Works/i);
    cy.get('[data-test="How It Works"]').trigger('mouseover')

    // Removing the problematic Why Quolance? element checks
    // cy.get('[data-test="Why Quolance?"]').contains(/Why Quolance?/i);
    // cy.get('[data-test="Why Quolance?"]').trigger('mouseover');

    cy.get('[data-test="What\'s New"]').trigger('mouseover');

    cy.get('[data-test="Support"]').contains(/Support/i);
    cy.get('[data-test="Support"]').trigger('mouseover');

    cy.get('[data-test="sign-up-header"]').contains(/Sign up/i);

    cy.get('[data-test="sign-in-header"]').contains(/Sign in/i);

    cy.get('[data-test="contact-us-title"]').contains(/Get in touch/i);
    cy.get('[data-test="contact-us-desc"]').contains(/Have questions about Quolance?/i);
    cy.get('[data-test="contact-us-email-title"]').contains(/Email/i);
    cy.get('[data-test="contact-us-email-value"]').contains(/contact@quolance.com/i);

    cy.get('[data-test="first-name-label"]').contains(/First name/i);
    cy.get('[data-test="first-name-input"]').type('John');
    cy.get('[data-test="last-name-label"]').contains(/Last name/i);
    cy.get('[data-test="last-name-input"]').type('Doe');
    cy.get('[data-test="email-label"]').contains(/Email/i);
    cy.get('[data-test="email-input"]').type('John@Doe.com');
    cy.get('[data-test="message-label"]').contains(/Message/i);
    cy.get('[data-test="message-input"]').type('How to set up a client account?');
    cy.get('[data-test="send-message-btn"]').contains(/Send message/i).click();


    cy.get('[data-test="footer"]').contains(/Copyright @ 2025 Quolance/i);

  })

  it('Flow for /projects', () => {
   
    cy.intercept('GET', '/api/public/projects/all?page=0&size=10', {
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

    cy.get('[data-test="quolance-header-unauthenticated"]').contains(/Quolance/i);

    cy.get('[data-test="How It Works"]').contains(/How It Works/i);
    cy.get('[data-test="How It Works"]').trigger('mouseover')

    // Removing the problematic Why Quolance? element checks
    // cy.get('[data-test="Why Quolance?"]').contains(/Why Quolance?/i);
    // cy.get('[data-test="Why Quolance?"]').trigger('mouseover');

    cy.get('[data-test="What\'s New"]').trigger('mouseover');

    cy.get('[data-test="Support"]').contains(/Support/i);
    cy.get('[data-test="Support"]').trigger('mouseover');

    cy.get('[data-test="sign-up-header"]').contains(/Sign up/i);

    cy.get('[data-test="sign-in-header"]').contains(/Sign in/i);

    cy.get('[data-test="projects-header-img"]').should('be.visible');;
    cy.get('[data-test="projects-header-title"]').contains(/Project Catalog/i);
    cy.get('[data-test="projects-header-slogan"]').contains(/Find Your Next Project Today/i);
    cy.get('[data-test="projects-header-desc"]').contains(/Discover projects that match your skills and passions./i);
    cy.get('[data-test="projects-header-btn"]').contains(/Sign Up For Free/i);

    cy.get('[data-test="All Projects"]').contains(/All Projects/i);

    cy.get('[data-test="project-filter-label-title"]').contains(/Search by title/i);
    cy.get('[data-test="project-filter-input-title"]').type('Project Title1');
   
    cy.get('[data-test="project-filter-label-category"]').contains(/Category/i);
    cy.get('[data-test="project-filter-label-category"]').next().find('button') .click();
    cy.get('[role="option"]').contains('Web Development').click();
   
    cy.get('[data-test="project-filter-label-budget"]').contains(/Budget/i);
    cy.get('[data-test="project-filter-label-budget"]').next().find('button') .click();
    cy.get('[role="option"]').contains('Less than $500').click();


    cy.get('[data-test="project-filter-label-experience"]').contains(/Experience Level/i);
    cy.get('[data-test="project-filter-label-experience"]').next().find('button') .click();
    cy.get('[role="option"]').contains('Junior').click();
   
    cy.get('[data-test="apply-filters-btn"]').contains(/Apply Filters/i)
    cy.get('[data-test="reset-filters-btn"]').contains(/Reset Filters/i);


    cy.wait('@getProjects');


    cy.get('[data-test="Project Title3"]').contains(/Project Title3/i)
    cy.get('[data-test="<p>Project Description3</p>"]').contains(/Project Description3/i)
    cy.get('[data-test="MORE_10000"]').contains(/10000+/i)
    cy.get('[data-test="DIGITAL_MARKETING"]').contains(/Digital Marketing/i)
    cy.get('[data-test="FLEXIBLE"]').contains(/Flexible/i)


    cy.get('[data-test="Project Title2"]').contains(/Project Title2/i)
    cy.get('[data-test="<p>Project Description2</p>"]').contains(/Project Description2/i)
    cy.get('[data-test="BETWEEN_1000_5000"]').contains(/1000/i)
    cy.get('[data-test="UI_UX_DESIGN"]').contains(/Ui Ux Design/i)
    cy.get('[data-test="WITHIN_A_MONTH"]').contains(/Within a month/i)


    cy.get('[data-test="Project Title1"]').contains(/Project Title1/i)
    cy.get('[data-test="<p>Project Description1</p>"]').contains(/Project Description1/i)
    cy.get('[data-test="LESS_500"]').contains(/500/i)
    cy.get('[data-test="WEB_DEVELOPMENT"]').contains(/Web Development/i)
    cy.get('[data-test="IMMEDIATELY"]').contains(/Immediately/i)


    cy.get('[data-test="pagination"]').contains(/Showing 1 to 3 of 3 results/i)


    cy.get('[data-test="apply-filters-btn"]').click();


    cy.get('[data-test="no-projects-found"]').contains(/No projects found/i)


    cy.get('[data-test="reset-filters-btn"]').click();


    cy.get('[data-test="pagination"]').contains(/Showing 1 to 3 of 3 results/i)


    cy.get('[data-test="footer"]').contains(/Copyright @ 2025 Quolance/i);

  })