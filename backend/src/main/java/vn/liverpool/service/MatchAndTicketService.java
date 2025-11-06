package vn.liverpool.service;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.hibernate.Hibernate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import vn.liverpool.domain.Match;
import vn.liverpool.domain.StadiumSection;
import vn.liverpool.domain.TicketSetting;
import vn.liverpool.domain.Tournament;
import vn.liverpool.domain.dto.matches_and_tickets.*;
import vn.liverpool.repository.MatchRepository;
import vn.liverpool.repository.StadiumSectionRepository;
import vn.liverpool.repository.TicketSettingRepository;
import vn.liverpool.repository.TournamentRepository;
import jakarta.persistence.ManyToOne;
import jakarta.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MatchAndTicketService {

    private final MatchRepository matchRepo;
    private final StadiumSectionRepository sectionRepo;
    private final TicketSettingRepository ticketSettingRepo;
    private final HttpServletRequest request;
    private final TournamentRepository tournamentRepo;

    public MatchAndTicketResponse createMatchAndTickets(
            CreateMatchAndTicketRequest dto,
            MultipartFile homeLogo,
            MultipartFile awayLogo,
            MultipartFile matchImage) {

        // =đường dẫn thư mục mà ảnh sẽ lưu dô
        String uploadDir = System.getProperty("user.dir") + "/backend/src/main/resources/static/uploads/matches";
        File dir = new File(uploadDir);
        if (!dir.exists())
            dir.mkdirs();

        // xíu gáp dô để truy cập trực tiếp hehe
        String baseUrl = getBaseUrl() + "/uploads/matches/";

        String homeLogoName = saveFile(homeLogo, uploadDir);
        String awayLogoName = saveFile(awayLogo, uploadDir);
        String matchImageName = saveFile(matchImage, uploadDir);

        // Tạo Match ===
        Match match = new Match();
        Tournament tournament = tournamentRepo.findById(dto.tournamentId())
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found: " + dto.tournamentId()));
        match.setTournament(tournament);
        match.setHomeTeam(dto.homeTeam());
        match.setAwayTeam(dto.awayTeam());
        match.setHomeLogo(homeLogoName);
        match.setAwayLogo(awayLogoName);
        match.setMatchImage(matchImageName);
        match.setMatchDate(dto.matchDate());
        match.setLocation(dto.location());

        Match savedMatch = matchRepo.save(match); // Bây giờ OK

        // Tạo TicketSettings ===

        // Tạo một danh sách rỗng để chứa các TicketSetting sẽ lưu vào DB.
        // Lặp qua từng phần tử trong danh sách ticketSettings được gửi từ client
        List<TicketSetting> settings = new ArrayList<>();
        for (TicketSettingRequest ts : dto.ticketSettings()) {
            StadiumSection section = sectionRepo.findById(ts.sectionId())
                    .orElseThrow(() -> new IllegalArgumentException("Section not found: " + ts.sectionId()));

            // cái này là entiy thiệt nè (lấy từ request dô entity thiệt mà sài)
            TicketSetting setting = new TicketSetting();
            setting.setMatch(savedMatch);
            setting.setSection(section);

            // Mặc định 500 nếu null hoặc <= 0
            int totalQty = (ts.totalQuantity() == null || ts.totalQuantity() <= 0)
                    ? 500
                    : ts.totalQuantity();
            setting.setTotalQuantity(totalQty);

            // Mặc định 100.00 nếu null hoặc <= 0
            BigDecimal price = (ts.price() == null || ts.price().compareTo(BigDecimal.ZERO) <= 0)
                    ? BigDecimal.valueOf(100.00)
                    : ts.price();
            setting.setPrice(price);

            // Mới tạo => soldQuantity = 0
            setting.setSoldQuantity(0);

            settings.add(setting);
        }
        ticketSettingRepo.saveAll(settings);

        List<TicketSettingResponse> ticketResponses = settings.stream()
                .map(s -> new TicketSettingResponse(
                        s.getSection().getId(),
                        s.getSection().getName(),
                        s.getSection().getStand(),
                        s.getSection().getTierName(),
                        s.getTotalQuantity(), // khi mới bán thì số lượng đa bán là 0
                        s.getPrice()))
                .toList();

        return new MatchAndTicketResponse(
                savedMatch.getId(),
                savedMatch.getTournament().getId(),
                savedMatch.getHomeTeam(),
                savedMatch.getAwayTeam(),
                homeLogoName != null ? baseUrl + homeLogoName : null,
                awayLogoName != null ? baseUrl + awayLogoName : null,
                matchImageName != null ? baseUrl + matchImageName : null,
                savedMatch.getMatchDate(),
                savedMatch.getLocation(),
                ticketResponses);

    }

    // ?========================GET ALL MATCHES========================
    @Transactional(readOnly = true)
    public Page<ListMatchResponse> getAllMatches(int page, int size, String sort, String search) {

        // === Tạo Pageable ===
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort).descending());

        // === Gọi repository ===
        Page<Match> matchPage = (search == null || search.isBlank())
                ? matchRepo.findAll(pageable)
                : matchRepo.searchAllFields(search, pageable);

        // === Map entity -> DTO ===
        return matchPage.map(match -> new ListMatchResponse(
                match.getId(),
                match.getTournament().getId(),
                match.getHomeTeam(),
                match.getAwayTeam(),
                match.getMatchDate(),
                match.getLocation()));
    }

    // ==UPDATE===============

    @Transactional
    public MatchAndTicketResponse updateMatchAndTickets(
            Long matchId,
            CreateMatchAndTicketRequest dto,
            MultipartFile homeLogo,
            MultipartFile awayLogo,
            MultipartFile matchImage) {

        Match match = matchRepo.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found: " + matchId));

        String uploadDir = System.getProperty("user.dir") + "/backend/src/main/resources/static/uploads/matches";
        File dir = new File(uploadDir);
        if (!dir.exists())
            dir.mkdirs();
        String baseUrl = getBaseUrl() + "/uploads/matches/";

        // === Upload file mới (nếu có) ===
        if (homeLogo != null && !homeLogo.isEmpty()) {
            deleteOldFile(uploadDir, match.getHomeLogo());
            match.setHomeLogo(saveFile(homeLogo, uploadDir));
        }
        if (awayLogo != null && !awayLogo.isEmpty()) {
            deleteOldFile(uploadDir, match.getAwayLogo());
            match.setAwayLogo(saveFile(awayLogo, uploadDir));
        }
        if (matchImage != null && !matchImage.isEmpty()) {
            deleteOldFile(uploadDir, match.getMatchImage());
            match.setMatchImage(saveFile(matchImage, uploadDir));
        }

        // === Update Match info ===
        Tournament tournament = tournamentRepo.findById(dto.tournamentId())
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found"));
        match.setTournament(tournament);
        match.setHomeTeam(dto.homeTeam());
        match.setAwayTeam(dto.awayTeam());
        match.setMatchDate(dto.matchDate());
        match.setLocation(dto.location());

        // === XÓA HẾT ticketSettings cũ TRONG RAM ===
        match.getTicketSettings().clear();

        // === Thêm mới từ request ===
        for (TicketSettingRequest req : dto.ticketSettings()) {
            StadiumSection section = sectionRepo.findById(req.sectionId())
                    .orElseThrow(() -> new IllegalArgumentException("Section not found: " + req.sectionId()));

            TicketSetting setting = new TicketSetting();
            setting.setMatch(match);
            setting.setSection(section);
            setting.setTotalQuantity(
                    req.totalQuantity() == null || req.totalQuantity() <= 0 ? 500 : req.totalQuantity());
            setting.setPrice(
                    req.price() == null || req.price().compareTo(BigDecimal.ZERO) <= 0
                            ? BigDecimal.valueOf(100.00)
                            : req.price());
            setting.setSoldQuantity(0); // mới tạo

            match.getTicketSettings().add(setting); // ← Hibernate sẽ tự INSERT
        }

        // === LƯU MATCH → Hibernate tự sync ticketSettings ===
        Match updatedMatch = matchRepo.save(match);

        // === Response ===
        List<TicketSettingResponse> ticketResponses = updatedMatch.getTicketSettings().stream()
                .map(s -> new TicketSettingResponse(
                        s.getSection().getId(),
                        s.getSection().getName(),
                        s.getSection().getStand(),
                        s.getSection().getTierName(),
                        s.getTotalQuantity(),
                        s.getPrice()))
                .toList();

        return new MatchAndTicketResponse(
                updatedMatch.getId(),
                updatedMatch.getTournament().getId(),
                updatedMatch.getHomeTeam(),
                updatedMatch.getAwayTeam(),
                updatedMatch.getHomeLogo() != null ? baseUrl + updatedMatch.getHomeLogo() : null,
                updatedMatch.getAwayLogo() != null ? baseUrl + updatedMatch.getAwayLogo() : null,
                updatedMatch.getMatchImage() != null ? baseUrl + updatedMatch.getMatchImage() : null,
                updatedMatch.getMatchDate(),
                updatedMatch.getLocation(),
                ticketResponses);
    }

    // ĐỔ DỮ LIỆU CŨ KHI UPDATE
    @Transactional(readOnly = true)
    public MatchAndTicketResponse getMatchDetail(Long matchId) {
        Match match = matchRepo.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found: " + matchId));

        String baseUrl = getBaseUrl() + "/uploads/matches/";

        List<TicketSettingResponse> ticketResponses = match.getTicketSettings().stream()
                .map(ts -> new TicketSettingResponse(
                        ts.getSection().getId(),
                        ts.getSection().getName(),
                        ts.getSection().getStand(),
                        ts.getSection().getTierName(),
                        ts.getTotalQuantity(),
                        ts.getPrice()))
                .toList();

        return new MatchAndTicketResponse(
                match.getId(),
                match.getTournament().getId(),
                match.getHomeTeam(),
                match.getAwayTeam(),
                match.getHomeLogo() != null ? baseUrl + match.getHomeLogo() : null,
                match.getAwayLogo() != null ? baseUrl + match.getAwayLogo() : null,
                match.getMatchImage() != null ? baseUrl + match.getMatchImage() : null,
                match.getMatchDate(),
                match.getLocation(),
                ticketResponses);
    }

    // VIEW MATCH AND TICKET CÓ TOURNAMENT NAME
    @Transactional(readOnly = true)
    public ViewMatchAndTicketResponse getMatchForView(Long matchId) {
        Match match = matchRepo.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found: " + matchId));

        String baseUrl = getBaseUrl() + "/uploads/matches/";

        List<TicketSettingResponse> ticketResponses = match.getTicketSettings().stream()
                .map(ts -> new TicketSettingResponse(
                        ts.getSection().getId(),
                        ts.getSection().getName(),
                        ts.getSection().getStand(),
                        ts.getSection().getTierName(),
                        ts.getTotalQuantity(),
                        ts.getPrice()))
                .toList();

        return new ViewMatchAndTicketResponse(
                match.getId(),
                match.getTournament().getName(), // trả luôn tên tournament
                match.getHomeTeam(),
                match.getAwayTeam(),
                match.getHomeLogo() != null ? baseUrl + match.getHomeLogo() : null,
                match.getAwayLogo() != null ? baseUrl + match.getAwayLogo() : null,
                match.getMatchImage() != null ? baseUrl + match.getMatchImage() : null,
                match.getMatchDate(),
                match.getLocation(),
                ticketResponses);
    }

    // XÓA MATCH VÀ TICKET
    @Transactional
    public void deleteMatchAndTicket(Long matchId) {
        Match match = matchRepo.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found: " + matchId));

        String uploadDir = System.getProperty("user.dir") + "/backend/src/main/resources/static/uploads/matches";

        // Xóa các file ảnh trong local (nếu tồn tại)
        deleteOldFile(uploadDir, match.getHomeLogo());
        deleteOldFile(uploadDir, match.getAwayLogo());
        deleteOldFile(uploadDir, match.getMatchImage());

        // Xóa Match → tự động xóa TicketSettings nhờ cascade + orphanRemoval
        matchRepo.delete(match);
    }

    // ================== HÀM PHỤ ==================
    private void deleteOldFile(String uploadDir, String oldFileName) {
        if (oldFileName == null || oldFileName.isBlank())
            return;
        try {
            Path oldFilePath = Paths.get(uploadDir, oldFileName);
            Files.deleteIfExists(oldFilePath);
        } catch (IOException e) {
            System.err.println("⚠️ Could not delete old file: " + oldFileName);
        }
    }

    // List tickets
    @Transactional(readOnly = true)
    public Page<ListTicketResponse> getAllTicketList(
            int page,
            int size,
            String sectionName,
            String matchSearch,
            String sortBy) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());

        Page<TicketSetting> ticketPage = (sectionName == null && matchSearch == null)
                ? ticketSettingRepo.findAll(pageable)
                : ticketSettingRepo.searchTickets(sectionName, matchSearch, pageable);

        // Vì ts (TicketSetting) có quan hệ @ManyToOne với Match và StadiumSection
        // Hibernate tự động JOIN và lấy dữ liệu liên quan khi gọi ts.getMatch() hay
        // ts.getSection().
        return ticketPage.map(ts -> {
            Match m = ts.getMatch();
            String matchDisplay = m.getHomeTeam() + " vs " + m.getAwayTeam();

            String sectionFullName = ts.getSection().getName();

            return new ListTicketResponse(
                    ts.getId(),
                    sectionFullName,
                    matchDisplay,
                    ts.getTotalQuantity(),
                    ts.getSoldQuantity(),

                    ts.getPrice());
        });
    }

    // === UPDATE TICKET SETTING (chỉ sửa quantity + price) ===
@Transactional
public ListTicketResponse updateTicketSetting(Long ticketSettingId, UpdateTicketRequest request) {
    TicketSetting ts = ticketSettingRepo.findById(ticketSettingId)
            .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy vé với ID: " + ticketSettingId));

    if (request.totalQuantity() != null) {
        if (request.totalQuantity() < ts.getSoldQuantity()) {
            throw new IllegalArgumentException(
                "Số lượng vé không được nhỏ hơn số đã bán (" + ts.getSoldQuantity() + ")");
        }
        ts.setTotalQuantity(request.totalQuantity());
    }

    if (request.price() != null && request.price().compareTo(BigDecimal.ZERO) > 0) {
        ts.setPrice(request.price());
    }

    TicketSetting saved = ticketSettingRepo.save(ts);

    return new ListTicketResponse(
            saved.getId(),
            saved.getSection().getName(),
            saved.getMatch().getHomeTeam() + " vs " + saved.getMatch().getAwayTeam(),
            saved.getTotalQuantity(),
            saved.getSoldQuantity(),
            saved.getPrice()
    );
}

    private String saveFile(MultipartFile file, String dir) {
        if (file == null || file.isEmpty())
            return null;
        try {
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            file.transferTo(new File(dir, filename));
            return filename;
        } catch (IOException e) {
            throw new RuntimeException("Error saving file: " + e.getMessage(), e);
        }
    }

    private String getBaseUrl() {
        return request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
    }

}