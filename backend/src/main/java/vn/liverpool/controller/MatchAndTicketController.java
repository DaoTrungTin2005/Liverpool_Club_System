package vn.liverpool.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.liverpool.util.ApiResponse;
import vn.liverpool.domain.dto.matches_and_tickets.CreateMatchAndTicketRequest;
import vn.liverpool.domain.dto.matches_and_tickets.CreateMatchAndTicketResponse;
import vn.liverpool.service.MatchAndTicketService;

@RestController
@RequestMapping("/api/matches-and-tickets")
@RequiredArgsConstructor
public class MatchAndTicketController {

    private final MatchAndTicketService matchAndTicketService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CreateMatchAndTicketResponse>> createMatchAndTickets(
            @RequestPart("data") @Valid CreateMatchAndTicketRequest dto,
            @RequestPart(value = "homeLogo", required = false) MultipartFile homeLogo,
            @RequestPart(value = "awayLogo", required = false) MultipartFile awayLogo) {

        CreateMatchAndTicketResponse response = matchAndTicketService.createMatchAndTickets(dto, homeLogo, awayLogo);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Match and ticket settings created successfully", response));
    }
}