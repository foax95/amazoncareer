package com.amazon.career.model;

import com.amazonaws.services.dynamodbv2.datamodeling.*;
import lombok.Data;

@Data
@DynamoDBTable(tableName = "GameStates")
public class GameState {

    @DynamoDBHashKey
    private String userId;

    @DynamoDBAttribute
    private String email;

    @DynamoDBAttribute
    private String name;

    @DynamoDBAttribute
    private Integer score;

    @DynamoDBAttribute
    private String date;

    // Basic getters and setters
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
}
