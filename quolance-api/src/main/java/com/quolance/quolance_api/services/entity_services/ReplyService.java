package com.quolance.quolance_api.services.entity_services;

import com.quolance.quolance_api.dtos.ReplyDto;

import java.util.List;
import java.util.Optional;

public interface ReplyService {

    List<ReplyDto> getAllReplies();
    Optional<ReplyDto> getReplyById(Long id);
    ReplyDto createReply(ReplyDto replyDto);
    ReplyDto updateReply(Long id, ReplyDto replyDto);
    void deleteReply(Long id);
}