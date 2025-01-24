package com.quolance.quolance_api.entities;

import com.quolance.quolance_api.dtos.CreateAdminRequestDto;
import com.quolance.quolance_api.dtos.CreateUserRequestDto;
import com.quolance.quolance_api.dtos.UpdateUserRequestDto;
import com.quolance.quolance_api.entities.blog.BlogPost;
import com.quolance.quolance_api.entities.enums.Role;
import com.quolance.quolance_api.util.ApplicationContextProvider;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

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

    @Getter
    @Column(unique = true, length = 50, nullable = false)
    private String username;

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

    @Setter
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private VerificationCode verificationCode;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    private List<UserConnectedAccount> connectedAccounts = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BlogPost> blogPosts;


    /**
     * Constructor to create a User from a CreateUserRequestDto.
     */
    public User(CreateUserRequestDto data) {
        PasswordEncoder passwordEncoder = ApplicationContextProvider.bean(PasswordEncoder.class);
        this.email = data.getEmail();
        this.username = data.getUsername();
        this.password = passwordEncoder.encode(data.getPassword());
        this.firstName = data.getFirstName();
        this.lastName = data.getLastName();
        this.role = Role.valueOf(data.getRole());

        if (this.role == Role.FREELANCER) {
            Profile profile = new Profile();
            profile.setContactEmail(this.email);
            profile.setBio(this.firstName + " " + this.lastName + " bio.");
            this.profile = profile;
            profile.setUser(this);
        }
    }

    /**
     * Constructor to create an Admin User from a CreateAdminRequestDto.
     */
    public User(CreateAdminRequestDto data) {
        PasswordEncoder passwordEncoder = ApplicationContextProvider.bean(PasswordEncoder.class);
        this.email = data.getEmail();
        this.username = data.getUsername();
        this.password = passwordEncoder.encode(data.getTemporaryPassword());
        this.firstName = data.getFirstName();
        this.lastName = data.getLastName();
        this.role = Role.ADMIN;
    }


    /**
     * Constructor to create a User from an OAuth2User (e.g., social login).
     */
    public User(OAuth2User oAuth2User) {
        this.email = oAuth2User.getAttribute("email");
        this.username = oAuth2User.getAttribute("email"); // Use email as username
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
        this.role = Role.PENDING;
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
    public void updateUserInfo(UpdateUserRequestDto request) {
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

    public String getUserEmail() {
        return email;
    }

    // User account status methods
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
