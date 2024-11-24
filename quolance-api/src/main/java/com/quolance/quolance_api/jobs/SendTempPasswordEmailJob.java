package com.quolance.quolance_api.jobs;

import com.quolance.quolance_api.jobs.handlers.SendTempPasswordEmailJobHandler;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.jobrunr.jobs.lambdas.JobRequest;
import org.jobrunr.jobs.lambdas.JobRequestHandler;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SendTempPasswordEmailJob implements JobRequest {

    private Long userId;
    private String tempPassword;

    @Override
    public Class<? extends JobRequestHandler> getJobRequestHandler() {
        return SendTempPasswordEmailJobHandler.class;
    }
}
