package com.quolance.quolance_api.services.business_workflow;

import com.quolance.quolance_api.entities.User;

import java.util.List;

public interface ApplicationProcessWorkflow {
    void selectFreelancer(Long applicationId, User client); // used by client
    void rejectApplication(Long applicationId, Long clientId); // used by client
    void rejectManyApplications(List<Long> applicationId, Long clientId); // used by client

    void confirmOffer(Long applicationId, Long freelancerId); // used by freelancer
    void cancelApplication(Long applicationId, Long freelancerId); // used by freelancer
}
