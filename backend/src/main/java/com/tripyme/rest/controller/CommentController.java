package com.tripyme.rest.controller;

import com.tripyme.rest.exception.ResourceNotFoundException;
import com.tripyme.rest.model.Comment;
import com.tripyme.rest.model.User;
import com.tripyme.rest.repository.CommentRepository;
import com.tripyme.rest.repository.PostRepository;
import com.tripyme.rest.repository.UserRepository;
import com.tripyme.rest.security.CurrentUser;
import com.tripyme.rest.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Optional;

@RestController
public class CommentController {

    @Autowired
    CommentRepository commentRepository;

    @Autowired
    PostRepository postRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping("/posts/{postId}/comments")
    public Page<Comment> getAllCommentsByPostId(@PathVariable Long postId, Pageable pageable) {
        return commentRepository.findByPostId(postId, pageable);
    }

    @PostMapping("posts/{postId}/comments")
    @PreAuthorize("hasRole('USER')")
    public Comment createComment(@CurrentUser UserPrincipal userPrincipal,
                                 @PathVariable (value = "postId") Long postId,
                                 @Valid @RequestBody Comment comment) {

        Optional<User> user = userRepository.findById(userPrincipal.getId());
        if(!user.isPresent())
            throw new ResourceNotFoundException("User", "id", userPrincipal.getId());

        return postRepository.findById(postId)
                .map(post -> {
                    comment.setPost(post);
                    comment.setUser(user.get());
                    return commentRepository.save(comment);
                }).orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));
    }

    @PutMapping("posts/{postId}/comments/{commentId}")
    @PreAuthorize("hasRole('USER')")
    public Comment updateComment(@CurrentUser UserPrincipal userPrincipal,
                                 @PathVariable (value = "postId") Long postId,
                                 @PathVariable (value = "commentId") Long commentId,
                                 @Valid @RequestBody Comment commentRequest) {

        Optional<User> user = userRepository.findById(userPrincipal.getId());
        if(!user.isPresent())
            throw new ResourceNotFoundException("User", "id", userPrincipal.getId());
        else if(!postRepository.existsById(postId))
            throw new ResourceNotFoundException("Post", "id", postId);

        return commentRepository.findById(commentId)
                .map(comment -> {
                    if(!userPrincipal.getId().equals(comment.getUser().getId()))
                        throw new ResourceNotFoundException("User", "id", userPrincipal.getId());
                    comment.setContent(commentRequest.getContent());
                    return commentRepository.save(comment);
                }).orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));
    }

    @DeleteMapping("posts/{postId}/comments/{commentId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deleteComment(@CurrentUser UserPrincipal userPrincipal,
                                           @PathVariable (value = "postId") Long postId,
                                           @PathVariable (value = "commentId") Long commentId) {

        Optional<User> user = userRepository.findById(userPrincipal.getId());
        if(!user.isPresent())
            throw new ResourceNotFoundException("User", "id", userPrincipal.getId());
        else if(!postRepository.existsById(postId))
            throw new ResourceNotFoundException("Post", "id", postId);

        return commentRepository.findByIdAndPostId(commentId, postId)
                .map(comment -> {
                    if(!userPrincipal.getId().equals(comment.getUser().getId()))
                        throw new ResourceNotFoundException("User", "id", userPrincipal.getId());
                    commentRepository.delete(comment);
                    return ResponseEntity.ok(String.format("Comment id %s deleted successfully", commentId));
                }).orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));
    }
}
