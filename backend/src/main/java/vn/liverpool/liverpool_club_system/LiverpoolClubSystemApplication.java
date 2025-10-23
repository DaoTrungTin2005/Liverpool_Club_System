package vn.liverpool.liverpool_club_system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = "vn.liverpool.domain")
public class LiverpoolClubSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(LiverpoolClubSystemApplication.class, args);
	}

}
