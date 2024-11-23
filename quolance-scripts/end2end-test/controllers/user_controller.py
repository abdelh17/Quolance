from base_request import BaseRequest

class UsersController(BaseRequest):
    def __init__(self, base_url):
        super().__init__(base_url)

    def create_user(self, user_data):
        """
        Sends a POST request to create a new user.
        """
        headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}
        return self.post("/api/users", json=user_data, headers=headers)

    def create_admin(self, admin_data):
        """
        Sends a POST request to create a new admin user.
        """
        headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}
        return self.post("/api/users/admin", json=admin_data, headers=headers)

    def verify_email(self, token):
        """
        Sends a GET request to verify the user's email with a token.
        """
        return self.get("/api/users/verify-email", params={'token': token})

    def forgot_password(self, email):
        """
        Sends a POST request to initiate a password reset.
        """
        headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}
        return self.post("/api/users/forgot-password", json={"email": email}, headers=headers)

    def reset_password(self, password_data):
        """
        Sends a PATCH request to reset the user's password.
        """
        headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}
        return self.patch("/api/users/reset-password", json=password_data, headers=headers)

    def update_user(self, update_data):
        """
        Sends a PUT request to update the user's profile.
        Requires the user to be authenticated.
        """
        headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}
        return self.put("/api/users", json=update_data, headers=headers)

    def update_password(self, password_data):
        """
        Sends a PATCH request to update the user's password.
        Requires the user to be authenticated.
        """
        headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}
        return self.patch("/api/users/password", json=password_data, headers=headers)
