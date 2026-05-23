package com.example.AIPlanner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import com.example.AIPlanner.Configs.AiProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(AiProperties.class)
public class AiPlannerApplication {
	public static void main(String[] args) {
		SpringApplication.run(AiPlannerApplication.class, args);
	}
}
