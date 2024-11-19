package com.quolance.quolance_api.services.business_workflow;

import com.quolance.quolance_api.entities.User;

import java.util.List;

public interface ApplicationProcessWorkflow {
    void selectFreelancer(Long applicationId, User client); // used by client
    void rejectApplication(Long applicationId, User client); // used by client
    void rejectManyApplications(List<Long> applicationId, User client); // used by client

    void cancelApplication(Long applicationId, User freelancer); // used by freelancer
}
