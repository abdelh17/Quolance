package com.quolance.quolance_api.unit.controllers;

import com.quolance.quolance_api.controllers.EnumController;
import com.quolance.quolance_api.entities.enums.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class EnumControllerUnitTest {

    private static final String BASE_URL = "/api/enums";
    private EnumController enumController;

    private record EndpointData(
            String endpoint,
            List<String> expectedValues,
            Class<? extends Enum<?>> enumClass
    ) {}

    @BeforeEach
    void setUp() {
        enumController = new EnumController();
    }

    private static Stream<Arguments> provideEndpointTestData() {
        return Stream.of(
                Arguments.of(new EndpointData(
                        "/project-categories",
                        Arrays.stream(ProjectCategory.values()).map(Enum::name).toList(),
                        ProjectCategory.class
                )),
                Arguments.of(new EndpointData(
                        "/application-status",
                        Arrays.stream(ApplicationStatus.values()).map(Enum::name).toList(),
                        ApplicationStatus.class
                )),
                Arguments.of(new EndpointData(
                        "/expected-delivery-times",
                        Arrays.stream(ExpectedDeliveryTime.values()).map(Enum::name).toList(),
                        ExpectedDeliveryTime.class
                )),
                Arguments.of(new EndpointData(
                        "/freelancer-experience-levels",
                        Arrays.stream(FreelancerExperienceLevel.values()).map(Enum::name).toList(),
                        FreelancerExperienceLevel.class
                )),
                Arguments.of(new EndpointData(
                        "/price-ranges",
                        Arrays.stream(PriceRange.values()).map(Enum::name).toList(),
                        PriceRange.class
                )),
                Arguments.of(new EndpointData(
                        "/project-statuses",
                        Arrays.stream(ProjectStatus.values()).map(Enum::name).toList(),
                        ProjectStatus.class
                )),
                Arguments.of(new EndpointData(
                        "/roles",
                        Arrays.stream(Role.values()).map(Enum::name).toList(),
                        Role.class
                )),
                Arguments.of(new EndpointData(
                        "/tags",
                        Arrays.stream(Tag.values()).map(Enum::name).toList(),
                        Tag.class
                ))
        );
    }

    @Nested
    class IndividualEndpointTests {

        @ParameterizedTest(name = "Endpoint {0} should return correct values")
        @MethodSource("com.quolance.quolance_api.unit.controllers.EnumControllerUnitTest#provideEndpointTestData")
        void endpoint_ShouldReturnExpectedValues(EndpointData testData) {
            ResponseEntity<List<String>> response = getResponseForEndpoint(testData.endpoint());

            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
            assertThat(response.getBody())
                    .isNotNull()
                    .containsExactlyElementsOf(testData.expectedValues());
            assertResponseFormat(response);
        }

        @Test
        void getProjectCategories_ShouldReturnAllCategories() {
            ResponseEntity<List<String>> response = enumController.getProjectCategories();
            assertEnumResponse(response, ProjectCategory.values());
        }

        @Test
        void getApplicationStatuses_ShouldReturnAllStatuses() {
            ResponseEntity<List<String>> response = enumController.getApplicationStatuses();
            assertEnumResponse(response, ApplicationStatus.values());
        }

        @Test
        void getDeliveryTimes_ShouldReturnAllDeliveryTimes() {
            ResponseEntity<List<String>> response = enumController.getExpectedDeliveryTimes();
            assertEnumResponse(response, ExpectedDeliveryTime.values());
        }

        @Test
        void getExperienceLevels_ShouldReturnAllLevels() {
            ResponseEntity<List<String>> response = enumController.getFreelancerExperienceLevels();
            assertEnumResponse(response, FreelancerExperienceLevel.values());
        }

        @Test
        void getPriceRanges_ShouldReturnAllRanges() {
            ResponseEntity<List<String>> response = enumController.getPriceRanges();
            assertEnumResponse(response, PriceRange.values());
        }

        @Test
        void getProjectStatuses_ShouldReturnAllStatuses() {
            ResponseEntity<List<String>> response = enumController.getProjectStatuses();
            assertEnumResponse(response, ProjectStatus.values());
        }

        @Test
        void getRoles_ShouldReturnAllRoles() {
            ResponseEntity<List<String>> response = enumController.getRoles();
            assertEnumResponse(response, Role.values());
        }

        @Test
        void getTags_ShouldReturnAllTags() {
            ResponseEntity<List<String>> response = enumController.getTags();
            assertEnumResponse(response, Tag.values());
        }
    }

    @Nested
    class GeneralResponseTests {

        @Test
        void allEndpoints_ShouldReturnNonEmptyLists() {
            provideEndpointTestData().forEach(args -> {
                EndpointData testData = (EndpointData) args.get()[0];
                ResponseEntity<List<String>> response = getResponseForEndpoint(testData.endpoint());

                assertThat(response.getBody())
                        .isNotNull()
                        .isNotEmpty()
                        .hasSizeGreaterThan(0);
            });
        }

        @Test
        void allEndpoints_ShouldHaveConsistentResponseFormat() {
            provideEndpointTestData().forEach(args -> {
                EndpointData testData = (EndpointData) args.get()[0];
                ResponseEntity<List<String>> response = getResponseForEndpoint(testData.endpoint());
                assertResponseFormat(response);
            });
        }

        @Test
        void allEndpoints_ShouldReturnUppercaseValues() {
            provideEndpointTestData().forEach(args -> {
                EndpointData testData = (EndpointData) args.get()[0];
                ResponseEntity<List<String>> response = getResponseForEndpoint(testData.endpoint());

                assertThat(response.getBody())
                        .isNotNull()
                        .allMatch(value -> value.equals(value.toUpperCase()));
            });
        }
    }

    private ResponseEntity<List<String>> getResponseForEndpoint(String endpoint) {
        return switch (endpoint) {
            case "/project-categories" -> enumController.getProjectCategories();
            case "/application-status" -> enumController.getApplicationStatuses();
            case "/expected-delivery-times" -> enumController.getExpectedDeliveryTimes();
            case "/freelancer-experience-levels" -> enumController.getFreelancerExperienceLevels();
            case "/price-ranges" -> enumController.getPriceRanges();
            case "/project-statuses" -> enumController.getProjectStatuses();
            case "/roles" -> enumController.getRoles();
            case "/tags" -> enumController.getTags();
            default -> throw new IllegalArgumentException("Unknown endpoint: " + endpoint);
        };
    }

    private <T extends Enum<T>> void assertEnumResponse(ResponseEntity<List<String>> response, T[] enumValues) {
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody())
                .isNotNull()
                .containsExactlyElementsOf(
                        Arrays.stream(enumValues)
                                .map(Enum::name)
                                .toList()
                );
        assertResponseFormat(response);
    }

    private void assertResponseFormat(ResponseEntity<List<String>> response) {
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody())
                .isNotNull()
                .isInstanceOf(List.class)
                .allMatch(item -> item instanceof String)
                .allMatch(item -> !item.isEmpty());
    }
}