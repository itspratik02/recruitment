package com.example.Employee_recruitment_system;

import com.example.Employee_recruitment_system.model.ApprovalStatus;
import com.example.Employee_recruitment_system.model.User;
import com.example.Employee_recruitment_system.model.UserRole;
import com.example.Employee_recruitment_system.repository.UserRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class EmployeeRecruitmentSystemApplication extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(EmployeeRecruitmentSystemApplication.class, args);
	}

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
		return builder.sources(EmployeeRecruitmentSystemApplication.class);
	}

	@Bean
	public BCryptPasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public CommandLineRunner initAdminUser(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
		return args -> {
			if (userRepository.findByEmail("admin@example.com").isEmpty()) {
				User admin = new User();
				admin.setName("Admin");
				admin.setEmail("admin@example.com");
				admin.setPassword(passwordEncoder.encode("admin123"));
				admin.setUserType(UserRole.ADMIN);
				admin.setIsApproved(ApprovalStatus.APPROVED);
				userRepository.save(admin);
			}
		};
	}
}
