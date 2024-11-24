package com.quolance.quolance_api;

import io.restassured.RestAssured;
import io.restassured.response.Response;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@RequiredArgsConstructor
public class ApiE2ETests {
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @LocalServerPort
    private int port;

    @BeforeEach
    public void setup() {
        RestAssured.port = port;
    }

    @BeforeEach
    public void setupAdminUser() {
        String encodedPassword = passwordEncoder.encode("Test1234"); // Assuming you have access to your password encoder
        jdbcTemplate.execute("INSERT INTO users (id,CREATED_DATE, email,first_name,last_name, password, role, verified) VALUES (984, '2024-11-24 16:09:47.395867','admin@admin.com','Root','Admin', '" + encodedPassword + "', 'ADMIN','true')");
    }


    private String clientUser1RequestBody = "{\"email\": \"client1@client.com\", \"password\": \"Test1234\",\"passwordConfirmation\": \"Test1234\", \"firstName\": \"Client 1\",\"lastName\": \"Last Name\",\"role\": \"CLIENT\" }";
    private String clientUser2RequestBody = "{\"email\": \"client2@client.com\", \"password\": \"Test1234\",\"passwordConfirmation\": \"Test1234\", \"firstName\": \"Client 2\",\"lastName\": \"Last Name\",\"role\": \"CLIENT\" }";

    @Test
    public void e2eTest() {
        // Test user registration
        System.out.println("Testing user registration: Client 1");
        given()
                .contentType("application/json")
                .body(clientUser1RequestBody)
                .post("/api/users")
                .then()
                .statusCode(200);

        // Test authentication
        System.out.println("Testing user authentication: Client 1");
        Response loginResponse = given()
                .contentType("application/json")
                .body("{ \"email\": \"client1@client.com\", \"password\": \"Test1234\"}")
                .post("/api/auth/login")
                .then()
                .statusCode(200)
                .extract().response();

        String sessionCookie = loginResponse.getCookie("JSESSIONID");

        // Test authenticated user details
        System.out.println("Testing authenticated user details: Client 1");
        given()
                .cookie("JSESSIONID", sessionCookie)
                .when()
                .get("/api/auth/me")
                .then()
                .statusCode(200)
                .body("email", equalTo("client1@client.com"))
                .body("role", equalTo("CLIENT"))
                .body("firstName", equalTo("Client 1"))
                .body("lastName", equalTo("Last Name"));

        // Test changing user details
        System.out.println("Testing changing user details: Client 1");
        given()
                .cookie("JSESSIONID", sessionCookie)
                .contentType("application/json")
                .body("{ \"firstName\": \"ChangedFirstName\", \"lastName\": \"ChangedLastName\"}")
                .put("/api/users")
                .then()
                .statusCode(200);

        // Verify user details successfully changed
        System.out.println("Testing authenticated user details after changing details: Client 1");
        given()
                .cookie("JSESSIONID", sessionCookie)
                .when()
                .get("/api/auth/me")
                .then()
                .statusCode(200)
                .body("firstName", equalTo("ChangedFirstName"))
                .body("lastName", equalTo("ChangedLastName"));

        // Test accessing all projects
        System.out.println("Testing accessing all projects of logged in client: Client 1");
        given()
                .cookie("JSESSIONID", sessionCookie)
                .when()
                .get("/api/client/projects/all")
                .then()
                .statusCode(200)
                .body("size()", equalTo(0))
                .extract().response();

        // Test creating a project
        System.out.println("Testing creating a project: Client 1");
        given()
                .cookie("JSESSIONID", sessionCookie)
                .contentType("application/json")
                .body("{ \"projectTitle\": \"Project 1\",\n" + "  \"projectDescription\": \"Project description\",\n" + "  \"projectExpirationDate\": \"2025-11-22\",\n" + "  \"projectCategory\": \"WEB_DEVELOPMENT\",\n" + "  \"priceRange\": \"LESS_500\",\n" + "  \"experienceLevel\": \"JUNIOR\",\n" + "  \"expectedDeliveryTime\": \"IMMEDIATELY\",\n" + "  \"tags\": [\n" + "    \"JAVA\"\n" + "  ]}")
                .post("/api/client/create-project")
                .then()
                .statusCode(200)
                .body(equalTo("Project created successfully"))
                .extract().response();
        // Create a second project
        System.out.println("Testing creating a second project: Client 1");
        given()
                .cookie("JSESSIONID", sessionCookie)
                .contentType("application/json")
                .body("{ \"projectTitle\": \"Project 2\",\n" + "  \"projectDescription\": \"Project description\",\n" + "  \"projectExpirationDate\": \"2025-11-22\",\n" + "  \"projectCategory\": \"WEB_DEVELOPMENT\",\n" + "  \"priceRange\": \"LESS_500\",\n" + "  \"experienceLevel\": \"JUNIOR\",\n" + "  \"expectedDeliveryTime\": \"IMMEDIATELY\",\n" + "  \"tags\": [\n" + "    \"JAVA\"\n" + "  ]}")
                .post("/api/client/create-project")
                .then()
                .statusCode(200)
                .body(equalTo("Project created successfully"))
                .extract().response();

        // Test accessing all projects
        System.out.println("Testing accessing all projects of logged in client, check there are 2: Client 1");
        given()
                .cookie("JSESSIONID", sessionCookie)
                .when()
                .get("/api/client/projects/all")
                .then()
                .statusCode(200)
                .body("size()", equalTo(2))
                .extract().response();

        // Test accessing first project by id
        System.out.println("Testing accessing first project by id: Client 1");
        given()
                .cookie("JSESSIONID", sessionCookie)
                .when()
                .get("/api/client/projects/1")
                .then()
                .statusCode(200)
                .body("title", equalTo("Project 1"))
                .body("description", equalTo("Project description"))
                .body("category", equalTo("WEB_DEVELOPMENT"))
                .body("priceRange", equalTo("LESS_500"))
                .body("experienceLevel", equalTo("JUNIOR"))
                .body("expectedDeliveryTime", equalTo("IMMEDIATELY"))
                .body("tags[0]", equalTo("JAVA"))
                .body("projectStatus", equalTo("PENDING"));

        // Test deleting first project
        System.out.println("Testing deleting first project: Client 1");
        given()
                .cookie("JSESSIONID", sessionCookie)
                .when()
                .delete("/api/client/projects/1")
                .then()
                .statusCode(200)
                .body(equalTo("Project deleted successfully"));

        // Test accessing all projects after deletion
        System.out.println("Testing accessing all projects of logged in client, check there is 1 after deletion: Client 1");
        given()
                .cookie("JSESSIONID", sessionCookie)
                .when()
                .get("/api/client/projects/all")
                .then()
                .statusCode(200)
                .body("size()", equalTo(1))
                .extract().response();

        // Test accessing first project by id
        System.out.println("Testing accessing first project by id after deletion, should not work: Client 1");
        given()
                .cookie("JSESSIONID", sessionCookie)
                .when()
                .get("/api/client/projects/1")
                .then()
                .statusCode(404)
                .body("message", equalTo("No Project found with ID: 1"));

        // Test accessing all applications on a project empty
        System.out.println("Testing accessing all applications on a project should be empty: Client 1");
        given()
                .cookie("JSESSIONID", sessionCookie)
                .when()
                .get("/api/client/projects/2/applications/all")
                .then()
                .statusCode(200)
                .body("size()", equalTo(0));

        // Test logging out
        System.out.println("Testing logging out: Client 1");
        given()
                .cookie("JSESSIONID", sessionCookie)
                .when()
                .post("/api/auth/logout")
                .then()
                .statusCode(200);

        // Test accessing all projects as a public user
        System.out.println("Testing accessing all projects as a public user, should be empty, none approved: Public user");
        given()
                .get("/api/public/projects/all")
                .then()
                .statusCode(200)
                .body("size()", equalTo(0));

        // Test user registration
        System.out.println("Testing user registration: Client 2");
        given()
                .contentType("application/json")
                .body(clientUser2RequestBody)
                .post("/api/users")
                .then()
                .statusCode(200);

        // Test authentication
        System.out.println("Testing user authentication: Client 2");
        Response loginResponse2 = given()
                .contentType("application/json")
                .body("{ \"email\": \"client2@client.com\", \"password\": \"Test1234\"}")
                .post("/api/auth/login")
                .then()
                .statusCode(200)
                .extract().response();

        String sessionCookie2 = loginResponse2.getCookie("JSESSIONID");

        // Test accessing all projects
        System.out.println("Testing accessing all projects, should be empty, none approved: Client 2");
        given()
                .cookie("JSESSIONID", sessionCookie2)
                .get("/api/public/projects/all")
                .then()
                .statusCode(200)
                .body("size()", equalTo(0));
    }
}