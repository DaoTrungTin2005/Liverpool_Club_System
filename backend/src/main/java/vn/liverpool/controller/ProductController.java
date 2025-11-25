package vn.liverpool.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.liverpool.domain.dto.matches_and_tickets.CreateMatchAndTicketRequest;
import vn.liverpool.domain.dto.matches_and_tickets.MatchAndTicketResponse;
import vn.liverpool.domain.dto.product.ProductCreateRequest;
import vn.liverpool.domain.dto.product.ProductListResponse;
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

    // === ĐỔ DỮ LIỆU CŨ KHI UPDATE + VIEW ===
    @GetMapping("/detail/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductDetail(@PathVariable Long id) {
        ProductResponse detail = productService.getProductDetail(id);
        return ResponseEntity.ok(ApiResponse.success("Product detail retrieved successfully", detail));
    }

    // === DELETE PRODUCT ===
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully", null));
    }

    // === LIST ALL PRODUCTS (có phân trang + search) ===
    @GetMapping("/list")
    public ResponseEntity<ApiResponse<Page<ProductListResponse>>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "") String search) {

        Page<ProductListResponse> products = productService.getAllProducts(page, size, sort, search);
        return ResponseEntity.ok(ApiResponse.success("Fetched products successfully", products));
    }

    // === SHOP PAGE - GET PRODUCTS WITH FILTERS (NO PAGINATION) ===
    @GetMapping("/shop")
    public ResponseEntity<ApiResponse<List<ProductListResponse>>> getShopProducts(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "") String type,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {

        List<ProductListResponse> products = productService.getAllProductsWithFilters(
                search, type, minPrice, maxPrice);

        return ResponseEntity.ok(ApiResponse.success("Fetched shop products successfully", products));
    }

    // === GET ALL PRODUCT TYPES ===
    @GetMapping("/types")
    public ResponseEntity<ApiResponse<List<String>>> getAllProductTypes() {
        List<String> types = productService.getAllProductTypes();
        return ResponseEntity.ok(ApiResponse.success("Fetched product types successfully", types));
    }

}
