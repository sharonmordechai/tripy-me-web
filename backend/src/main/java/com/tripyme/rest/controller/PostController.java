package com.tripyme.rest.controller;

import com.tripyme.rest.exception.ResourceNotFoundException;
import com.tripyme.rest.model.*;
import com.tripyme.rest.payload.PostRequest;
import com.tripyme.rest.repository.CategoryRepository;
import com.tripyme.rest.repository.CountryRepository;
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
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
public class PostController {

    @Autowired
    PostRepository postRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    CountryRepository countryRepository;

    @GetMapping("/{countryId}/posts")
    public List<Post> getAllPosts(@PathVariable (value = "countryId") Long countryId,
                                  Pageable pageable) {
        validateCountryId(countryId);
        return postRepository.findAll().stream()
                .filter(post -> post.getCountry().getId().equals(countryId))
                .collect(Collectors.toList());
    }

    @GetMapping("{countryId}/posts/{postId}")
    @PreAuthorize("hasRole('USER')")
    public Post getPost(@PathVariable (value = "countryId") Long countryId,
                        @PathVariable (value = "postId") Long postId) {
        validateCountryId(countryId);
        return postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));
    }

    @PostMapping("/{countryId}/posts")
    @PreAuthorize("hasRole('USER')")
    public Post createPost(@CurrentUser UserPrincipal userPrincipal,
                           @PathVariable (value = "countryId") Long countryId,
                           @Valid @RequestBody PostRequest postRequest) {
        validateCountryId(countryId);
        Optional<User> user = userRepository.findById(userPrincipal.getId());
        if(!user.isPresent())
            throw new ResourceNotFoundException("User", "id", userPrincipal.getId());

        Post post = new Post();
        post.setContent(postRequest.getContent());
        Category category = getCategory(postRequest.getCategory());
        post.setCategory(category);
        post.setUser(user.get());
        Country country = countryRepository.findById(countryId).get();
        post.setCountry(country);
        return postRepository.save(post);
    }

    @PutMapping("/{countryId}/posts/{postId}")
    @PreAuthorize("hasRole('USER')")
    public Post updatePost(@CurrentUser UserPrincipal userPrincipal,
                           @PathVariable (value = "countryId") Long countryId,
                           @PathVariable (value = "postId") Long postId,
                           @Valid @RequestBody Post postRequest) {
        validateCountryId(countryId);
        validateUserObject(userPrincipal.getId(), postId);
        return postRepository.findById(postId)
                .map(post -> {
                    post.setCategory(postRequest.getCategory());
                    post.setContent(postRequest.getContent());
                    return postRepository.save(post);
                }).orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));
    }

    @DeleteMapping("/{countryId}/posts/{postId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deletePost(@CurrentUser UserPrincipal userPrincipal,
                                        @PathVariable (value = "countryId") Long countryId,
                                        @PathVariable (value = "postId") Long postId) {
        validateCountryId(countryId);
        validateUserObject(userPrincipal.getId(), postId);
        return postRepository.findById(postId)
                .map(post -> {
                    postRepository.delete(post);
                    return ResponseEntity.ok(String.format("Post id %s deleted successfully", postId));
                }).orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));
    }

    private void validateUserObject(Long userId, Long postId) {
        Optional<User> user = userRepository.findById(userId);
        Optional<Post> updatedPost = postRepository.findById(postId);

        if(!updatedPost.isPresent())
            throw new ResourceNotFoundException("Post", "id", postId);
        else if(!user.isPresent())
            throw new ResourceNotFoundException("User", "id", userId);
        else if(!userId.equals(updatedPost.get().getUser().getId()))
            throw new ResourceNotFoundException("User", "id", userId);

    }

    private void validateCountryId(Long countryId) {
        if(!countryRepository.existsById(countryId))
            throw new ResourceNotFoundException("Country", "id", countryId);
    }

    private Category getCategory(String category) {
        switch(category){
            case "flights":
                Category flightCategory = categoryRepository.findByName(CategoryName.FLIGHTS)
                        .orElseThrow(() -> new RuntimeException("Fail -> Cause: Category name was not found"));
                return flightCategory;
            case "accommodation":
                Category accommodationCategory = categoryRepository.findByName(CategoryName.ACCOMMODATION)
                        .orElseThrow(() -> new RuntimeException("Fail -> Cause: Category name was not found"));
                return accommodationCategory;
            case "restaurants":
                Category restaurantsCategory = categoryRepository.findByName(CategoryName.RESTAURANTS)
                        .orElseThrow(() -> new RuntimeException("Fail -> Cause: Category name was not found"));
                return restaurantsCategory;
            case "trips":
                Category tripsCategory = categoryRepository.findByName(CategoryName.TRIPS)
                        .orElseThrow(() -> new RuntimeException("Fail -> Cause: Category name was not found"));
                return tripsCategory;
            case "social":
                Category socialCategory = categoryRepository.findByName(CategoryName.SOCIAL)
                        .orElseThrow(() -> new RuntimeException("Fail -> Cause: Category name was not found"));
                return socialCategory;
            case "nightlife":
                Category nightlifeCategory = categoryRepository.findByName(CategoryName.NIGHTLIFE)
                        .orElseThrow(() -> new RuntimeException("Fail -> Cause: Category name was not found"));
                return nightlifeCategory;
            default:
                Category defaultCategory = categoryRepository.findByName(CategoryName.SOCIAL)
                        .orElseThrow(() -> new RuntimeException("Fail -> Cause: Category name was not found"));
                return defaultCategory;
        }
    }
}
