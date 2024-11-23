from base_request import BaseRequest

class PublicController(BaseRequest):
    def __init__(self, base_url):
        super().__init__(base_url)

    def get_all_available_projects(self):
        """
        Sends a GET request to /api/public/projects/all to view all available projects as a guest.
        """
        return self.get("/api/public/projects/all")

    def get_project_by_id(self, project_id):
        """
        Sends a GET request to /api/public/projects/{projectId} to view a specific project by its ID as a guest.
        """
        return self.get(f"/api/public/projects/{project_id}")
