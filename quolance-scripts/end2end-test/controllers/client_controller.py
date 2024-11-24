from base_request import BaseRequest
from datetime import datetime

class ClientController(BaseRequest):
    def __init__(self, base_url):
        super().__init__(base_url)

    def create_project(self, project_data):
        """
        Sends a POST request to /api/client/create-project to create a new project.
        """
        return self.post("/api/client/create-project", json=project_data)

    def get_project(self, project_id):
        """
        Sends a GET request to /api/client/projects/{projectId} to get project details.
        """
        return self.get(f"/api/client/projects/{project_id}")

    def delete_project(self, project_id):
        """
        Sends a DELETE request to /api/client/projects/{projectId} to delete a project.
        """
        return self.delete(f"/api/client/projects/{project_id}")

    def get_all_client_projects(self):
        """
        Sends a GET request to /api/client/projects/all to get all projects of the client.
        """
        return self.get("/api/client/projects/all")

    def get_all_applications_to_project(self, project_id):
        """
        Sends a GET request to /api/client/projects/{projectId}/applications/all to get all applications for a project.
        """
        return self.get(f"/api/client/projects/{project_id}/applications/all")

    def select_freelancer(self, application_id):
        """
        Sends a POST request to /api/client/applications/{applicationId}/select-freelancer to select a freelancer for a project.
        """
        return self.post(f"/api/client/applications/{application_id}/select-freelancer")

    def reject_freelancer(self, application_id):
        """
        Sends a POST request to /api/client/applications/{applicationId}/reject-freelancer to reject a freelancer for a project.
        """
        return self.post(f"/api/client/applications/{application_id}/reject-freelancer")

    def bulk_reject_freelancers(self, application_ids):
        """
        Sends a POST request to /api/client/applications/bulk/reject-freelancer to reject many freelancers for a project.
        """
        return self.post(f"/api/client/applications/bulk/reject-freelancer", json=application_ids)