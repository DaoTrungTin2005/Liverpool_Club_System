package vn.liverpool.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.http.MediaType; // ĐÚNG
import vn.liverpool.util.ApiResponse;
import vn.liverpool.domain.dto.matches_and_tickets.CreateMatchAndTicketRequest;
import vn.liverpool.domain.dto.matches_and_tickets.HomeMatchesGroupedResponse;
import vn.liverpool.domain.dto.matches_and_tickets.ListTicketResponse;
import vn.liverpool.domain.dto.matches_and_tickets.MatchAndTicketResponse;
import vn.liverpool.domain.dto.matches_and_tickets.MatchHeaderResponse;
import vn.liverpool.domain.dto.matches_and_tickets.StadiumSectionResponse;
import vn.liverpool.domain.dto.matches_and_tickets.UpdateTicketRequest;
import vn.liverpool.domain.dto.matches_and_tickets.ViewMatchAndTicketResponse;
import vn.liverpool.domain.dto.matches_and_tickets.MatchAndTicketResponse;
import vn.liverpool.service.MatchAndTicketService;

@RestController
@RequestMapping("/api/matches-and-tickets")
@RequiredArgsConstructor
public class MatchAndTicketController {

    private final MatchAndTicketService matchAndTicketService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<MatchAndTicketResponse>> createMatchAndTickets(
            @RequestPart("data") @Valid CreateMatchAndTicketRequest dto,
            @RequestPart(value = "homeLogo", required = false) MultipartFile homeLogo,
            @RequestPart(value = "awayLogo", required = false) MultipartFile awayLogo,
            @RequestPart(value = "matchImage", required = false) MultipartFile matchImage) {

        MatchAndTicketResponse response = matchAndTicketService.createMatchAndTickets(dto, homeLogo, awayLogo,
                matchImage);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Match and ticket settings created successfully", response));
    }

    @GetMapping("/list/matches_and_tickets")
    public ResponseEntity<ApiResponse<?>> getAllMatchesWithTickets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "matchDate") String sort,
            @RequestParam(defaultValue = "") String search) {

        var matches = matchAndTicketService.getAllMatches(page, size, sort, search);
        return ResponseEntity.ok(ApiResponse.success("Fetched matches successfully", matches));
    }

    @PutMapping(value = "/update/match/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<MatchAndTicketResponse>> updateMatchAndTickets(
            @PathVariable Long id,
            @RequestPart("data") @Valid CreateMatchAndTicketRequest dto,
            @RequestPart(value = "homeLogo", required = false) MultipartFile homeLogo,
            @RequestPart(value = "awayLogo", required = false) MultipartFile awayLogo,
            @RequestPart(value = "matchImage", required = false) MultipartFile matchImage) {

        MatchAndTicketResponse updated = matchAndTicketService.updateMatchAndTickets(id, dto, homeLogo, awayLogo,
                matchImage);
        return ResponseEntity.ok(ApiResponse.success("Match updated successfully", updated));
    }

    // ĐỔ DỮ LIỆU CŨ DÔ THẰNG Match MUỐN UPDATE
    @GetMapping("/detail/match/{id}")
    public ResponseEntity<ApiResponse<MatchAndTicketResponse>> getMatchDetail(@PathVariable Long id) {
        MatchAndTicketResponse detail = matchAndTicketService.getMatchDetail(id);
        return ResponseEntity.ok(ApiResponse.success("Match detail retrieved successfully", detail));
    }

    @GetMapping("/view/{id}")
    public ResponseEntity<ApiResponse<ViewMatchAndTicketResponse>> viewMatch(@PathVariable Long id) {
        ViewMatchAndTicketResponse view = matchAndTicketService.getMatchForView(id);
        return ResponseEntity.ok(ApiResponse.success("Match view retrieved successfully", view));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMatch(@PathVariable Long id) {
        matchAndTicketService.deleteMatchAndTicket(id);
        return ResponseEntity.ok(ApiResponse.success("Match deleted successfully", null));
    }

    // lấy danh sách ticket setting có phân trang
    @GetMapping("/list/tickets")
    public ResponseEntity<Page<ListTicketResponse>> getTicketList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String sectionName,
            @RequestParam(required = false) String matchSearch,
            @RequestParam(defaultValue = "id") String sortBy) {

        Page<ListTicketResponse> result = matchAndTicketService.getAllTicketList(
                page, size, sectionName, matchSearch, sortBy);

        return ResponseEntity.ok(result);
    }

    // cập nhật tiket setting
    @PutMapping("/update/ticket/{id}")
    public ResponseEntity<ApiResponse<ListTicketResponse>> updateTicketSetting(
            @PathVariable Long id,
            @RequestBody UpdateTicketRequest request) {

        ListTicketResponse updated = matchAndTicketService.updateTicketSetting(id, request);

        return ResponseEntity.ok(ApiResponse.success("Cập nhật vé thành công!", updated));
    }

    // Đổ dữ liệu cũ của setting setting khi cập nhât

    // lấy chi tiết ticket setting
    // === LẤY TOÀN BỘ KHU VỰC SÂN ANFIELD (110 ô) ===
    @GetMapping("/stadium/sections")
    public ResponseEntity<ApiResponse<List<StadiumSectionResponse>>> getAllStadiumSections() {
        List<StadiumSectionResponse> sections = matchAndTicketService.getAllStadiumSections();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách khu vực Anfield thành công", sections));
    }

    // ĐỔ DỮ LIỆU CỦA MẤY CÁI MATCHES VÀ THỜI GIAN COUNTDOWN
    @GetMapping("/home-matches")
    public ResponseEntity<ApiResponse<HomeMatchesGroupedResponse>> getHomeMatches() {
        HomeMatchesGroupedResponse response = matchAndTicketService.getHomeMatches();
        return ResponseEntity.ok(ApiResponse.success("lấy danh sách trận đấu trang chủ thành công", response));
    }

    // HIỂN THI THÔNG TIN TRẬN ĐẤU PHÍA TRÊN CÁI SÂN BÊN TRANG NGƯỜI DÙNG
    @GetMapping("/match/{matchId}/header")
    public ResponseEntity<ApiResponse<MatchHeaderResponse>> getMatchHeader(@PathVariable Long matchId) {
        return ResponseEntity.ok(ApiResponse.success("information of match ok òi",
                matchAndTicketService.getMatchHeader(matchId)));
    }
}