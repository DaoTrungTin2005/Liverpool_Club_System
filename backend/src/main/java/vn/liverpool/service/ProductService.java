package vn.liverpool.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpServletRequest;
import vn.liverpool.domain.Product;
import vn.liverpool.domain.ProductVariant;
import vn.liverpool.domain.dto.product.ProductCreateRequest;
import vn.liverpool.domain.dto.product.ProductResponse;
import vn.liverpool.repository.ProductRepository;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final HttpServletRequest request;

    public ProductResponse createProduct(
            ProductCreateRequest dto,
            MultipartFile productImage) {

        String uploadDir = System.getProperty("user.dir")
                + "/src/main/resources/static/uploads/products";

        File dir = new File(uploadDir);
        if (!dir.exists())
            dir.mkdirs();

        String baseUrl = getBaseUrl() + "/uploads/products/";
        String imageName = saveFile(productImage, uploadDir);

        // Tạo Product
        Product product = new Product();
        product.setProductName(dto.getProductName());
        product.setType(dto.getType());
        product.setBio(dto.getBio());
        product.setProductImage(imageName);

        // Tạo variants
        List<ProductVariant> variants = new ArrayList<>();
        for (ProductCreateRequest.VariantDTO v : dto.getVariants()) {
            ProductVariant variant = new ProductVariant();
            variant.setSize(v.getSize());
            variant.setPrice(v.getPrice());
            variant.setQuantity(v.getQuantity());
            variant.setSoldQuantity(0);
            variant.setProduct(product);
            variants.add(variant);
        }

        product.getVariants().addAll(variants);
        Product savedProduct = productRepository.save(product);

        // Map response
        List<ProductResponse.VariantResponse> variantResponses = variants.stream()
                .map(v -> new ProductResponse.VariantResponse(
                        v.getId(),
                        v.getSize(),
                        v.getPrice(),
                        v.getQuantity(),
                        v.getSoldQuantity()))
                .toList();

        return new ProductResponse(
                savedProduct.getId(),
                savedProduct.getProductName(),
                savedProduct.getType(),
                savedProduct.getBio(),
                imageName != null ? baseUrl + imageName : null,
                savedProduct.getCreatedAt(),
                savedProduct.getUpdatedAt(),
                variantResponses);
    }

    // === UPDATE PRODUCT ===
    @Transactional
    public ProductResponse updateProduct(
            Long productId,
            ProductCreateRequest dto,
            MultipartFile productImage) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + productId));

        String uploadDir = System.getProperty("user.dir")
                + "/src/main/resources/static/uploads/products";
        File dir = new File(uploadDir);
        if (!dir.exists())
            dir.mkdirs();
        String baseUrl = getBaseUrl() + "/uploads/products/";

        if (productImage != null && !productImage.isEmpty()) {
            deleteOldFile(uploadDir, product.getProductImage());
            product.setProductImage(saveFile(productImage, uploadDir));
        }

        product.setProductName(dto.getProductName());
        product.setType(dto.getType());
        product.setBio(dto.getBio());

        product.getVariants().clear();

        for (ProductCreateRequest.VariantDTO v : dto.getVariants()) {
            ProductVariant variant = new ProductVariant();
            variant.setProduct(product);
            variant.setSize(v.getSize());
            variant.setPrice(v.getPrice());
            variant.setQuantity(v.getQuantity());
            variant.setSoldQuantity(0);
            product.getVariants().add(variant);
        }

        // === LƯU PRODUCT thì Hibernate tự sync variants ===
        Product updatedProduct = productRepository.save(product);

        List<ProductResponse.VariantResponse> variantResponses = updatedProduct.getVariants().stream()
                .map(v -> new ProductResponse.VariantResponse(
                        v.getId(),
                        v.getSize(),
                        v.getPrice(),
                        v.getQuantity(),
                        v.getSoldQuantity()))
                .toList();

        return new ProductResponse(
                updatedProduct.getId(),
                updatedProduct.getProductName(),
                updatedProduct.getType(),
                updatedProduct.getBio(),
                updatedProduct.getProductImage() != null ? baseUrl + updatedProduct.getProductImage() : null,
                updatedProduct.getCreatedAt(),
                updatedProduct.getUpdatedAt(),
                variantResponses);
    }

    // === ĐỔ DỮ LIỆU CŨ KHI UPDATE ===
    @Transactional(readOnly = true)
    public ProductResponse getProductDetail(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + productId));

        String baseUrl = getBaseUrl() + "/uploads/products/";

        List<ProductResponse.VariantResponse> variantResponses = product.getVariants().stream()
                .map(v -> new ProductResponse.VariantResponse(
                        v.getId(),
                        v.getSize(),
                        v.getPrice(),
                        v.getQuantity(),
                        v.getSoldQuantity()))
                .toList();

        return new ProductResponse(
                product.getId(),
                product.getProductName(),
                product.getType(),
                product.getBio(),
                product.getProductImage() != null ? baseUrl + product.getProductImage() : null,
                product.getCreatedAt(),
                product.getUpdatedAt(),
                variantResponses);
    }

    ///////////////////////////// util///

    // === HÀM LƯU FILE ===
    private String saveFile(MultipartFile file, String uploadDir) {
        if (file == null || file.isEmpty())
            return null;
        try {
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path path = Paths.get(uploadDir, filename);
            Files.copy(file.getInputStream(), path);
            return filename;
        } catch (IOException e) {
            throw new RuntimeException("Lỗi lưu file: " + e.getMessage());
        }
    }

    // === LẤY BASE URL ===
    private String getBaseUrl() {
        return request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
    }

    // === XÓA FILE CŨ KHI UPDATE ===
    private void deleteOldFile(String uploadDir, String oldFileName) {
        if (oldFileName == null || oldFileName.isBlank())
            return;
        try {
            Path oldPath = Paths.get(uploadDir, oldFileName);
            Files.deleteIfExists(oldPath);
        } catch (IOException e) {
            System.err.println("Không xóa được file cũ: " + oldFileName);
        }
    }
}