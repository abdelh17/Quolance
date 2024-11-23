from base_request import BaseRequest

class AuthController(BaseRequest):
    def __init__(self, base_url):
        super().__init__(base_url)

    def login(self, login_data):
        """
        Sends a POST request to /api/auth/login to log in a user.
        """
        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        response = self.post("/api/auth/login", json=login_data, headers=headers)
        return response

    def get_session(self):
        """
        Sends a GET request to /api/auth/me to retrieve the current user's session.
        """
        return self.get("/api/auth/me")

    def logout(self):
        """
        Sends a POST request to /api/auth/logout to log out the current user.
        """
        return self.post("/api/auth/logout")

    def get_csrf_token(self):
        """
        Sends a GET request to /api/auth/csrf to retrieve a CSRF token.
        """
        return self.get("/api/auth/csrf")
