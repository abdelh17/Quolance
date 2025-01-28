package com.quolance.quolance_api.jobs;

import com.quolance.quolance_api.jobs.handlers.SendWelcomeEmailJobHandler;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.jobrunr.jobs.lambdas.JobRequest;
import org.jobrunr.jobs.lambdas.JobRequestHandler;

import java.util.UUID;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SendWelcomeEmailJob implements JobRequest {

    private UUID userId;

    @Override
    public Class<? extends JobRequestHandler> getJobRequestHandler() {
        return SendWelcomeEmailJobHandler.class;
    }
}