package com.quolance.quolance_api.services.business_workflow;

import com.quolance.quolance_api.entities.User;

import java.util.List;
import java.util.UUID;

public interface ApplicationProcessWorkflow {
    void selectFreelancer(UUID applicationId, User client); // used by client

    void rejectApplication(UUID applicationId, User client); // used by client

    void rejectManyApplications(List<UUID> applicationId, User client); // used by client

    void cancelApplication(UUID applicationId, User freelancer); // used by freelancer
}
