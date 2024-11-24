import requests
import json

class BaseRequest:
    # Static session shared by all instances of BaseRequest and its subclasses
    _session = requests.Session()

    def __init__(self, base_url):
        self.base_url = base_url

    def get(self, endpoint, params=None, headers=None):
        response = BaseRequest._session.get(f"{self.base_url}{endpoint}", params=params, headers=headers)
        return self._handle_response(response)

    def post(self, endpoint, json=None, headers=None):
        if headers is None:
            headers = {'Content-Type': 'application/json'}
        response = BaseRequest._session.post(f"{self.base_url}{endpoint}", json=json, headers=headers)
        return self._handle_response(response)

    def put(self, endpoint, json=None, headers=None):
        if headers is None:
            headers = {'Content-Type': 'application/json'}
        response = BaseRequest._session.put(f"{self.base_url}{endpoint}", json=json, headers=headers)
        return self._handle_response(response)

    def patch(self, endpoint, json=None, headers=None):
        if headers is None:
            headers = {'Content-Type': 'application/json'}
        response = BaseRequest._session.patch(f"{self.base_url}{endpoint}", json=json, headers=headers)
        return self._handle_response(response)

    def delete(self, endpoint, headers=None):
        """
        Sends a DELETE request to the specified endpoint.
        """
        if headers is None:
            headers = {'Content-Type': 'application/json'}
        response = BaseRequest._session.delete(f"{self.base_url}{endpoint}", headers=headers)
        return self._handle_response(response)

    def _handle_response(self, response):
        print(f"Status Code: {response.status_code}")

        # Check if the response is JSON
        if response.headers.get('Content-Type', '').startswith('application/json'):
            try:
                # Attempt to parse the JSON response
                json_response = response.json()
                # Pretty-print the JSON response with indentation
                formatted_response = json.dumps(json_response, indent=4)
                print("Response (formatted JSON):")
                print(formatted_response)
            except requests.exceptions.JSONDecodeError:
                print("Error decoding JSON response")
        else:
            # Print non-JSON response as is
            print("Response (non-JSON):")
            print(response.text)
