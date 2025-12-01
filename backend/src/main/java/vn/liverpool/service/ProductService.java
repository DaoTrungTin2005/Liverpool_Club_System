package vn.liverpool.service;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpServletRequest;
import vn.liverpool.domain.Product;
import vn.liverpool.domain.ProductVariant;
import vn.liverpool.domain.dto.product.ProductCreateRequest;
import vn.liverpool.domain.dto.product.ProductListResponse;
import vn.liverpool.domain.dto.product.ProductResponse;
import vn.liverpool.repository.ProductRepository;

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

    // === DELETE PRODUCT ===
    @Transactional
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + productId));

        String uploadDir = System.getProperty("user.dir") + "/src/main/resources/static/uploads/products";

        deleteOldFile(uploadDir, product.getProductImage());

        // Xóa product -> tự động xóa variants (cascade + orphanRemoval)
        productRepository.delete(product);
    }

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

    // === GET ALL PRODUCT ===
    @Transactional(readOnly = true)
    public Page<ProductListResponse> getAllProducts(int page, int size, String sort, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort).descending());

        // Lấy Page<Product>
        Page<Product> productPage = (search == null || search.isBlank())
                ? productRepository.findAll(pageable)
                : productRepository.searchProducts(search, pageable);

        String baseUrl = getBaseUrl() + "/uploads/products/";

        List<ProductListResponse> list = new ArrayList<>();

        for (Product p : productPage.getContent()) {
            // mỗi variant tạo 1 bản ghi hú hú variant khác nhau trả về bấy nhiêu response
            for (ProductVariant v : p.getVariants()) {
                list.add(new ProductListResponse(
                        p.getId(),
                        v.getId(),
                        p.getProductName(),
                        p.getBio(),
                        v.getPrice(),
                        v.getQuantity(),
                        v.getSoldQuantity(),
                        p.getType(),
                        v.getSize(),
                        baseUrl + p.getProductImage()));
            }
        }

        return new PageImpl<>(list, pageable, list.size());
    }

    // === GET ALL PRODUCTS WITH FILTERS ===

    @Transactional(readOnly = true)
    public List<ProductListResponse> getAllProductsWithFilters(
            String search,
            String type,
            BigDecimal minPrice,
            BigDecimal maxPrice) {

        String cleanSearch = search != null ? search.trim() : "";
        String cleanType = type != null ? type.trim() : "";

        List<Product> products = productRepository.searchProductsWithFilters(
                cleanSearch.isEmpty() ? null : cleanSearch,
                cleanType.isEmpty() ? null : cleanType,
                minPrice,
                maxPrice);

        String baseUrl = getBaseUrl() + "/uploads/products/";

        List<ProductListResponse> list = new ArrayList<>();

        for (Product p : products) {

            ProductVariant cheapestVariant = null;

            // lặp để tìm thằng bé nhất
            for (ProductVariant v : p.getVariants()) {
                // Lọc variants theo price range (thằng nào ko nằm trong khoảng tìm thì cút)

                boolean matchesPrice = true;
                if (minPrice != null && v.getPrice().compareTo(minPrice) < 0) {
                    matchesPrice = false;
                }
                if (maxPrice != null && v.getPrice().compareTo(maxPrice) > 0) {
                    matchesPrice = false;
                }

                // Tìm variant rẻ nhất trong các variant thỏa mãn điều kiện

                // matchesPrice : chỉ xử lí giá nằm trong khoảng lọc
                if (matchesPrice) {
                    if (cheapestVariant == null ||
                            v.getPrice().compareTo(cheapestVariant.getPrice()) < 0) {
                        cheapestVariant = v;
                    }
                }
            }

            // Chỉ add 1 lần với variant rẻ nhất
            if (cheapestVariant != null) {
                list.add(new ProductListResponse(
                        p.getId(),
                        cheapestVariant.getId(),
                        p.getProductName(),
                        p.getBio(),
                        cheapestVariant.getPrice(),
                        cheapestVariant.getQuantity(),
                        cheapestVariant.getSoldQuantity(),
                        p.getType(),
                        cheapestVariant.getSize(), // lấy size của thằng rẻ nhất
                        baseUrl + p.getProductImage()));
            }
        }

        return list;
    }

    // === GET ALL TYPES (cho dropdown) ===
    @Transactional(readOnly = true)
    public List<String> getAllProductTypes() {
        return productRepository.findAllDistinctTypes();
    }
}