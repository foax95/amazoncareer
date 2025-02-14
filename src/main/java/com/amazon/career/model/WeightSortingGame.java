package com.amazon.career.model;

import com.amazon.career.config.GameConfig;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

// WeightSortingGame.java
@Entity
public class WeightSortingGame {
    @Getter
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Setter
    private String userId;
    @Getter
    private int score;
    @Getter
    private int timeLeft;
    private boolean isPlaying;
    @Getter
    private int level;

    // Constructor
    public WeightSortingGame() {
        this.score = 0;
        this.timeLeft = GameConfig.GAME_DURATION;
        this.isPlaying = false;
        this.level = 1;
    }
    public void startGame() {
        this.isPlaying = true;
    }
    public void endGame() {
        this.isPlaying = false;
    }
    public void updateScore(int score) {
        this.score += score;
    }
    public void updateTimeLeft(int time) {
        this.timeLeft = time;
    }
    public void updateLevel(int level) {
        this.level = level;
    }
    public void resetGame() {
        this.score = 0;
        this.timeLeft = GameConfig.GAME_DURATION;
        this.isPlaying = false;
        this.level = 1;
    }
    public boolean isPlaying() {
        return isPlaying;
    }
    public void setPlaying(boolean playing) {
        isPlaying = playing;
    }

}
