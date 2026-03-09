package com.fitness.aiservice.service;

import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityAiService {

    private final GroqService groqService;

    public Recommendation generateRecommendation(Activity activity) {
        String prompt = createPromptForActivity(activity);
        String aiResponse = groqService.getAnswer(prompt);
        log.info("RESPONSE FROM AI : {}", aiResponse);
        return processAiResponse(activity, aiResponse);
    }

    private Recommendation processAiResponse(Activity activity, String aiResponse) {
        try {
            String cleanJson = aiResponse
                    .replaceAll("```json", "")
                    .replaceAll("```", "")
                    .trim();

            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(cleanJson);

            // Parse analysis
            JsonNode analysisNode = rootNode.path("analysis");
            StringBuilder fullAnalysis = new StringBuilder();
            addAnalysisSection(fullAnalysis, analysisNode, "overall", "Overall");
            addAnalysisSection(fullAnalysis, analysisNode, "pace", "Pace");
            addAnalysisSection(fullAnalysis, analysisNode, "heartRate", "Heart Rate");
            addAnalysisSection(fullAnalysis, analysisNode, "caloriesBurned", "Calories Burned");

            // Parse improvements
            JsonNode improvementsNode = rootNode.path("improvements");
            List<String> improvements = extractImprovements(improvementsNode);

            // Parse suggestions
            JsonNode suggestionsNode = rootNode.path("suggestions");
            List<String> suggestions = extractSuggestions(suggestionsNode);

            // Parse safety
            JsonNode safetyNode = rootNode.path("safety");
            List<String> safetyGuidelines = extractSafety(safetyNode);

            log.info("Overall Analysis: {}", analysisNode.path("overall").asText());
            log.info("Improvements count: {}", improvements.size());
            log.info("Suggestions count: {}", suggestions.size());
            log.info("Safety points count: {}", safetyGuidelines.size());

            return Recommendation.builder()
                    .activityId(activity.getId())
                    .userId(activity.getUserId())
                    .activityType(activity.getType())
                    .analysisText(fullAnalysis.toString())
                    .improvements(improvements)
                    .suggestions(suggestions)
                    .safetyGuidelines(safetyGuidelines)
                    .createdAt(LocalDateTime.now())
                    .build();

        } catch (Exception e) {
            log.error("Failed to parse AI response: {}", e.getMessage());
            throw new RuntimeException("Failed to process AI response", e);
        }
    }

    private List<String> extractImprovements(JsonNode improvementsNode) {
        List<String> improvements = new ArrayList<>();
        if (improvementsNode.isArray()) {
            improvementsNode.forEach(improvement -> {
                String area = improvement.path("area").asText();
                String detail = improvement.path("recommendation").asText();
                improvements.add(String.format("%s: %s", area, detail));
            });
        }
        return improvements.isEmpty()
                ? Collections.singletonList("No specific improvements provided")
                : improvements;
    }

    private List<String> extractSuggestions(JsonNode suggestionsNode) {
        List<String> suggestions = new ArrayList<>();
        if (suggestionsNode.isArray()) {
            suggestionsNode.forEach(suggestion -> {
                String workout = suggestion.path("workout").asText();
                String description = suggestion.path("description").asText();
                suggestions.add(String.format("%s: %s", workout, description));
            });
        }
        return suggestions.isEmpty()
                ? Collections.singletonList("No specific suggestions provided")
                : suggestions;
    }

    private List<String> extractSafety(JsonNode safetyNode) {
        List<String> safety = new ArrayList<>();
        if (safetyNode.isArray()) {
            safetyNode.forEach(point -> safety.add(point.asText()));
        }
        return safety.isEmpty()
                ? Collections.singletonList("No specific safety guidelines provided")
                : safety;
    }

    private void addAnalysisSection(StringBuilder fullAnalysis, JsonNode analysisNode,
                                    String key, String prefix) {
        if (!analysisNode.path(key).isMissingNode()) {
            fullAnalysis.append("### ").append(prefix).append("\n")
                    .append(analysisNode.path(key).asText())
                    .append("\n\n");
        }
    }

    private String createPromptForActivity(Activity activity) {
        return String.format("""
                        You are an expert fitness coach and sports scientist with 20 years of experience.
                        Analyze the following fitness activity in great detail and respond with ONLY a valid JSON object.
                        Do NOT include any text, explanation, or markdown before or after the JSON.
                        Do NOT wrap it in ```json``` blocks.
                        
                        Activity Details:
                        - Activity Type: %s
                        - Duration: %d minutes
                        - Calories Burned: %d kcal
                        - Additional Metrics: %s
                        
                        Respond in this EXACT JSON format only, with detailed and thorough content in each field:
                        {
                            "analysis": {
                                "overall": "Write 3-4 sentences covering overall performance, effort level, and fitness impact",
                                "pace": "Write 3-4 sentences analyzing pace, speed consistency, and how it compares to fitness benchmarks",
                                "heartRate": "Write 3-4 sentences on heart rate zones, cardiovascular stress, and aerobic vs anaerobic effort",
                                "caloriesBurned": "Write 3-4 sentences on calorie burn quality, metabolic impact, and energy system used"
                            },
                            "improvements": [
                                {
                                    "area": "Area name e.g. Endurance",
                                    "recommendation": "Write 3-4 sentences with specific, actionable steps to improve this area with timeline and methods"
                                },
                                {
                                    "area": "Area name e.g. Speed",
                                    "recommendation": "Write 3-4 sentences with specific, actionable steps to improve this area with timeline and methods"
                                },
                                {
                                    "area": "Area name e.g. Recovery",
                                    "recommendation": "Write 3-4 sentences with specific, actionable steps to improve this area with timeline and methods"
                                }
                            ],
                            "suggestions": [
                                {
                                    "workout": "Workout name",
                                    "description": "Write 3-4 sentences explaining what the workout is, how to perform it, sets/reps/duration, and why it benefits this athlete"
                                },
                                {
                                    "workout": "Workout name",
                                    "description": "Write 3-4 sentences explaining what the workout is, how to perform it, sets/reps/duration, and why it benefits this athlete"
                                },
                                {
                                    "workout": "Workout name",
                                    "description": "Write 3-4 sentences explaining what the workout is, how to perform it, sets/reps/duration, and why it benefits this athlete"
                                }
                            ],
                            "safety": [
                                "Detailed safety point 1 with explanation of why it matters",
                                "Detailed safety point 2 with explanation of why it matters",
                                "Detailed safety point 3 with explanation of why it matters",
                                "Detailed safety point 4 with explanation of why it matters"
                            ]
                        }
                        
                        Be specific, detailed and personalized based on the actual activity metrics provided.
                        Each field must have meaningful, expert-level content — not generic advice.
                        """,
                activity.getType(),
                activity.getDuration(),
                activity.getCaloriesBurned(),
                activity.getAdditionalMetrics()
        );
    }
}
