package com.tripyme.rest.payload;

import lombok.Data;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

@Data
public class AuthResponse {

    private String accessToken;
    private String tokenType = "Bearer";
    private String email;
    private Collection<? extends GrantedAuthority> authorities;

    public AuthResponse(String accessToken, String email, Collection<? extends GrantedAuthority> authorities) {
        this.accessToken = accessToken;
        this.email = email;
        this.authorities = authorities;
    }
}
