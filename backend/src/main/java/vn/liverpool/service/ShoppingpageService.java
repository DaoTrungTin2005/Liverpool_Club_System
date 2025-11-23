package vn.liverpool.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import vn.liverpool.domain.ShoppingpageConfig;
import vn.liverpool.repository.ShoppingpageConfigRepository;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Transactional
public class ShoppingpageService {

    private final ShoppingpageConfigRepository repo;
    private final HttpServletRequest request;

    private String getBaseUrl() {
        return request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
    }

    // ================== XÓA ẢNH CŨ ==================
    private void deleteOldImages() {
        ShoppingpageConfig old = repo.findById(1L).orElse(null);
        if (old == null)
            return;

        String uploadDir = System.getProperty("user.dir") + "/src/main/resources/static/uploads/shoppingpage";

        Arrays.asList(old.getIntroImage1(), old.getIntroImage2(),
                old.getShoesImage1(), old.getShoesImage2(), old.getShoesImage3())
                .forEach(f -> deleteFile(uploadDir, f));

        Stream.of(old.getKits(), old.getBalls(), old.getAccessories())
                .filter(Objects::nonNull)
                .flatMap(s -> Arrays.stream(s.split(","))
                        .map(item -> item.contains("|") ? item.split("\\|")[0] : item))
                .forEach(f -> deleteFile(uploadDir, f));
    }

    private void deleteFile(String dir, String filename) {
        if (filename != null && !filename.isBlank()) {
            try {
                Files.deleteIfExists(Paths.get(dir, filename));
            } catch (Exception ignored) {
            }
        }
    }

    // ================== LƯU FILE AN TOÀN ==================
    private String saveFile(MultipartFile file) {
        if (file == null || file.isEmpty())
            return null;

        String dir = System.getProperty("user.dir") + "/src/main/resources/static/uploads/shoppingpage";
        new File(dir).mkdirs();

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        try {
            file.transferTo(new File(dir, filename));
            return filename;
        } catch (IOException e) {
            throw new RuntimeException("Lưu file lỗi: " + file.getOriginalFilename(), e);
        }
    }

    // ================== BUILD KIT & BALL (có title) ==================
    private String buildImageTitleString(JsonNode array, List<MultipartFile> files) {
        if (array == null || files == null || array.isEmpty() || files.isEmpty())
            return null;

        StringBuilder sb = new StringBuilder();

        // Duyệt qua tất cả files có sẵn
        for (int i = 0; i < files.size(); i++) {
            MultipartFile file = files.get(i);

            // Bỏ qua file null/empty
            if (file == null || file.isEmpty())
                continue;

            // Lấy title từ JSON nếu có
            String title = "";
            if (i < array.size()) {
                JsonNode item = array.get(i);
                if (item != null && item.isObject() && item.has("title") && item.get("title") != null) {
                    title = item.get("title").asText("");
                }
            }

            // Save file và thêm vào string
            String filename = saveFile(file);
            if (filename != null) {
                sb.append(filename).append("|").append(title).append(",");
            }
        }

        if (sb.length() > 0)
            sb.setLength(sb.length() - 1);
        return sb.length() == 0 ? null : sb.toString();
    }

    // ================== BUILD ACCESSORIES (chỉ ảnh) ==================
    private String buildImageOnlyString(List<MultipartFile> files) {
        if (files == null || files.isEmpty())
            return null;

        StringBuilder sb = new StringBuilder();
        for (MultipartFile file : files) {
            if (file != null && !file.isEmpty()) {
                String filename = saveFile(file);
                if (filename != null) {
                    sb.append(filename).append(",");
                }
            }
        }
        if (sb.length() > 0)
            sb.setLength(sb.length() - 1);
        return sb.length() == 0 ? null : sb.toString();
    }

    // ================== BUILD SHOES FEATURES ==================
    private String buildFeatureString(JsonNode features) {
        if (features == null || !features.isArray() || features.isEmpty())
            return null;

        StringBuilder sb = new StringBuilder();
        for (JsonNode f : features) {
            String main = f.has("main") && f.get("main") != null ? f.get("main").asText("") : "";
            String sub = f.has("sub") && f.get("sub") != null ? f.get("sub").asText("") : "";
            sb.append(main).append("|").append(sub).append(",");
        }
        if (sb.length() > 0)
            sb.setLength(sb.length() - 1);
        return sb.length() == 0 ? null : sb.toString();
    }

    // ================== UPDATE CHÍNH ==================
    public Map<String, Object> updateShoppingpageWithFixedFiles(
            String dataJson,
            MultipartFile intro1, MultipartFile intro2,
            List<MultipartFile> kitFiles,
            List<MultipartFile> ballFiles,
            List<MultipartFile> accessoryFiles,
            List<MultipartFile> shoesFiles) {

        try {
            System.out.println("=== shoppingpage UPDATE DEBUG START ===");
            System.out.println("dataJson: " + (dataJson != null ? "OK" : "NULL!"));
            System.out.println(
                    "intro1: " + (intro1 != null && !intro1.isEmpty() ? intro1.getOriginalFilename() : "null/empty"));
            System.out.println(
                    "intro2: " + (intro2 != null && !intro2.isEmpty() ? intro2.getOriginalFilename() : "null/empty"));
            System.out.println("kitFiles: " + (kitFiles != null ? kitFiles.size() + " files" : "NULL"));
            System.out.println("ballFiles: " + (ballFiles != null ? ballFiles.size() + " files" : "NULL"));
            System.out
                    .println("accessoryFiles: " + (accessoryFiles != null ? accessoryFiles.size() + " files" : "NULL"));
            System.out.println("shoesFiles: " + (shoesFiles != null ? shoesFiles.size() + " files" : "NULL"));

            ObjectMapper mapper = new ObjectMapper();
            JsonNode data = mapper.readTree(dataJson);
            System.out.println("✓ Parse JSON thành công");

            deleteOldImages();
            System.out.println("✓ Xóa ảnh cũ thành công");

            ShoppingpageConfig config = repo.findById(1L).orElse(new ShoppingpageConfig());
            config.setId(1L);
            System.out.println("✓ Load config thành công");

            // Intro
            config.setIntroTitle(data.get("introTitle") != null ? data.get("introTitle").asText("") : "");
            config.setIntroContent(data.get("introContent") != null ? data.get("introContent").asText("") : "");
            config.setIntroImage1(saveFile(intro1));
            config.setIntroImage2(saveFile(intro2));
            System.out.println("✓ Set intro images: " + config.getIntroImage1() + ", " + config.getIntroImage2());

            // Kits & Balls
            String kitsResult = buildImageTitleString(data.get("kits"), kitFiles);
            config.setKits(kitsResult);
            System.out.println("✓ Kits: " + kitsResult);

            String ballsResult = buildImageTitleString(data.get("balls"), ballFiles);
            config.setBalls(ballsResult);
            System.out.println("✓ Balls: " + ballsResult);

            // Accessories
            String accessoriesResult = buildImageOnlyString(accessoryFiles);
            config.setAccessories(accessoriesResult);
            System.out.println("✓ Accessories: " + accessoriesResult);

            // Shoes
            config.setShoesTitle(data.get("shoesTitle") != null ? data.get("shoesTitle").asText("") : "");
            config.setShoesContent(data.get("shoesContent") != null ? data.get("shoesContent").asText("") : "");
            System.out.println("✓ Shoes title/content set");

            // Shoes Images
            config.setShoesImage1(shoesFiles != null && shoesFiles.size() > 0 ? saveFile(shoesFiles.get(0)) : null);
            config.setShoesImage2(shoesFiles != null && shoesFiles.size() > 1 ? saveFile(shoesFiles.get(1)) : null);
            config.setShoesImage3(shoesFiles != null && shoesFiles.size() > 2 ? saveFile(shoesFiles.get(2)) : null);
            System.out.println("✓ Shoes images: " + config.getShoesImage1() + ", " + config.getShoesImage2() + ", "
                    + config.getShoesImage3());

            String featuresResult = buildFeatureString(data.get("shoesMiniTitles"));
            config.setShoesMiniTitles(featuresResult);
            System.out.println("✓ Features: " + featuresResult);

            repo.save(config);

            // Pretty print response JSON - đầy đủ như input
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.setDefaultPrettyPrinter(new com.fasterxml.jackson.core.util.DefaultPrettyPrinter());

            // Rebuild kits array từ string
            List<Map<String, String>> kitsArray = new ArrayList<>();
            if (config.getKits() != null && !config.getKits().isBlank()) {
                Arrays.stream(config.getKits().split(","))
                        .forEach(item -> {
                            String[] parts = item.split("\\|", 2);
                            Map<String, String> kit = new LinkedHashMap<>();
                            kit.put("image", getBaseUrl() + "/uploads/shoppingpage/" + parts[0].trim());
                            kit.put("title", parts.length > 1 ? parts[1].trim() : "");
                            kitsArray.add(kit);
                        });
            }

            // Rebuild balls array từ string
            List<Map<String, String>> ballsArray = new ArrayList<>();
            if (config.getBalls() != null && !config.getBalls().isBlank()) {
                Arrays.stream(config.getBalls().split(","))
                        .forEach(item -> {
                            String[] parts = item.split("\\|", 2);
                            Map<String, String> ball = new LinkedHashMap<>();
                            ball.put("image", getBaseUrl() + "/uploads/shoppingpage/" + parts[0].trim());
                            ball.put("title", parts.length > 1 ? parts[1].trim() : "");
                            ballsArray.add(ball);
                        });
            }

            // Rebuild accessories array từ string
            List<String> accessoriesArray = new ArrayList<>();
            if (config.getAccessories() != null && !config.getAccessories().isBlank()) {
                Arrays.stream(config.getAccessories().split(","))
                        .forEach(img -> accessoriesArray.add(getBaseUrl() + "/uploads/shoppingpage/" + img.trim()));
            }

            // Rebuild shoes images
            List<String> shoesImages = new ArrayList<>();
            if (config.getShoesImage1() != null)
                shoesImages.add(getBaseUrl() + "/uploads/shoppingpage/" + config.getShoesImage1());
            if (config.getShoesImage2() != null)
                shoesImages.add(getBaseUrl() + "/uploads/shoppingpage/" + config.getShoesImage2());
            if (config.getShoesImage3() != null)
                shoesImages.add(getBaseUrl() + "/uploads/shoppingpage/" + config.getShoesImage3());

            // Rebuild features array từ string
            List<Map<String, String>> featuresArray = new ArrayList<>();
            if (config.getShoesMiniTitles() != null && !config.getShoesMiniTitles().isBlank()) {
                Arrays.stream(config.getShoesMiniTitles().split(","))
                        .forEach(item -> {
                            String[] parts = item.split("\\|", 2);
                            Map<String, String> feature = new LinkedHashMap<>();
                            feature.put("main", parts[0].trim());
                            feature.put("sub", parts.length > 1 ? parts[1].trim() : "");
                            featuresArray.add(feature);
                        });
            }

            Map<String, Object> response = new LinkedHashMap<>();
            response.put("status", "success");
            response.put("message", "Cập nhật trang chủ thành công!");
            response.put("timestamp", java.time.LocalDateTime.now().toString());

            Map<String, Object> dataMap = new LinkedHashMap<>();
            dataMap.put("introTitle", config.getIntroTitle());
            dataMap.put("introContent", config.getIntroContent());
            dataMap.put("introImages", List.of(
                    getBaseUrl() + "/uploads/shoppingpage/"
                            + (config.getIntroImage1() != null ? config.getIntroImage1() : ""),
                    getBaseUrl() + "/uploads/shoppingpage/"
                            + (config.getIntroImage2() != null ? config.getIntroImage2() : "")));
            dataMap.put("kits", kitsArray);
            dataMap.put("balls", ballsArray);
            dataMap.put("accessories", accessoriesArray);
            dataMap.put("shoesTitle", config.getShoesTitle());
            dataMap.put("shoesContent", config.getShoesContent());
            dataMap.put("shoesImages", shoesImages);
            dataMap.put("shoesMiniTitles", featuresArray);

            response.put("data", dataMap);

            System.out.println("\n" + "=".repeat(100));
            System.out.println(" shoppingpage UPDATE THÀNH CÔNG");
            System.out.println("=".repeat(100) + "\n");

            return response;

        } catch (Exception e) {
            System.err.println(" LỖI:");
            System.err.println("Message: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> errorResponse = new LinkedHashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "shoppingpage update failed: " + e.getMessage());
            errorResponse.put("timestamp", java.time.LocalDateTime.now().toString());
            return errorResponse;
        }
    }

}