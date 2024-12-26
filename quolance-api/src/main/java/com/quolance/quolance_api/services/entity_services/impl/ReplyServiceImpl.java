package com.quolance.quolance_api.services.entity_services.impl;

import com.quolance.quolance_api.dtos.ReplyDto;
import com.quolance.quolance_api.entities.Reactions;
import com.quolance.quolance_api.entities.Reply;
import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.repositories.ReactionRepository;
import com.quolance.quolance_api.repositories.ReplyRepository;
import com.quolance.quolance_api.repositories.UserRepository;
import com.quolance.quolance_api.services.entity_services.ReplyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ReplyServiceImpl implements ReplyService {

    @Autowired
    private ReplyRepository replyRepository;

    @Autowired
    private ReactionRepository reactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<ReplyDto> getAllReplies() {
        return replyRepository.findAll().stream()
                .map(ReplyDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<ReplyDto> getReplyById(Long id) {
        return replyRepository.findById(id)
                .map(ReplyDto::fromEntity);
    }

    @Override
    public ReplyDto createReply(ReplyDto replyDto) {
        Optional<Reactions> reaction = reactionRepository.findById(replyDto.getReactionId());
        Optional<User> user = userRepository.findById(replyDto.getUserId());

        if (reaction.isPresent() && user.isPresent()) {
            Set<Reply> relatedReplies = new HashSet<>();
            if (replyDto.getRelatedReplyIds() != null) {
                relatedReplies = replyDto.getRelatedReplyIds().stream()
                        .map(replyRepository::findById)
                        .filter(Optional::isPresent)
                        .map(Optional::get)
                        .collect(Collectors.toSet());
            }

            Reply reply = replyDto.toEntity(reaction.get(), user.get(), relatedReplies);
            Reply savedReply = replyRepository.save(reply);
            return ReplyDto.fromEntity(savedReply);
        } else {
            throw new IllegalArgumentException("Invalid reaction or user ID");
        }
    }

    @Override
    public ReplyDto updateReply(Long id, ReplyDto replyDto) {
        Optional<Reply> existingReply = replyRepository.findById(id);
        Optional<Reactions> reaction = reactionRepository.findById(replyDto.getReactionId());
        Optional<User> user = userRepository.findById(replyDto.getUserId());

        if (existingReply.isPresent() && reaction.isPresent() && user.isPresent()) {
            Set<Reply> relatedReplies = new HashSet<>();
            if (replyDto.getRelatedReplyIds() != null) {
                relatedReplies = replyDto.getRelatedReplyIds().stream()
                        .map(replyRepository::findById)
                        .filter(Optional::isPresent)
                        .map(Optional::get)
                        .collect(Collectors.toSet());
            }

            Reply reply = replyDto.toEntity(reaction.get(), user.get(), relatedReplies);
            reply.setId(id);
            Reply updatedReply = replyRepository.save(reply);
            return ReplyDto.fromEntity(updatedReply);
        } else {
            throw new IllegalArgumentException("Invalid reaction or user ID");
        }
    }

    @Override
    public void deleteReply(Long id) {
        if (replyRepository.existsById(id)) {
            replyRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Reply not found");
        }
    }
}