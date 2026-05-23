package com.example.AIPlanner.Clients;

import com.example.AIPlanner.Abstracts.Clients.AiPlanClient;
import com.example.AIPlanner.Configs.AiProperties;
import com.example.AIPlanner.DTOs.Responses.AI.AiGeneratedPlanResponse;
import com.example.AIPlanner.Entities.Goal;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Component
@ConditionalOnProperty(name = "ai.provider", havingValue = "gemini")
public class GeminiAiPlanClient implements AiPlanClient {

    private final RestClient restClient;
    private final AiProperties aiProperties;
    private final ObjectMapper objectMapper;

    public GeminiAiPlanClient(
            RestClient.Builder restClientBuilder,
            AiProperties aiProperties,
            ObjectMapper objectMapper
    ) {
        this.aiProperties = aiProperties;
        this.objectMapper = objectMapper;
        this.restClient = restClientBuilder
                .baseUrl(aiProperties.getGemini().getBaseUrl())
                .build();
    }

    @Override
    public AiGeneratedPlanResponse generatePlan(Goal goal) {
        validateConfig();

        String prompt = buildPrompt(goal);

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of(
                                "role", "user",
                                "parts", List.of(
                                        Map.of("text", prompt)
                                )
                        )
                ),
                "generationConfig", Map.of(
                        "temperature", 0.3,
                        "responseMimeType", "application/json"
                )
        );

        GeminiGenerateContentResponse response = restClient.post()
                .uri("/v1beta/models/{model}:generateContent", aiProperties.getGemini().getModel())
                .header("x-goog-api-key", aiProperties.getGemini().getApiKey())
                .body(requestBody)
                .retrieve()
                .body(GeminiGenerateContentResponse.class);

        String json = extractText(response);

        return parseAiPlan(json);
    }

    private void validateConfig() {
        String apiKey = aiProperties.getGemini().getApiKey();

        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("Gemini API key is missing. Set GEMINI_API_KEY environment variable.");
        }
    }

    private String buildPrompt(Goal goal) {
        return """
                You are an AI planning assistant.

                Generate a structured study/action plan for this goal.

                Goal:
                Title: %s
                Description: %s
                Start date: %s
                Duration days: %d
                Daily available minutes: %d

                Strict rules:
                - Return ONLY valid JSON.
                - Do not wrap the JSON in markdown.
                - Do not add explanations outside JSON.
                - The number of days must be exactly %d.
                - dayNumber must start from 1 and increase by 1.
                - date must start from the start date and increase by 1 day.
                - Every non-rest day must contain 2 or 3 tasks.
                - Total estimatedMinutes per day must not exceed daily available minutes.
                - Use clear and practical task titles.
                - Do not include vague tasks like "study more".
                - restDay should be false for now.

                Required JSON shape:
                {
                  "title": "string",
                  "description": "string",
                  "days": [
                    {
                      "dayNumber": 1,
                      "date": "YYYY-MM-DD",
                      "title": "string",
                      "description": "string",
                      "restDay": false,
                      "tasks": [
                        {
                          "title": "string",
                          "description": "string",
                          "estimatedMinutes": 30,
                          "orderIndex": 1
                        }
                      ]
                    }
                  ]
                }
                """.formatted(
                goal.getTitle(),
                goal.getDescription() == null ? "" : goal.getDescription(),
                goal.getStartDate(),
                goal.getDurationDays(),
                goal.getDailyAvailableMinutes(),
                goal.getDurationDays()
        );
    }

    private String extractText(GeminiGenerateContentResponse response) {
        if (response == null
                || response.candidates() == null
                || response.candidates().isEmpty()
                || response.candidates().get(0).content() == null
                || response.candidates().get(0).content().parts() == null
                || response.candidates().get(0).content().parts().isEmpty()) {
            throw new IllegalArgumentException("Gemini response is empty");
        }

        String text = response.candidates().get(0).content().parts().get(0).text();

        if (text == null || text.isBlank()) {
            throw new IllegalArgumentException("Gemini response text is empty");
        }

        return text;
    }

    private AiGeneratedPlanResponse parseAiPlan(String json) {
        try {
            return objectMapper.readValue(json, AiGeneratedPlanResponse.class);
        } catch (Exception ex) {
            throw new IllegalArgumentException("Failed to parse Gemini plan JSON: " + ex.getMessage());
        }
    }

    private record GeminiGenerateContentResponse(
            List<GeminiCandidate> candidates
    ) {
    }

    private record GeminiCandidate(
            GeminiContent content
    ) {
    }

    private record GeminiContent(
            List<GeminiPart> parts
    ) {
    }

    private record GeminiPart(
            String text
    ) {
    }
}