// ScoreService.java
package com.amazon.career.service;

import com.amazon.career.model.GameState;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBQueryExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ScoreService {

    @Autowired
    private DynamoDBMapper dynamoDBMapper;

    public GameState saveScore(GameState gameState) {
        if (gameState.getUserId() == null) {
            gameState.setUserId(UUID.randomUUID().toString());
        }
        dynamoDBMapper.save(gameState);
        return gameState;
    }

    public List<GameState> getTopScores(int limit) {
        DynamoDBScanExpression scanExpression = new DynamoDBScanExpression();
        return dynamoDBMapper.scan(GameState.class, scanExpression).stream()
                .sorted((a, b) -> b.getScore().compareTo(a.getScore()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    public List<GameState> getScoresByEmail(String email) {
        Map<String, AttributeValue> eav = new HashMap<>();
        eav.put(":email", new AttributeValue().withS(email));

        DynamoDBQueryExpression<GameState> queryExpression = new DynamoDBQueryExpression<GameState>()
                .withKeyConditionExpression("email = :email")
                .withExpressionAttributeValues(eav);

        return dynamoDBMapper.query(GameState.class, queryExpression);
    }
    public List<GameState> getScoresByUserId(String userId) {
        Map<String, AttributeValue> eav = new HashMap<>();
        eav.put(":userId", new AttributeValue().withS(userId));

        DynamoDBQueryExpression<GameState> queryExpression = new DynamoDBQueryExpression<GameState>()
                .withKeyConditionExpression("userId = :userId")
                .withExpressionAttributeValues(eav);

        return dynamoDBMapper.query(GameState.class, queryExpression);
    }

    public List<GameState> getScoresByDate(String date) {
        Map<String, AttributeValue> eav = new HashMap<>();
        eav.put(":date", new AttributeValue().withS(date));

        DynamoDBQueryExpression<GameState> queryExpression = new DynamoDBQueryExpression<GameState>()
                .withKeyConditionExpression("date = :date")
                .withExpressionAttributeValues(eav);

        return dynamoDBMapper.query(GameState.class, queryExpression);
    }
    //Get all scores
    public List<GameState> getAllScores() {
        return dynamoDBMapper.scan(GameState.class, new DynamoDBScanExpression());
    }
}
