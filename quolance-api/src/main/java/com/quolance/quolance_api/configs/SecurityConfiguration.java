package com.quolance.quolance_api.configs;

import com.quolance.quolance_api.services.auth.impl.OAuth2LoginSuccessHandlerImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2LoginAuthenticationProvider;
import org.springframework.security.oauth2.client.endpoint.DefaultAuthorizationCodeTokenResponseClient;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.security.web.csrf.CsrfTokenRequestHandler;
import org.springframework.security.web.csrf.XorCsrfTokenRequestAttributeHandler;
import org.springframework.util.StringUtils;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.function.Supplier;

import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private static final String[] WHITE_LIST_URL = {
            "/api/auth/**",
            "http://localhost:8080/api/**",
            "http://localhost:8080/api/users/**",
            "/v2/api-docs",
            "/v3/api-docs",
            "/v3/api-docs/**",
            "/swagger-resources",
            "/swagger-resources/**",
            "/configuration/ui",
            "/configuration/security",
            "/swagger-ui/**",
            "/webjars/**",
            "/swagger-ui.html",
            "api/enums/**",
    };

    private final CustomUserDetailsService userDetailsService;
    private final OAuth2LoginSuccessHandlerImpl oauth2LoginSuccessHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        AuthenticationManager authenticationManager = authenticationManager(oauth2LoginAuthenticationProvider());

        http.authorizeHttpRequests(customizer ->
                        customizer
                                .requestMatchers(antMatcher(HttpMethod.GET, "/ws/**")).permitAll() // Allow WebSocket handshake
                                .requestMatchers(WHITE_LIST_URL).permitAll()
                                .requestMatchers(antMatcher(HttpMethod.POST, "/api/users")).permitAll()
                                .requestMatchers(antMatcher(HttpMethod.POST, "/api/users/verify-email")).permitAll()
                                .requestMatchers(antMatcher(HttpMethod.POST, "/api/users/forgot-password/**")).permitAll()
                                .requestMatchers(antMatcher(HttpMethod.PATCH, "/api/users/reset-forgotten-password/**")).permitAll()
                                .requestMatchers(antMatcher(HttpMethod.PATCH, "/api/users/reset-password")).permitAll()
                                .requestMatchers(antMatcher(HttpMethod.POST, "/api/users/admin")).hasRole("ADMIN")
                                .requestMatchers(antMatcher(HttpMethod.POST, "/api/auth/login")).permitAll()
                                .requestMatchers(antMatcher(HttpMethod.GET, "/api/auth/csrf")).permitAll()
                                .requestMatchers(antMatcher(HttpMethod.GET, "/api/public/**")).permitAll()
                                .requestMatchers(antMatcher("/api/client/**")).hasRole("CLIENT")
                                .requestMatchers(antMatcher("/api/freelancer/**")).hasRole("FREELANCER")
                                .requestMatchers(antMatcher("api/pending/**")).hasRole("PENDING")
                                .requestMatchers(antMatcher("/api/admin/**")).hasRole("ADMIN")
                                .anyRequest().authenticated()
                )
                .exceptionHandling(exceptionHandling -> exceptionHandling
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            String path = request.getRequestURI();
                            if (path.startsWith("/api/admin")) {
                                response.sendError(HttpServletResponse.SC_FORBIDDEN, "User is not an Admin");
                            } else if (path.startsWith("/api/client")) {
                                response.sendError(HttpServletResponse.SC_FORBIDDEN, "User is not a Client");
                            } else if (path.startsWith("/api/freelancer")) {
                                response.sendError(HttpServletResponse.SC_FORBIDDEN, "User is not a Freelancer");
                            } else {
                                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Insufficient permissions");
                            }
                        })
                        .authenticationEntryPoint((request, response, authException) ->
                                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized, please login"))
                );

        http.oauth2Login(customizer ->
                customizer.successHandler(oauth2LoginSuccessHandler)
                        .failureHandler((request, response, exception) -> {
                            System.out.println("OAuth2 authentication failure: " + exception.getMessage());
                            exception.printStackTrace();
                            response.sendRedirect("/login?error");
                        })
        );

        http.userDetailsService(userDetailsService)
                .authenticationManager(authenticationManager);

        http.csrf(csrf -> csrf.disable());

        http.cors(customizer ->
                customizer.configurationSource(corsConfigurationSource())
        );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:8080",
                "http://localhost:3000",
                "http://localhost:5173",
                "https://quolance.com",
                "https://www.quolance.com"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Access-Control-Allow-Headers", "X-Requested-With"));
        configuration.setExposedHeaders(Collections.singletonList("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // Updated AuthenticationManager bean including OAuth2 provider
    @Bean
    public AuthenticationManager authenticationManager(OAuth2LoginAuthenticationProvider oauth2LoginAuthenticationProvider) {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setUserDetailsService(userDetailsService);
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
        return new ProviderManager(Arrays.asList(daoAuthenticationProvider, oauth2LoginAuthenticationProvider));
    }

    // Define the OAuth2LoginAuthenticationProvider bean
    @Bean
    public OAuth2LoginAuthenticationProvider oauth2LoginAuthenticationProvider() {
        // Create the token response client (handles the code exchange)
        DefaultAuthorizationCodeTokenResponseClient tokenResponseClient = new DefaultAuthorizationCodeTokenResponseClient();
        // Create the user service (fetches user details from the provider)
        OAuth2UserService<OAuth2UserRequest, OAuth2User> oauth2UserService = new DefaultOAuth2UserService();
        // Pass both to the OAuth2LoginAuthenticationProvider constructor
        return new OAuth2LoginAuthenticationProvider(tokenResponseClient, oauth2UserService);
    }

    final class SpaCsrfTokenRequestHandler extends CsrfTokenRequestAttributeHandler {
        private final CsrfTokenRequestHandler delegate = new XorCsrfTokenRequestAttributeHandler();

        @Override
        public void handle(HttpServletRequest request, HttpServletResponse response, Supplier<CsrfToken> csrfToken) {
            /*
             * Always use XorCsrfTokenRequestAttributeHandler to provide BREACH protection of
             * the CsrfToken when it is rendered in the response body.
             */
            this.delegate.handle(request, response, csrfToken);
        }

        @Override
        public String resolveCsrfTokenValue(HttpServletRequest request, CsrfToken csrfToken) {
            /*
             * If the request contains a request header, use CsrfTokenRequestAttributeHandler
             * to resolve the CsrfToken. This applies when a single-page application includes
             * the header value automatically, which was obtained via a cookie containing the
             * raw CsrfToken.
             */
            if (StringUtils.hasText(request.getHeader(csrfToken.getHeaderName()))) {
                return super.resolveCsrfTokenValue(request, csrfToken);
            }
            /*
             * In all other cases (e.g. if the request contains a request parameter), use
             * XorCsrfTokenRequestAttributeHandler to resolve the CsrfToken. This applies
             * when a server-side rendered form includes the _csrf request parameter as a
             * hidden input.
             */
            return this.delegate.resolveCsrfTokenValue(request, csrfToken);
        }
    }

    final class CsrfCookieFilter extends OncePerRequestFilter {

        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
                throws ServletException, IOException {
            CsrfToken csrfToken = (CsrfToken) request.getAttribute("_csrf");
            // Render the token value to a cookie by causing the deferred token to be loaded
            csrfToken.getToken();

            filterChain.doFilter(request, response);
        }
    }
}
