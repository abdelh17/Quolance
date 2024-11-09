package com.quolance.quolance_api.services;

import java.util.List;

public interface ApplicationProcessWorkflow {
    void selectFreelancer(Long applicationId, Long clientId); // used by client
    void rejectApplication(Long applicationId, Long clientId); // used by client
    void rejectManyApplications(List<Long> applicationId, Long clientId); // used by client

    void confirmOffer(Long applicationId, Long freelancerId); // used by freelancer
    void cancelApplication(Long applicationId, Long freelancerId); // used by freelancer
}
