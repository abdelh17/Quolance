package com.quolance.quolance_api.entities;

import com.quolance.quolance_api.dtos.CreateUserRequestDto;
import com.quolance.quolance_api.dtos.UpdateUserRequestDto;
import com.quolance.quolance_api.util.ApplicationContextProvider;
import com.quolance.quolance_api.entities.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.security.core.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.*;

@Entity
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "users")
public class User extends AbstractEntity implements UserDetails {

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(unique = true, length = 100, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column
    private String profileImageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "varchar(255)")
    private Role role;

    @Setter
    @Column(nullable = false)
    private boolean verified = false;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "profileId")
    private Profile profile;

    @OneToOne
    @JoinColumn(name = "portfolioId")
    private Portfolio portfolio;

    @Setter
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private VerificationCode verificationCode;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    private List<UserConnectedAccount> connectedAccounts = new ArrayList<>();

    /**
     * Constructor to create a User from a CreateUserRequestDto.
     */
    public User(CreateUserRequestDto data) {
        PasswordEncoder passwordEncoder = ApplicationContextProvider.bean(PasswordEncoder.class);
        this.email = data.getEmail();
        this.password = passwordEncoder.encode(data.getPassword());
        this.firstName = data.getFirstName();
        this.lastName = data.getLastName();
        this.role = Role.CLIENT;
    }

    /**
     * Constructor to create a User from an OAuth2User (e.g., social login).
     */
    public User(OAuth2User oAuth2User) {
        this.email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        if (name != null) {
            String[] names = name.split(" ");
            if (names.length > 1) {
                this.firstName = names[0];
                this.lastName = names[1];
            } else {
                this.firstName = names[0];
            }
        }
        this.verified = true;
        this.role = Role.CLIENT;
    }

    /**
     * Adds a connected account to the user.
     */
    public void addConnectedAccount(UserConnectedAccount connectedAccount) {
        connectedAccounts.add(connectedAccount);
    }

    /**
     * Updates the user's first name and last name.
     */
    public void update(UpdateUserRequestDto request) {
        this.firstName = request.getFirstName();
        this.lastName = request.getLastName();
    }

    /**
     * Updates the user's password.
     */
    public void updatePassword(String newPassword) {
        PasswordEncoder passwordEncoder = ApplicationContextProvider.bean(PasswordEncoder.class);
        this.password = passwordEncoder.encode(newPassword);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role.name());
        return Collections.singletonList(authority);
    }

    @Override
    public String getUsername() {
        return email;
    }

    // User account status methods
    @Override
    public boolean isAccountNonExpired() {
        return true; // Add custom logic if needed
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Add custom logic if needed
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Add custom logic if needed
    }

    @Override
    public boolean isEnabled() {
        return true; // Change to 'return verified;' if email verification required
    }
}
