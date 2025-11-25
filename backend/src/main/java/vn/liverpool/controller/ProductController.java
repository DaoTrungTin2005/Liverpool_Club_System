package vn.liverpool.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.liverpool.domain.dto.matches_and_tickets.CreateMatchAndTicketRequest;
import vn.liverpool.domain.dto.matches_and_tickets.MatchAndTicketResponse;
import vn.liverpool.domain.dto.product.ProductCreateRequest;
import vn.liverpool.domain.dto.product.ProductResponse;
import vn.liverpool.service.ProductService;
import vn.liverpool.util.ApiResponse;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
            @RequestPart("data") @Valid ProductCreateRequest dto,
            @RequestPart(value = "productImage", required = false) MultipartFile productImage) {

        ProductResponse response = productService.createProduct(dto, productImage);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Add product successfully", response));
    }

    // === UPDATE PRODUCT ===
    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable Long id,
            @RequestPart("data") @Valid ProductCreateRequest dto,
            @RequestPart(value = "productImage", required = false) MultipartFile productImage) {

        ProductResponse updated = productService.updateProduct(id, dto, productImage);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", updated));
    }

}
