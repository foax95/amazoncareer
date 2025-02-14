package com.amazon.career.config;

import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class GameConfig {
    public static final int GAME_DURATION = 180; // 3 minutes
    public static final Map<String, WeightRange> WEIGHT_RANGES = Map.of(
            "individual", new WeightRange(1, 49),
            "team", new WeightRange(50, 75),
            "mechanical", new WeightRange(76, 150)
    );

    public static class WeightRange {
        private final int min;
        private final int max;

        public WeightRange(int min, int max) {
            this.min = min;
            this.max = max;
        }
    }
}
