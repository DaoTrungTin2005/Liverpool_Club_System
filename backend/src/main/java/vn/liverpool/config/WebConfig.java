package vn.liverpool.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // cấu hình có thể truy cập ảnh qua URL
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Cho phép truy cập folder uploads/players qua URL
        registry.addResourceHandler("/uploads/players/**")
                .addResourceLocations("file:" + System.getProperty("user.dir") + "/uploads/players/");
    }
}
