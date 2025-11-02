package vn.liverpool.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import vn.liverpool.domain.dto.player.CreatePlayerRequest;
import vn.liverpool.domain.dto.player.ListPlayerFollowPositionResponse;
import vn.liverpool.domain.dto.player.PlayerDetailWithStatsResponseDTO;
import vn.liverpool.domain.dto.player.PlayerEditResponse;
import vn.liverpool.domain.dto.player.PlayerProfileWithSuggestionFollowPositionResponse;
import vn.liverpool.domain.dto.player.PlayerStatsWithSuggestionFollowPositionResponse;
import vn.liverpool.domain.dto.player.PlayerEditResponse;
// import vn.liverpool.domain.dto.player.PlayerResponseDTO;
import vn.liverpool.service.PlayerService;
import vn.liverpool.util.ApiResponse;

@RestController
@RequestMapping("/api/players")
@RequiredArgsConstructor
public class PlayerController {

    private final PlayerService playerService;

    // CREATE PLAYER
    @PostMapping(value = "/add", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<PlayerDetailWithStatsResponseDTO>> addPlayer(

            // @RequestPart("player"): phần JSON của cầu thủ (gửi từ FE, thường là FormData
            // 1 phần là JSON, 2 phần là file).
            @RequestPart("player") @Valid CreatePlayerRequest dto,
            @RequestPart(value = "bioImage", required = false) MultipartFile bioImage,
            @RequestPart(value = "backgroundImage", required = false) MultipartFile backgroundImage) {

        PlayerDetailWithStatsResponseDTO response = playerService.createPlayer(dto, bioImage, backgroundImage);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Player created successfully", response));
    }

    // DELETE PLAYER
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePlayer(@PathVariable Long id) {
        playerService.deletePlayer(id);
        return ResponseEntity.ok(ApiResponse.success("Player deleted successfully", null));
    }

    // UPDATE
    @PutMapping(value = "/update/{id}", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<PlayerDetailWithStatsResponseDTO>> updatePlayer(
            @PathVariable Long id,
            @RequestPart("player") @Valid CreatePlayerRequest dto, // CREATE HAY UPDATE CŨNG nhận format i chang nên xài
                                                                   // lun
            @RequestPart(value = "bioImage", required = false) MultipartFile bioImage,
            @RequestPart(value = "backgroundImage", required = false) MultipartFile backgroundImage) {

        PlayerDetailWithStatsResponseDTO updated = playerService.updatePlayer(id, dto, bioImage, backgroundImage);
        return ResponseEntity.ok(ApiResponse.success("Player updated successfully", updated));

    }

    // GET ALL PLAYERS BAO GỒM STATS
    @GetMapping("/list")
    public ResponseEntity<ApiResponse<Page<PlayerDetailWithStatsResponseDTO>>> getAllPlayers(
            // Nhận dl
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "playerName,asc") String sort, // mặc định tăng dần
            @RequestParam(required = false) String search) { // search = null -> không bắt buộc, nếu không có -> tìm tất
                                                             // cả

        Page<PlayerDetailWithStatsResponseDTO> playersPage = playerService.getAllPlayersWithStats(page, size, sort,
                search);
        return ResponseEntity.ok(ApiResponse.success("Players retrieved successfully", playersPage));
    }

    // LẤY DỮ LIỆU ĐỂ HIỂN THỊ CỦA 1 THẰNG PLAYER
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PlayerDetailWithStatsResponseDTO>> getPlayerDetail(@PathVariable Long id) {
        PlayerDetailWithStatsResponseDTO player = playerService.getPlayerDetail(id);
        return ResponseEntity.ok(ApiResponse.success("Player detail retrieved successfully", player));
    }

    // LẤY DỮ LIỆU CỦA THẰNG PLAYER MUỐN UPDATE (khác với thằng hiển thị của 1 thằng
    // player là trả về trường id để fe xử lí thay vì chỉ trả tên để hiện)
    @GetMapping("/{id}/edit")
    public ResponseEntity<ApiResponse<PlayerEditResponse>> getPlayerForEdit(@PathVariable Long id) {
        PlayerEditResponse data = playerService.getPlayerForEdit(id);
        return ResponseEntity.ok(ApiResponse.success("Edit form data loaded successfully", data));
    }

    // ==============LIST PLAYERS FOLLOW POSITION ==============
    @GetMapping("/goalkeepers")
    public ResponseEntity<ApiResponse<List<ListPlayerFollowPositionResponse>>> getGoalkeepers() {
        return ResponseEntity.ok(ApiResponse.success("Goalkeepers retrieved successfully",
                playerService.getPlayersByPositionGroup("GOALKEEPER")));
    }

    @GetMapping("/defenders")
    public ResponseEntity<ApiResponse<List<ListPlayerFollowPositionResponse>>> getDefenders() {
        return ResponseEntity.ok(ApiResponse.success("Defenders retrieved successfully",
                playerService.getPlayersByPositionGroup("DEFENDER")));
    }

    @GetMapping("/midfielders")
    public ResponseEntity<ApiResponse<List<ListPlayerFollowPositionResponse>>> getMidfielders() {
        return ResponseEntity.ok(ApiResponse.success("Midfielders retrieved successfully",
                playerService.getPlayersByPositionGroup("MIDFIELDER")));
    }

    @GetMapping("/attackers")
    public ResponseEntity<ApiResponse<List<ListPlayerFollowPositionResponse>>> getAttackers() {
        return ResponseEntity.ok(ApiResponse.success("Attackers retrieved successfully",
                playerService.getPlayersByPositionGroup("ATTACKER")));
    }

    // ==============HIỂN THỊ PLAYER PROFILE VÀ GỢI Ý CẦU THỦ CÙNG VỊ TRÍ
    // ==============
    @GetMapping("/{id}/profile")
    public ResponseEntity<ApiResponse<PlayerProfileWithSuggestionFollowPositionResponse>> getPlayerProfile(
            @PathVariable Long id) {
        PlayerProfileWithSuggestionFollowPositionResponse response = playerService.getPlayerProfileWithSuggestions(id);
        return ResponseEntity
                .ok(ApiResponse.success("Player profile with suggestions retrieved successfully", response));
    }

    // ==============HIỂN THỊ PLAYER STATS VÀ GỢI Ý CẦU THỦ CÙNG VỊ TRÍ
    // ==============
    @GetMapping("/{id}/stats")
    public ResponseEntity<ApiResponse<PlayerStatsWithSuggestionFollowPositionResponse>> getPlayerStats(
            @PathVariable Long id) {
        PlayerStatsWithSuggestionFollowPositionResponse response = playerService.getPlayerStatsWithSuggestions(id);
        return ResponseEntity.ok(ApiResponse.success("Player stats with suggestions retrieved successfully", response));
    }
}