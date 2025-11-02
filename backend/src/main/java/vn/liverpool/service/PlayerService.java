package vn.liverpool.service;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import vn.liverpool.domain.Player;
import vn.liverpool.domain.PlayerStats;
import vn.liverpool.domain.Position;
import vn.liverpool.domain.Tournament;
import vn.liverpool.domain.dto.player.CreatePlayerRequest;
import vn.liverpool.domain.dto.player.ListPlayerFollowPositionResponse;
import vn.liverpool.domain.dto.player.PlayerDetailWithStatsResponseDTO;
import vn.liverpool.domain.dto.player.PlayerEditResponse;
import vn.liverpool.domain.dto.player.PlayerProfileWithSuggestionFollowPositionResponse;
// import vn.liverpool.domain.dto.player.PlayerResponseDTO;
import vn.liverpool.repository.PlayerRepository;
import vn.liverpool.repository.PlayerStatsRepository;
import vn.liverpool.repository.PositionRepository;
import vn.liverpool.repository.TournamentRepository;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlayerService {

    private final PlayerRepository playerRepository;
    private final PositionRepository positionRepository;
    private final TournamentRepository tournamentRepository;
    private final PlayerStatsRepository playerStatsRepository;
    private final HttpServletRequest request;

    @Transactional
    public PlayerDetailWithStatsResponseDTO createPlayer(CreatePlayerRequest dto,
            MultipartFile bioImage,
            MultipartFile backgroundImage) {

        // Lấy base url để ghép
        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
                + "/uploads/players/";

        // Validate áo số
        if (playerRepository.existsByShirtNumber(dto.shirtNumber())) {
            throw new IllegalArgumentException("Shirt number " + dto.shirtNumber() + " is already taken");
        }

        // Lấy vị trí. Check positionId trong DB (lk khóa ngoại) , phải lấy riêng ra tại
        // cái này cái bảng khác chút xíu lưu dô
        Position position = positionRepository.findById(dto.positionId())
                .orElseThrow(() -> new IllegalArgumentException("Position not found with id: " + dto.positionId()));

        // Ấy đường dẫn chô lưu dô
        String uploadDir = System.getProperty("user.dir") + "/backend/src/main/resources/static/uploads/players";

        // tạo thư mục lưu nếu chưa có
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String bioImageName = null;
        String backgroundImageName = null;

        // lưu tên file vào
        try {
            if (bioImage != null && !bioImage.isEmpty()) {
                bioImageName = UUID.randomUUID() + "_" + bioImage.getOriginalFilename();
                bioImage.transferTo(new File(dir, bioImageName));
            }
            if (backgroundImage != null && !backgroundImage.isEmpty()) {
                backgroundImageName = UUID.randomUUID() + "_" + backgroundImage.getOriginalFilename();
                backgroundImage.transferTo(new File(dir, backgroundImageName));
            }
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Error saving images", e);
        }

        // Tạo player
        Player player = new Player();
        player.setPlayerName(dto.playerName());
        player.setBio(dto.bio());
        player.setShirtNumber(dto.shirtNumber());
        player.setPosition(position); // cái position lấy từ id lúc nãy, ý là kêu nó lưu fk
        player.setBackgroundImage(backgroundImageName);
        player.setBioImage(bioImageName);
        player.setDateOfBirth(dto.dateOfBirth());
        player.setLocation(dto.location());
        player.setNationality(dto.nationality());
        player.setJoinedClub(dto.joinedClub());

        // Rồi lưu player lưu luôn vị trí rồi đó
        Player savedPlayer = playerRepository.save(player);

        // --------------BẢng stats------------------------
        // check stats từ fe truyền dô
        if (dto.stats() != null && !dto.stats().isEmpty()) {

            // lặp qua từng cái(giải 1, goal ... , giải 2 , goal....)
            List<PlayerStats> statsList = new ArrayList<>();
            for (var statsDto : dto.stats()) {
                Tournament tournament = tournamentRepository.findById(statsDto.tournamentId())
                        .orElseThrow(() -> new IllegalArgumentException(
                                "Tournament not found with id: " + statsDto.tournamentId())); // tìm tên qua id mà fe
                                                                                              // truyền qua
                PlayerStats stats = new PlayerStats();
                stats.setPlayer(savedPlayer); // lưu cái player vừa lưu ở trên á (ý là lưu thằng này) (id thằng này)
                                              // (thằng này là thằng nào)
                stats.setTournament(tournament); // lưu giải nhe lúc nãy lấy từ id ròi đó
                stats.setMatches(statsDto.matches() != null ? statsDto.matches() : 0);
                stats.setGoals(statsDto.goals() != null ? statsDto.goals() : 0);
                stats.setAssists(statsDto.assists() != null ? statsDto.assists() : 0);
                statsList.add(stats); // mỗi lần lặp tạo ra PlayerStats mới bỏ dô lại cái list (vốn dĩ PlayerStats là
                                      // theo từng cục từng cục mà)
            }

            // lưu cái ảng stats cái rồi tính
            playerStatsRepository.saveAll(statsList);

            // --------------xử lí trả ra nè--------------

            // gán lại vào player để stream stats
            savedPlayer.setStats(statsList); // gắn lại danh sách statsList vào đối tượng Player trong bộ nhớ Java (để
                                             // xíu trả DTO thôi) (chưa thể đẩy ra hết dc vì ta cần lấy tên giải nữa
                                             // (statsDetails) lấy xong rồi mới hiện ra 1 nùi thuộc
                                             // PlayerDetailWithStatsResponseDTO)
        }

        // trả ra StatsDetails có giải , goal, assist, matches
        List<PlayerDetailWithStatsResponseDTO.StatsDetail> statsDetails = savedPlayer.getStats().stream() // hồi nãy gắn
                                                                                                          // dô giờ lặp
                                                                                                          // rồi gỡ ra
                                                                                                          // nè
                .map(s -> new PlayerDetailWithStatsResponseDTO.StatsDetail(
                        s.getTournament().getName(),
                        s.getMatches(),
                        s.getGoals(),
                        s.getAssists()))
                .toList();

        // Trả ra tất cả bao gồm cả tên vị trí và StatsDetails (tên giải , goal, assist,
        // matches)
        return new PlayerDetailWithStatsResponseDTO(
                savedPlayer.getId(),
                savedPlayer.getPlayerName(),
                savedPlayer.getBio(),
                savedPlayer.getShirtNumber(),
                savedPlayer.getPosition().getName(),
                savedPlayer.getBackgroundImage() != null ? baseUrl + savedPlayer.getBackgroundImage() : null,
                savedPlayer.getBioImage() != null ? baseUrl + savedPlayer.getBioImage() : null,
                savedPlayer.getDateOfBirth(),
                savedPlayer.getLocation(),
                savedPlayer.getNationality(),
                savedPlayer.getJoinedClub(),
                statsDetails);
    }

    // ===============================DELETE======================

    @Transactional
    public void deletePlayer(Long id) {
        // Lấy player trước khi xóa (để biết tên file ảnh)
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Player not found with id: " + id));

        // Đường dẫn thư mục chứa ảnh
        String uploadDir = System.getProperty("user.dir") + "/backend/src/main/resources/static/uploads/players/";

        // Xóa ảnh bio (nếu có)
        if (player.getBioImage() != null) {
            File bioFile = new File(uploadDir + player.getBioImage());
            if (bioFile.exists()) {
                bioFile.delete();
            }
        }

        // Xóa ảnh background (nếu có)
        if (player.getBackgroundImage() != null) {
            File bgFile = new File(uploadDir + player.getBackgroundImage());
            if (bgFile.exists()) {
                bgFile.delete();
            }
        }

        // Cuối cùng mới xóa trong DB
        playerRepository.deleteById(id);
    }

    // ===============================UPDATE======================
    @Transactional
    public PlayerDetailWithStatsResponseDTO updatePlayer(Long id, CreatePlayerRequest dto,
            MultipartFile bioImage,
            MultipartFile backgroundImage) {

        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
                + "/uploads/players/";

        // coi thằng này là thằng nào theo id
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Player not found with id: " + id));

        // Check trùng áo số (trừ chính player hiện tại)
        if (playerRepository.existsByShirtNumber(dto.shirtNumber())
                && !player.getShirtNumber().equals(dto.shirtNumber())) { // giữ nguyên số áo cũ của thằng đang mặc
            throw new IllegalArgumentException("Shirt number " + dto.shirtNumber() + " is already taken");
        }

        Position position = positionRepository.findById(dto.positionId())
                .orElseThrow(() -> new IllegalArgumentException("Position not found with id: " + dto.positionId()));

        // đường dẫn ảnh sẽ lưu
        String uploadDir = System.getProperty("user.dir") + "/backend/src/main/resources/static/uploads/players";

        File dir = new File(uploadDir);
        if (!dir.exists())
            dir.mkdirs();

        try {

            if (bioImage != null && !bioImage.isEmpty()) {
                // Xóa ảnh cũ
                if (player.getBioImage() != null) {
                    File oldFile = new File(uploadDir + "/" + player.getBioImage());
                    if (oldFile.exists())
                        oldFile.delete();
                }

                // Lưu ảnh mới
                String bioImageName = UUID.randomUUID() + "_" + bioImage.getOriginalFilename();
                bioImage.transferTo(new File(uploadDir + "/" + bioImageName));
                player.setBioImage(bioImageName);
            }

            if (backgroundImage != null && !backgroundImage.isEmpty()) {
                if (player.getBackgroundImage() != null) {
                    File oldFile = new File(uploadDir + "/" + player.getBackgroundImage());
                    if (oldFile.exists())
                        oldFile.delete();
                }
                String bgImageName = UUID.randomUUID() + "_" + backgroundImage.getOriginalFilename();
                backgroundImage.transferTo(new File(uploadDir + "/" + bgImageName));
                player.setBackgroundImage(bgImageName);
            }
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Error updating images", e);
        }

        // rồi cập nhật bên player
        player.setPlayerName(dto.playerName());
        player.setBio(dto.bio());
        player.setShirtNumber(dto.shirtNumber());
        player.setPosition(position); // cái position lấy từ id lúc nãy, ý là kêu nó lưu fk
        player.setDateOfBirth(dto.dateOfBirth());
        player.setLocation(dto.location());
        player.setNationality(dto.nationality());
        player.setJoinedClub(dto.joinedClub());

        // Xóa stats cũ qua Hibernate
        player.getStats().clear(); // khi update xóa hết stats cũ đi này trên Ram hay j á

        // ================= Update stats =================
        if (dto.stats() != null && !dto.stats().isEmpty()) {
            // xóa stats cũ trên DB (đã viết DELETE FROM player_stats WHERE player_id = ?)
            playerStatsRepository.deleteAllByPlayerId(player.getId());
            player.getStats().clear(); // xóa thêm lần nữa cho chắc

            for (var statsDto : dto.stats()) {
                Tournament tournament = tournamentRepository.findById(statsDto.tournamentId())
                        .orElseThrow(() -> new IllegalArgumentException(
                                "Tournament not found with id: " + statsDto.tournamentId())); // lấy cái tournament

                // Gòi cập nhật
                PlayerStats stats = new PlayerStats();
                stats.setPlayer(player);
                stats.setTournament(tournament);
                stats.setMatches(statsDto.matches() != null ? statsDto.matches() : 0);
                stats.setGoals(statsDto.goals() != null ? statsDto.goals() : 0);
                stats.setAssists(statsDto.assists() != null ? statsDto.assists() : 0);
                player.getStats().add(stats); // bỏ stats dô player ,Player đang được Hibernate quản lý, chỉ cần add()
            }
        }

        Player updated = playerRepository.save(player);

        // --------------Ròi trả về nè---------------------

        // Lúc create cần setStats() vì player ban đầu chưa có trong DB
        // player.getStats().add(stats) ở trên đã gán rồi nên giờ khỏi set nữa lấy ra
        // xài
        List<PlayerDetailWithStatsResponseDTO.StatsDetail> statsDetails = updated.getStats().stream()
                // trả ra StatsDetails có giải , goal, assist, matches
                .map(s -> new PlayerDetailWithStatsResponseDTO.StatsDetail(
                        s.getTournament().getName(),
                        s.getMatches(),
                        s.getGoals(),
                        s.getAssists()))
                .toList();

        // Trả đầy đủ
        return new PlayerDetailWithStatsResponseDTO(
                updated.getId(),
                updated.getPlayerName(),
                updated.getBio(),
                updated.getShirtNumber(),
                updated.getPosition().getName(),
                updated.getBackgroundImage() != null ? baseUrl + updated.getBackgroundImage() : null,
                updated.getBioImage() != null ? baseUrl + updated.getBioImage() : null,
                updated.getDateOfBirth(),
                updated.getLocation(),
                updated.getNationality(),
                updated.getJoinedClub(),
                statsDetails);
    }

    // =====================GET DETAIL PLAYER=========================
    @Transactional(readOnly = true)
    public PlayerDetailWithStatsResponseDTO getPlayerDetail(Long id) {

        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
                + "/uploads/players/";

        // Có thể dùng findByIdWithStats để lấy luôn stats, lấy luôn tournament, lấy
        // luôn id
        Player player = playerRepository.findByIdWithStats(id)
                .orElseThrow(() -> new IllegalArgumentException("Player not found with id: " + id));

        List<PlayerDetailWithStatsResponseDTO.StatsDetail> statsDetails = player.getStats().stream()
                .map(stats -> new PlayerDetailWithStatsResponseDTO.StatsDetail(
                        stats.getTournament().getName(),
                        stats.getMatches(),
                        stats.getGoals(),
                        stats.getAssists()))
                .collect(Collectors.toList());

        return new PlayerDetailWithStatsResponseDTO(
                player.getId(),
                player.getPlayerName(),
                player.getBio(),
                player.getShirtNumber(),
                player.getPosition().getName(),
                player.getBackgroundImage() != null ? baseUrl + player.getBackgroundImage() : null,
                player.getBioImage() != null ? baseUrl + player.getBioImage() : null,
                player.getDateOfBirth(),
                player.getLocation(),
                player.getNationality(),
                player.getJoinedClub(),
                statsDetails);
    }

    // ?========================GET ALL PLAYER========================
    @Transactional(readOnly = true)
    public Page<PlayerDetailWithStatsResponseDTO> getAllPlayersWithStats(int page, int size, String sort,
            String search) {

        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
                + "/uploads/players/";

        // Xử lý sort
        // String sortBy = sort.trim(); // Chỉ lấy tên field
        // Sort.Direction direction = Sort.Direction.ASC; // LUÔN TĂNG DẦN

        // Tạo Pageable (phân trang + sort)
        Pageable pageable = PageRequest.of(page, size);

        // Gọi repo
        Page<Player> playerPage = playerRepository.findAllWithSearch(search, pageable);

        return playerPage.map(player -> {
            List<PlayerDetailWithStatsResponseDTO.StatsDetail> statsDetails = player.getStats().stream()
                    .map(s -> new PlayerDetailWithStatsResponseDTO.StatsDetail(
                            s.getTournament().getName(),
                            s.getMatches(),
                            s.getGoals(),
                            s.getAssists()))
                    .toList();

            return new PlayerDetailWithStatsResponseDTO(
                    player.getId(),
                    player.getPlayerName(),
                    player.getBio(),
                    player.getShirtNumber(),
                    player.getPosition().getName(),
                    player.getBackgroundImage() != null ? baseUrl + player.getBackgroundImage() : null,
                    player.getBioImage() != null ? baseUrl + player.getBioImage() : null,
                    player.getDateOfBirth(),
                    player.getLocation(),
                    player.getNationality(),
                    player.getJoinedClub(),
                    statsDetails);
        });
    }

    // ==================LẤY DỮ LIỆU CỦA THẰNG MUỐN UPDATE=================
    @Transactional(readOnly = true)
    public PlayerEditResponse getPlayerForEdit(Long id) {
        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
                + "/uploads/players/";

        // Có thể dùng findByIdWithStats để lấy luôn stats, lấy luôn tỏurnament, lấy
        // luôn id
        Player player = playerRepository.findByIdWithStats(id)
                .orElseThrow(() -> new IllegalArgumentException("Player not found"));

        var stats = player.getStats().stream()
                .map(s -> new PlayerEditResponse.StatsEdit(
                        s.getTournament().getId(),
                        s.getTournament().getName(), // LẤY TỪ BẢNG tournament
                        s.getMatches(),
                        s.getGoals(),
                        s.getAssists()))
                .toList();

        return new PlayerEditResponse(
                player.getId(),
                player.getPlayerName(),
                player.getBio(),
                player.getShirtNumber(),
                player.getPosition().getId(),
                player.getBackgroundImage() != null ? baseUrl + player.getBackgroundImage() : null,
                player.getBioImage() != null ? baseUrl + player.getBioImage() : null,
                player.getDateOfBirth(),
                player.getLocation(),
                player.getNationality(),
                player.getJoinedClub(),
                stats);
    }

    // =====================LIST PLAYERS FOLLOW POSITION (TÍNH TỔNG NỮA NHE)
    // ====================
    @Transactional(readOnly = true)

    // Lấy danh sách cầu thủ theo nhóm vị trí (GOALKEEPER, DEFENDER, …)
    public List<ListPlayerFollowPositionResponse> getPlayersByPositionGroup(String group) {
        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
                + "/uploads/players/";

        // Hàm lấy các cầu thủ theo nhóm vị trí từ repository
        List<Player> players = playerRepository.findByPositionGroup(group);

        // Dùng Java Stream để map từng Player vào ListPlayerFollowPositionResponse
        return players.stream().map(player -> {

            // Tính tổng matches, goals, assists . Duyệt danh sách . lấy matches, nếu null
            // thì 0 và Cộng dồn
            int totalMatches = player.getStats().stream()
                    .mapToInt(s -> s.getMatches() != null ? s.getMatches() : 0).sum();
            int totalGoals = player.getStats().stream()
                    .mapToInt(s -> s.getGoals() != null ? s.getGoals() : 0).sum();
            int totalAssists = player.getStats().stream()
                    .mapToInt(s -> s.getAssists() != null ? s.getAssists() : 0).sum();

            // Trả phản hồi
            return ListPlayerFollowPositionResponse.builder()
                    .id(player.getId())
                    .playerName(player.getPlayerName())
                    .shirtNumber(player.getShirtNumber())
                    .bioImage(player.getBioImage() != null ? baseUrl + player.getBioImage() : null)
                    .totalMatches(totalMatches)
                    .totalGoals(totalGoals)
                    .totalAssists(totalAssists)
                    .build();
        }).toList();
    }

    // ========HIỂN THỊ PROFILE CẦU THỦ + GỌI Ý THEO VỊ TRÍ========

    @Transactional(readOnly = true)
    public PlayerProfileWithSuggestionFollowPositionResponse getPlayerProfileWithSuggestions(Long id) {

        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
                + "/uploads/players/";

        Player player = playerRepository.findByIdWithStats(id)
                .orElseThrow(() -> new IllegalArgumentException("Player not found with id: " + id));

        String positionName = player.getPosition().getName();

        // lấy cầu thủ lọc theo tên vị trí , trừ chính nó
        List<Player> samePlayers = playerRepository.findByPositionNameExcludingPlayer(positionName, id);

        List<PlayerProfileWithSuggestionFollowPositionResponse.SuggestedPlayer> otherPlayers = samePlayers.stream()
                .limit(10)
                .map(p -> {
                    // Tính TỔNG stats từ tất cả các giải
                    int totalMatches = p.getStats().stream()
                            .mapToInt(s -> s.getMatches() != null ? s.getMatches() : 0).sum();
                    int totalGoals = p.getStats().stream()
                            .mapToInt(s -> s.getGoals() != null ? s.getGoals() : 0).sum();
                    int totalAssists = p.getStats().stream()
                            .mapToInt(s -> s.getAssists() != null ? s.getAssists() : 0).sum();

                    // Trả về thông tin cầu thủ gợi ý theo vị trí với thông tin cần thiết
                    return new PlayerProfileWithSuggestionFollowPositionResponse.SuggestedPlayer(
                            p.getId(),
                            p.getPlayerName(),
                            p.getShirtNumber(),
                            p.getBioImage() != null ? baseUrl + p.getBioImage() : null,
                            totalMatches,
                            totalGoals,
                            totalAssists);
                })
                .toList();

        // Trả về đẩy đủ thông tin profile cầu thủ + gợi ý cầu thủ cùng vị trí
        return PlayerProfileWithSuggestionFollowPositionResponse.builder()
                .id(player.getId())
                .playerName(player.getPlayerName())
                .bio(player.getBio())
                .shirtNumber(player.getShirtNumber())
                .positionName(positionName)
                .backgroundImage(player.getBackgroundImage() != null ? baseUrl + player.getBackgroundImage() : null)
                .bioImage(player.getBioImage() != null ? baseUrl + player.getBioImage() : null)
                .dateOfBirth(player.getDateOfBirth())
                .location(player.getLocation())
                .nationality(player.getNationality())
                .joinedClub(player.getJoinedClub())
                .otherPlayers(otherPlayers)
                .build();
    }
}