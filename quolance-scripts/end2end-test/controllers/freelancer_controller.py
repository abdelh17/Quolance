from base_request import BaseRequest

class FreelancerController(BaseRequest):
    def __init__(self, base_url):
        super().__init__(base_url)

    def apply_to_project(self, application_data):
        """
        Sends a POST request to /api/freelancer/submit-application to create a new application on a project.
        """
        return self.post("/api/freelancer/submit-application", json=application_data)

    def get_application(self, application_id):
        """
        Sends a GET request to /api/freelancer/applications/{applicationId} to view an application.
        """
        return self.get(f"/api/freelancer/applications/{application_id}")

    def delete_application(self, application_id):
        """
        Sends a DELETE request to /api/freelancer/applications/{applicationId} to delete an application.
        """
        return self.delete(f"/api/freelancer/applications/{application_id}")

    def get_all_freelancer_applications(self):
        """
        Sends a GET request to /api/freelancer/applications/all to view all applications by the freelancer.
        """
        return self.get("/api/freelancer/applications/all")

    def get_all_available_projects(self):
        """
        Sends a GET request to /api/freelancer/projects/all to view all available projects.
        """
        return self.get("/api/freelancer/projects/all")

    def get_project_by_id(self, project_id):
        """
        Sends a GET request to /api/freelancer/projects/{projectId} to view a specific project by its ID.
        """
        return self.get(f"/api/freelancer/projects/{project_id}")
