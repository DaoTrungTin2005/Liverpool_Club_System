package vn.liverpool.liverpool_club_system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = "vn.liverpool") // Scan tất cả packages
@EntityScan(basePackages = "vn.liverpool.domain")
@EnableJpaRepositories(basePackages = "vn.liverpool.repository")
public class LiverpoolClubSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(LiverpoolClubSystemApplication.class, args);
    }
}