package vn.liverpool.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.liverpool.domain.dto.dropdown.DropdownPlayerRequest;
import vn.liverpool.repository.PositionRepository;
import vn.liverpool.repository.TournamentRepository;
import vn.liverpool.util.ApiResponse;

import java.util.List;

@RestController
@RequestMapping("/api/dropdowns")
@RequiredArgsConstructor
public class DropdownController {

    private final PositionRepository positionRepository;
    private final TournamentRepository tournamentRepository;

    @GetMapping("/positions")
    public ResponseEntity<ApiResponse<List<DropdownPlayerRequest>>> getPositions() {
        List<DropdownPlayerRequest> positions = positionRepository.findAll()
            .stream()
            .map(p -> new DropdownPlayerRequest(p.getId(), p.getName()))
            .toList();
        return ResponseEntity.ok(ApiResponse.success("Positions retrieved successfully", positions));
    }

    @GetMapping("/tournaments")
    public ResponseEntity<ApiResponse<List<DropdownPlayerRequest>>> getTournaments() {
        List<DropdownPlayerRequest> tournaments = tournamentRepository.findAll()
            .stream()
            .map(t -> new DropdownPlayerRequest(t.getId(), t.getName()))
            .toList();
        return ResponseEntity.ok(ApiResponse.success("Tournaments retrieved successfully", tournaments));
    }
}
