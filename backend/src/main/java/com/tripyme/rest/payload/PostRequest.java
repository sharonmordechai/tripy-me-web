package com.tripyme.rest.payload;

import lombok.Data;

import javax.validation.constraints.NotBlank;


@Data
public class PostRequest {

    @NotBlank
    private String content;

    @NotBlank
    private String category;
}
