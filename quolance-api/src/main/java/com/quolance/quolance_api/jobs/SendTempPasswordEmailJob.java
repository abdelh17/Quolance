package com.quolance.quolance_api.jobs;

import com.quolance.quolance_api.jobs.handlers.SendTempPasswordEmailJobHandler;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.jobrunr.jobs.lambdas.JobRequest;
import org.jobrunr.jobs.lambdas.JobRequestHandler;

import java.util.UUID;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SendTempPasswordEmailJob implements JobRequest {

    private UUID userId;
    private String tempPassword;

    @Override
    public Class<? extends JobRequestHandler> getJobRequestHandler() {
        return SendTempPasswordEmailJobHandler.class;
    }
}
