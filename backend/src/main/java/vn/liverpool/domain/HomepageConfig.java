// src/main/java/vn/liverpool/domain/HomepageConfig.java
package vn.liverpool.domain;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "homepage_config")
@Getter
@Setter
public class HomepageConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id = 1L;

    // Mục 1: Introduce
    @Column(name = "intro_title")
    private String introTitle;

    @Column(name = "intro_content", columnDefinition = "TEXT")
    private String introContent;

    @Column(name = "intro_image1")
    private String introImage1;

    @Column(name = "intro_image2")
    private String introImage2;

    // Mục 2: Kits → lưu dạng: image|title,image|title,...
    @Column(columnDefinition = "TEXT")
    private String kits;

    // Mục 3: Balls → image|title,...
    @Column(columnDefinition = "TEXT")
    private String balls;

    // Mục 4: Accessories → chỉ ảnh, ngăn cách bằng dấu phẩy
    @Column(columnDefinition = "TEXT")
    private String accessories;

    // Mục 5: Shoes
    @Column(name = "shoes_title")
    private String shoesTitle;

    @Column(name = "shoes_content", columnDefinition = "TEXT")
    private String shoesContent;

    @Column(name = "shoes_image1")
    private String shoesImage1;

    @Column(name = "shoes_image2")
    private String shoesImage2;

    @Column(name = "shoes_image3")
    private String shoesImage3;

    // Mục 5 bonus: features → main|sub,main|sub,...
    @Column(name = "shoes_mini_titles", columnDefinition = "TEXT")
    private String shoesMiniTitles;

    // Tự động update thời gian (nếu muốn)
    @Column(name = "updated_at", updatable = false, insertable = false,
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private LocalDateTime updatedAt;
}