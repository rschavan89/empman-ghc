package com.empman.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;

/**
 * Web MVC Configuration
 * Configures Spring MVC behavior for routing and path matching
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        // Allow URLs with and without trailing slashes to match the same controller method
        configurer.setUseTrailingSlashMatch(true);
    }
}
