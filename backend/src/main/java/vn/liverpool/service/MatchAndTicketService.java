package vn.liverpool.service;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
import jakarta.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

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
            match.getLocation()
    ));
}



@Transactional
public MatchAndTicketResponse updateMatchAndTickets(
        Long matchId,
        CreateMatchAndTicketRequest dto,
        MultipartFile homeLogo,
        MultipartFile awayLogo,
        MultipartFile matchImage) {

    // === Tìm match cần update =====
    Match match = matchRepo.findById(matchId)
            .orElseThrow(() -> new IllegalArgumentException("Match not found: " + matchId));

    // ====Đường dẫn upload =====
    String uploadDir = System.getProperty("user.dir") + "/backend/src/main/resources/static/uploads/matches";
    File dir = new File(uploadDir);
    if (!dir.exists()) dir.mkdirs();

    String baseUrl = getBaseUrl() + "/uploads/matches/";

    // =====Upload nếu có file mới và xóa file cũ =====
    if (homeLogo != null && !homeLogo.isEmpty()) {
        deleteOldFile(uploadDir, match.getHomeLogo());
        String newHomeLogo = saveFile(homeLogo, uploadDir);
        match.setHomeLogo(newHomeLogo);
    }

    if (awayLogo != null && !awayLogo.isEmpty()) {
        deleteOldFile(uploadDir, match.getAwayLogo());
        String newAwayLogo = saveFile(awayLogo, uploadDir);
        match.setAwayLogo(newAwayLogo);
    }

    if (matchImage != null && !matchImage.isEmpty()) {
        deleteOldFile(uploadDir, match.getMatchImage());
        String newMatchImage = saveFile(matchImage, uploadDir);
        match.setMatchImage(newMatchImage);
    }

    // =====Update thông tin cơ bản =====
    Tournament tournament = tournamentRepo.findById(dto.tournamentId())
            .orElseThrow(() -> new IllegalArgumentException("Tournament not found: " + dto.tournamentId()));

    match.setTournament(tournament);
    match.setHomeTeam(dto.homeTeam());
    match.setAwayTeam(dto.awayTeam());
    match.setMatchDate(dto.matchDate());
    match.setLocation(dto.location());

    Match updatedMatch = matchRepo.save(match);

    // ===== Xử lý update Ticket Settings =====
    ticketSettingRepo.deleteAll(match.getTicketSettings());

    List<TicketSetting> newSettings = new ArrayList<>();
    for (TicketSettingRequest ts : dto.ticketSettings()) {
        StadiumSection section = sectionRepo.findById(ts.sectionId())
                .orElseThrow(() -> new IllegalArgumentException("Section not found: " + ts.sectionId()));

        TicketSetting setting = new TicketSetting();
        setting.setMatch(updatedMatch);
        setting.setSection(section);
        setting.setTotalQuantity(
                (ts.totalQuantity() == null || ts.totalQuantity() <= 0)
                        ? 500
                        : ts.totalQuantity()
        );
        setting.setPrice(
                (ts.price() == null || ts.price().compareTo(BigDecimal.ZERO) <= 0)
                        ? BigDecimal.valueOf(100.00)
                        : ts.price()
        );
        setting.setSoldQuantity(0);
        newSettings.add(setting);
    }
    ticketSettingRepo.saveAll(newSettings);

    // =====Map về Response =====
    List<TicketSettingResponse> ticketResponses = newSettings.stream()
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
            ticketResponses
    );
}

// ================== HÀM PHỤ ==================
private void deleteOldFile(String uploadDir, String oldFileName) {
    if (oldFileName == null || oldFileName.isBlank()) return;
    try {
        Path oldFilePath = Paths.get(uploadDir, oldFileName);
        Files.deleteIfExists(oldFilePath);
    } catch (IOException e) {
        System.err.println("⚠️ Could not delete old file: " + oldFileName);
    }
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