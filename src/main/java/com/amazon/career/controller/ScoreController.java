// ScoreController.java
package com.amazon.career.controller;

import com.amazon.career.model.GameState;
import com.amazon.career.service.ScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scores")
@CrossOrigin(origins = "*")
public class ScoreController {

    @Autowired
    private ScoreService scoreService;

    @PostMapping("/add")
    public ResponseEntity<GameState> addScore(@RequestBody GameState gameState) {
        return ResponseEntity.ok(scoreService.saveScore(gameState));
    }

    @GetMapping("/top")
    public ResponseEntity<List<GameState>> getTopScores(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(scoreService.getTopScores(limit));
    }

    @GetMapping("/player/{email}")
    public ResponseEntity<List<GameState>> getPlayerScores(@PathVariable String email) {
        return ResponseEntity.ok(scoreService.getScoresByEmail(email));
    }
    @GetMapping("/all")
    public ResponseEntity<List<GameState>> getAllScores() {
        return ResponseEntity.ok(scoreService.getAllScores());
    }
    @GetMapping("/date/{date}")
    public ResponseEntity<List<GameState>> getScoresByDate(@PathVariable String date) {
        return ResponseEntity.ok(scoreService.getScoresByDate(date));
    }

}
