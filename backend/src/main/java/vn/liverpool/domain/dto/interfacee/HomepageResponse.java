// src/main/java/vn/liverpool/domain/dto/homepage/HomepageResponse.java
package vn.liverpool.domain.dto.interfacee;

import vn.liverpool.domain.HomepageConfig;

import java.util.*;
import java.util.stream.Stream;

public record HomepageResponse(
        String introTitle,
        String introContent,
        List<String> introImages,

        List<Kit> kits,
        List<Ball> balls,
        List<String> accessories,

        Shoes shoes
) {

    public record Kit(String image, String title) {}
    public record Ball(String image, String title) {}
    public record Shoes(String title, String content, List<String> images, List<Feature> features) {}
    public record Feature(String main, String sub) {}

    // Constructor chính – tự parse từ Entity
    public HomepageResponse(HomepageConfig c, String baseUrl) {
        this(
                c.getIntroTitle(),
                c.getIntroContent(),

                // Mục 1: 2 ảnh intro
                Stream.of(c.getIntroImage1(), c.getIntroImage2())
                        .filter(Objects::nonNull)
                        .filter(s -> !s.isBlank())
                        .map(f -> baseUrl + "/uploads/homepage/" + f)
                        .toList(),

                // Mục 2: Kits
                parseKits(c.getKits(), baseUrl),

                // Mục 3: Balls
                parseBalls(c.getBalls(), baseUrl),

                // Mục 4: Accessories
                parseAccessories(c.getAccessories(), baseUrl),

                // Mục 5: Shoes
                new Shoes(
                        c.getShoesTitle(),
                        c.getShoesContent(),
                        Stream.of(c.getShoesImage1(), c.getShoesImage2(), c.getShoesImage3())
                                .filter(Objects::nonNull)
                                .filter(s -> !s.isBlank())
                                .map(f -> baseUrl + "/uploads/homepage/" + f)
                                .toList(),
                        parseFeatures(c.getShoesMiniTitles())
                )
        );
    }

    // Parse kits: image|title,image|title,...
    private static List<Kit> parseKits(String s, String baseUrl) {
        if (s == null || s.isBlank()) return List.of();
        return Arrays.stream(s.split(","))
                .map(String::trim)
                .filter(item -> !item.isBlank())
                .map(item -> {
                    String[] parts = item.split("\\|", 2);
                    String image = parts[0].trim();
                    String title = parts.length > 1 ? parts[1].trim() : "";
                    return new Kit(
                            image.isBlank() ? null : baseUrl + "/uploads/homepage/" + image,
                            title
                    );
                })
                .toList();
    }

    // Parse balls: image|title,image|title,...
    private static List<Ball> parseBalls(String s, String baseUrl) {
        if (s == null || s.isBlank()) return List.of();
        return Arrays.stream(s.split(","))
                .map(String::trim)
                .filter(item -> !item.isBlank())
                .map(item -> {
                    String[] parts = item.split("\\|", 2);
                    String image = parts[0].trim();
                    String title = parts.length > 1 ? parts[1].trim() : "";
                    return new Ball(
                            image.isBlank() ? null : baseUrl + "/uploads/homepage/" + image,
                            title
                    );
                })
                .toList();
    }

    // Parse accessories: url1,url2,url3,...
    private static List<String> parseAccessories(String s, String baseUrl) {
        if (s == null || s.isBlank()) return List.of();
        return Arrays.stream(s.split(","))
                .map(String::trim)
                .filter(item -> !item.isBlank())
                .map(img -> baseUrl + "/uploads/homepage/" + img)
                .toList();
    }

    // Parse shoes features: main|sub,main|sub,...
    private static List<Feature> parseFeatures(String s) {
        if (s == null || s.isBlank()) return List.of();
        return Arrays.stream(s.split(","))
                .map(String::trim)
                .filter(item -> !item.isBlank())
                .map(item -> {
                    String[] parts = item.split("\\|", 2);
                    String main = parts[0].trim();
                    String sub = parts.length > 1 ? parts[1].trim() : "";
                    return new Feature(main, sub);
                })
                .toList();
    }
}