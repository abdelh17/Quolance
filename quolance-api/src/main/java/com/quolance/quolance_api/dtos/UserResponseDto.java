package com.quolance.quolance_api.dtos;

import com.quolance.quolance_api.entities.User;
import com.quolance.quolance_api.entities.enums.Role;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Data
@Getter
@Setter
public class UserResponseDto {

    private Long id;
    private Role role;
    private String firstName;
    private String lastName;
    private String email;
    private String username;
    private String profileImageUrl;
    private Boolean verified;
    private List<ConnectedAccountResponse> connectedAccounts = new ArrayList<>();
    private List<String> authorities = new ArrayList<>();

    public UserResponseDto(User user) {
        this.id = user.getId();
        this.role = user.getRole();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.email = user.getEmail();
        this.username = user.getUsername();
        this.verified = user.isVerified();
        this.profileImageUrl = user.getProfileImageUrl();
        user.getConnectedAccounts().forEach(provider ->
                this.connectedAccounts.add(new ConnectedAccountResponse(provider.getProvider(), provider.getConnectedAt()))
        );
    }

    public UserResponseDto(User user, Collection<? extends GrantedAuthority> authorities) {
        this.id = user.getId();
        this.role = user.getRole();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.email = user.getEmail();
        this.username = user.getUsername();
        this.verified = user.isVerified();
        this.profileImageUrl = user.getProfileImageUrl();
        user.getConnectedAccounts().forEach(provider ->
                this.connectedAccounts.add(new ConnectedAccountResponse(provider.getProvider(), provider.getConnectedAt()))
        );
        authorities.forEach(authority ->
                this.authorities.add(authority.getAuthority())
        );
    }

    public record ConnectedAccountResponse(String provider, LocalDateTime connectedAt) {
    }
}
