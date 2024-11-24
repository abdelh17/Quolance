from base_request import BaseRequest

class AdminController(BaseRequest):
    def __init__(self, base_url):
        super().__init__(base_url)

    def get_all_pending_projects(self):
        """
        Sends a GET request to /api/admin/projects/pending/all to retrieve all pending projects.
        """
        return self.get("/api/admin/projects/pending/all")

    def approve_project(self, project_id):
        """
        Sends a POST request to /api/admin/projects/pending/{projectId}/approve to approve a project.
        """
        return self.post(f"/api/admin/projects/pending/{project_id}/approve")

    def reject_project(self, project_id):
        """
        Sends a POST request to /api/admin/projects/pending/{projectId}/reject to reject a project.
        """
        return self.post(f"/api/admin/projects/pending/{project_id}/reject")
