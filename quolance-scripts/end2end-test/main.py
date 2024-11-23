from controllers.user_controller import UsersController
from controllers.auth_controller import AuthController
from controllers.client_controller import ClientController
from controllers.admin_controller import AdminController
from controllers.freelancer_controller import FreelancerController
import time
from colorama import Fore, Style, init

# Initialize colorama
init(autoreset=True)

def print_action(message):
    """
    Prints an action message in red with '>>>>' prefix.
    """
    print(f"\n{Fore.RED}>>>> {message}{Style.RESET_ALL}")
    time.sleep(0.1)

def main():
    # Base URL of your Spring Boot application
    base_url = "http://localhost:8080"

    # Initialize controllers with the base URL
    user_controller = UsersController(base_url)
    auth_controller = AuthController(base_url)
    client_controller = ClientController(base_url)
    freelancer_controller = FreelancerController(base_url)
    admin_controller = AdminController(base_url)

    # ================* Step 0: Setup *================

    # Step 0.1: Client Data
    client_data_1 = {
        "email": "client_1@example.com",
        "password": "Password123",
        "passwordConfirmation": "Password123",
        "firstName": "John",
        "lastName": "Doe",
        "role": "CLIENT"
    }
    client_login_data_1 = {
        "email": "client_1@example.com",
        "password": "Password123"
    }

    # Step 0.2: New Project Data
    project_data_1 = {
        "projectTitle": "New AI Development Project",
        "projectDescription": "Develop an AI model for predictive analytics",
        "projectExpirationDate": "2024-12-31",
        "projectCategory": "WEB_DEVELOPMENT",
        "priceRange": "LESS_500",
        "experienceLevel": "JUNIOR",
        "expectedDeliveryTime": "IMMEDIATELY",
        "tags": ["JAVA"]
    }
    project_data_2 = {
        "projectTitle": "New Web Development Project",
        "projectDescription": "Build a responsive website for a startup",
        "projectExpirationDate": "2024-12-31",
        "projectCategory": "WEB_DEVELOPMENT",
        "priceRange": "LESS_500",
        "experienceLevel": "JUNIOR",
        "expectedDeliveryTime": "IMMEDIATELY",
        "tags": ["HTML", "CSS", "JAVASCRIPT"]
    }
    project_data_3 = {
        "projectTitle": "New Mobile App Development Project",
        "projectDescription": "Build a cross-platform mobile app",
        "projectExpirationDate": "2024-12-31",
        "projectCategory": "APP_DEVELOPMENT",
        "priceRange": "BETWEEN_5000_10000",
        "experienceLevel": "EXPERT",
        "expectedDeliveryTime": "FLEXIBLE",
        "tags": ["HTML", "CSS", "JAVASCRIPT", "JAVA"]
    }

    # Step 0.3: Freelancer Data
    freelancer_data_1 = {
        "email": "freelancer_1@example.com",
        "password": "Password123",
        "passwordConfirmation": "Password123",
        "firstName": "Alice",
        "lastName": "Doe",
        "role": "FREELANCER"
    }
    freelancer_login_data_1 = {
        "email": "freelancer_1@example.com",
        "password": "Password123"
    }

    # ================* Step 1: User Actions *================
    print_action("Creating client")
    user_controller.create_user(client_data_1)

    # Step 1.2: login the user
    print_action("Logging in client")
    auth_controller.login(client_login_data_1)

    print_action("Creating projects")
    client_controller.create_project(project_data_1)
    client_controller.create_project(project_data_2)
    client_controller.create_project(project_data_3)

    # Step 1.4: Get all client projects
    print_action("Getting all client projects")
    client_controller.get_all_client_projects()

    #Step 1.5: Logout the user
    print_action("Logging out client")
    auth_controller.logout()

    # Step 1.6: get project again (should fail)
    print_action("Getting all client projects (logout)")
    client_controller.get_all_client_projects()


    # ================* Step 2: Admin Actions *================

    print_action("Logging in admin")
    auth_controller.login({"email": "admin@quolance.com", "password": "admin"})

    # Step 2.1: Fetch all pending projects
    print_action("Fetching all pending projects (Admin)")
    admin_controller.get_all_pending_projects()

    # Step 2.2: Approve a project
    print_action(f"Approving project with ID {1} (Admin)")
    admin_controller.approve_project(1)

    # Step 2.3: Reject a project
    print_action(f"Rejecting project with ID {2} (Admin)")
    admin_controller.reject_project(2)

    # Step 2.4: Reject a project
    print_action(f"Rejecting project with ID {3} (Admin)")
    admin_controller.approve_project(3)

    # Step 2.5: Fetch all pending projects again (should be empty)
    print_action("Fetching all pending projects again (Admin)")
    admin_controller.get_all_pending_projects()

    print_action("Logging out admin")
    auth_controller.logout()


    # # ================* Step 3: Client actions *================
    # # Step 3.1: login the user again
    # print_action("Logging in client (again)")
    # auth_controller.login(client_login_data_1)
    #
    # # Step 3.2: Get all client projects
    # print_action("Getting all client projects")
    # client_controller.get_all_client_projects()
    #
    # # Step 3.3: Delete project with ID 2
    # print_action("Deleting project with ID 2")
    # client_controller.delete_project(2)
    #
    # # Step 3.4: Get all client projects after deletion
    # print_action("Getting all client projects after deletion")
    # client_controller.get_all_client_projects()
    #
    # # Step 3.5: Get project with ID 1
    # print_action("Getting project with ID 1")
    # client_controller.get_project(1)
    #
    #
    # # ================* Step 4: Freelancer actions *================
    # # Step 4.1: Create a freelancer user
    # print_action("Creating freelancer")
    # user_controller.create_user(freelancer_data_1)
    #
    # # Step 4.2: login the freelancer
    # print_action("Logging in freelancer")
    # auth_controller.login(freelancer_login_data_1)
    #
    # # Step 4.2: Get all available projects
    # print_action("Getting all available projects")
    # freelancer_controller.get_all_available_projects()
    #
    # # Step 4.3: Get project with ID 2
    # print_action("Getting project with ID 1")
    # freelancer_controller.get_project_by_id(1)
    #
    # # Step 4.4: Get all applications (should be empty)
    # print_action("Getting all applications")
    # freelancer_controller.get_all_freelancer_applications()
    #
    # # Step 4.5: Apply to project with ID 1
    # application_data_1 = {"projectId": 1}
    # print_action("Applying to project with ID 1")
    # freelancer_controller.apply_to_project(application_data_1)
    #
    # # Step 4.6: Get all applications again
    # print_action("Getting all applications again")
    # freelancer_controller.get_all_freelancer_applications()
    #
    # # Step 4.7: Get application with ID 1
    # print_action("Getting application with ID 1")
    # freelancer_controller.get_application(1)
    #
    # # Step 4.8: Delete application with ID 1
    # print_action("Deleting application with ID 1")
    # freelancer_controller.delete_application(1)
    #
    # # Step 4.9: Get all applications again
    # print_action("Getting all applications again")
    # freelancer_controller.get_all_freelancer_applications()
    #
    # # Step 4.10: Re-apply
    # print_action("Re-applying to project with ID 1")
    # freelancer_controller.apply_to_project(application_data_1)
    #
    # # 4.11: Re-apply again (should fail)
    # print_action("Re-applying to project with ID 1 (again) (should fail)")
    # freelancer_controller.apply_to_project(application_data_1)
    #
    # # Step 4.11: Get all applications again
    # print_action("Getting all applications again")
    # freelancer_controller.get_all_freelancer_applications()
    #
    # # Step 4.12: Logout the user
    # print_action("Logging out freelancer")
    # auth_controller.logout()
    #
    #
    # # ================* Step 5: Client actions *================
    # # Step 5.1: login the user again
    # print_action("Logging in client (again)")
    # auth_controller.login(client_login_data_1)
    #
    # # Step 5.2: Get all client projects
    # print_action("Getting all client projects")
    # client_controller.get_all_client_projects()
    #
    # # Step 5.3: Get project with ID 1
    # print_action("Getting project with ID 1")
    # client_controller.get_project(1)
    #
    # # Step 5.4: Get all applications for project with ID 1
    # print_action("Getting all applications for project with ID 1")
    # client_controller.get_all_applications_to_project(1)
    #
    # # # Step 5.5: Approve application with ID 2
    # # print_action("selecting application with ID 2")
    # # client_controller.select_freelancer(2)
    # #
    # # # Step 5.6: Approve application with ID 2
    # # print_action("Re-selecting application with ID 2 (should fail)")
    # # client_controller.select_freelancer(2)
    #
    # # Step 5.7: Reject application with ID 2 (should fail)
    # print_action("Rejecting application with ID 2 (should fail)")
    # client_controller.reject_freelancer(2)
    #
    # # Step 5.7: Reject application with ID 2 (should fail)
    # print_action("Rejecting twice application with ID 2 (should fail)")
    # client_controller.reject_freelancer(2)
    #
    # # Step 5.6: Get all applications for project with ID 2
    # print_action("Getting all applications for project with ID 1")
    # client_controller.get_all_applications_to_project(1)
    #
    # # Step 5.7: logout the user
    # print_action("Logging out client")
    # auth_controller.logout()
    #
    #
    # # ================* Step 6: Freelancer actions *================
    # # Step 6.1: login the freelancer again
    # print_action("Logging in freelancer (again)")
    # auth_controller.login(freelancer_login_data_1)
    #
    # # Step 6.2: Get all applications again
    # print_action("Getting all applications again")
    # freelancer_controller.get_all_freelancer_applications()
    #
    # # Step 6.3: Get application with ID 1
    # print_action("Getting application with ID 2")
    # freelancer_controller.get_application(2)
    #
    # # Step 6.4: Get project with ID 1
    # print_action("Getting project with ID 1")
    # freelancer_controller.get_project_by_id(1)
    #
    # # Step 6.5: Get all available projects
    # print_action("Getting all available projects")
    # freelancer_controller.get_all_available_projects()

    # ================* Step 7: Bulk Reject Setup and Test *================
    # Step 7.1: Login the client
    print_action("Logging in client (again)")
    auth_controller.login(client_login_data_1)

    # Step 7.2: Logout the client
    print_action("Logging out client")
    auth_controller.logout()

    # Step 7.3: Create 3 new freelancers
    freelancers = [
        {"email": f"freelancer_{i}@example.com", "password": "Password123", "passwordConfirmation": "Password123", "firstName": f"Freelancer{i}", "lastName": "Test", "role": "FREELANCER"}
        for i in range(2, 5)
    ]
    for freelancer_data in freelancers:
        print_action(f"Creating freelancer: {freelancer_data['email']}")
        user_controller.create_user(freelancer_data)

    # Step 7.5: Freelancers apply to the new project
    application_data_2 = {"projectId": 3}  # Assuming the new project ID is 3
    for i, freelancer_data in enumerate(freelancers):
        print_action(f"Logging in freelancer {freelancer_data['email']}")
        auth_controller.login({"email": freelancer_data["email"], "password": freelancer_data["password"]})

        print_action(f"Freelancer {freelancer_data['email']} applying to project with ID 3")
        freelancer_controller.apply_to_project(application_data_2)

        print_action(f"Logging out freelancer {freelancer_data['email']}")
        auth_controller.logout()

    # Step 7.6: Login client and test bulk reject
    print_action("Logging in client")
    auth_controller.login(client_login_data_1)

    # get project with ID 3
    print_action("Getting project with ID 3")
    client_controller.get_project(3)

    print_action("Getting all applications for project with ID 3")
    client_controller.get_all_applications_to_project(3)

    """
    Test cases:
        [1, 2, 3]
        [1, 3]
        [1]
        [2, 99, 3]
        [1, 1, 2, 1, 3, 99, 3]
    """
    print_action("selecting freelancer with app ID 1")
    client_controller.select_freelancer(1)

    print_action(f"Bulk rejecting freelancers for project with ID 3")
    client_controller.bulk_reject_freelancers([1, 1, 2, 1, 3, 99, 3])

    print_action("Getting all applications for project with ID 3 after rejection")
    client_controller.get_all_applications_to_project(3)

    # Step 7.7: Logout the client
    print_action("Logging out client")
    auth_controller.logout()


if __name__ == "__main__":
    main()
