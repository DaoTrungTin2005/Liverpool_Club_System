package vn.liverpool.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import vn.liverpool.service.HomepageService;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/homepage")
@RequiredArgsConstructor
public class ShoppingInterfaceController {

    private final HomepageService service;

    @PutMapping(value = "/update", consumes = "multipart/form-data")
    public ResponseEntity<?> updateHomepage(
            @RequestPart("data") String dataJson,

            // 2 ảnh intro
            @RequestPart(value = "introImage1", required = false) MultipartFile introImage1,
            @RequestPart(value = "introImage2", required = false) MultipartFile introImage2,

            // 4 kit images
            @RequestPart(value = "kitImages", required = false) List<MultipartFile> kitImages,

            // 3 ball images
            @RequestPart(value = "ballImages", required = false) List<MultipartFile> ballImages,

            // 4 accessory images
            @RequestPart(value = "accessoryImages", required = false) List<MultipartFile> accessoryImages,

            // 3 shoes images
            @RequestPart(value = "shoesImages", required = false) List<MultipartFile> shoesImages

    ) throws IOException {

        // Đảm bảo không null
        if (kitImages == null) kitImages = new ArrayList<>();
        if (ballImages == null) ballImages = new ArrayList<>();
        if (accessoryImages == null) accessoryImages = new ArrayList<>();
        if (shoesImages == null) shoesImages = new ArrayList<>();

        // Service trả về Map chứa toàn bộ response
        Map<String, Object> responseData = service.updateHomepageWithFixedFiles(
                dataJson,
                introImage1, introImage2,
                kitImages,
                ballImages,
                accessoryImages,
                shoesImages);

        return ResponseEntity.ok(responseData);
    }
}