package com.amazon.career.model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBRangeKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@DynamoDBTable(tableName = "GameStates")
public class GameState {
    @DynamoDBHashKey
    private String userId;

    @DynamoDBRangeKey
    private String email;

    @DynamoDBAttribute
    private String name;

    @DynamoDBAttribute
    private Integer score;

    @DynamoDBAttribute
    private String date;

    @DynamoDBAttribute
    private Map<String, Integer> progress;

    @DynamoDBAttribute
    private List<String> completedSections;

    @DynamoDBAttribute
    private List<String> achievements;

    // Constructor
    public GameState() {
    }

    // Getters and Setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Map<String, Integer> getProgress() {
        return progress;
    }

    public void setProgress(Map<String, Integer> progress) {
        this.progress = progress;
    }

    public List<String> getCompletedSections() {
        return completedSections;
    }

    public void setCompletedSections(List<String> completedSections) {
        this.completedSections = completedSections;
    }

    public List<String> getAchievements() {
        return achievements;
    }

    public void setAchievements(List<String> achievements) {
        this.achievements = achievements;
    }

    // toString method for debugging
    @Override
    public String toString() {
        return "GameState{" +
                "userId='" + userId + '\'' +
                ", email='" + email + '\'' +
                ", name='" + name + '\'' +
                ", score=" + score +
                ", date='" + date + '\'' +
                ", progress=" + progress +
                ", completedSections=" + completedSections +
                ", achievements=" + achievements +
                '}';
    }
}
