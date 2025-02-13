package com.amazon.career.controller;

import com.amazon.career.model.GameState;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game")
@CrossOrigin(origins = "*")
public class GameController {

    @Autowired
    private DynamoDBMapper dynamoDBMapper;

    @PostMapping("/save")
    public ResponseEntity<GameState> saveGame(@RequestBody GameState gameState) {
        dynamoDBMapper.save(gameState);
        return ResponseEntity.ok(gameState);
    }

    @GetMapping("/{userId}/{email}")
    public ResponseEntity<GameState> getGame(@PathVariable String userId, @PathVariable String email) {
        GameState gameState = dynamoDBMapper.load(GameState.class, userId, email);
        if (gameState != null) {
            return ResponseEntity.ok(gameState);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/update/score")
    public ResponseEntity<GameState> updateScore(@RequestBody GameState gameState) {
        GameState existing = dynamoDBMapper.load(GameState.class, gameState.getUserId(), gameState.getEmail());
        if (existing != null) {
            existing.setScore(gameState.getScore());
            dynamoDBMapper.save(existing);
            return ResponseEntity.ok(existing);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/update/progress")
    public ResponseEntity<GameState> updateProgress(@RequestBody GameState gameState) {
        GameState existing = dynamoDBMapper.load(GameState.class, gameState.getUserId(), gameState.getEmail());
        if (existing != null) {
            existing.setProgress(gameState.getProgress());
            dynamoDBMapper.save(existing);
            return ResponseEntity.ok(existing);
        }
        return ResponseEntity.notFound().build();
    }
}
