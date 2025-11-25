package vn.liverpool.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.liverpool.domain.*;
import vn.liverpool.domain.dto.cart.*;
import vn.liverpool.repository.*;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;

    // === THÊM SẢN PHẨM VÀO GIỎ ===
    public CartResponse addToCart(Long productId, Long variantId, int quantity) {
        if (quantity < 1)
            quantity = 1;

        // 1. Lấy user hiện tại
        Account account = UserContextService.getCurrentAccount();
        if (account == null) {
            throw new RuntimeException("You must log in to use this function");
        }

        // 2. Lấy hoặc tạo giỏ hàng của user
        // Nếu user đã có giỏ trong DB → lấy ra
        // Nếu chưa có → tạo mới rồi save
        Cart cart = cartRepository.findByAccountId(account.getId())
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setAccount(account);
                    return cartRepository.save(newCart);
                });

        // 3. Tìm sản phẩm + variant
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Size not found"));

        // 4. Kiểm tra available
        int available = variant.getQuantity() - variant.getSoldQuantity();

        // quantity đang set mà > available -> lỗi
        if (quantity > available) {
            throw new RuntimeException("exceeds the available quantity. Available: " + available);
        }

        // 5. Kiểm tra đã có trong giỏ chưa?
        // tìm đúng CartItem ứng với (giỏ hàng + sản phẩm + variant)
        Optional<CartItem> existingItem = cartItemRepository
                .findByCartIdAndProductIdAndVariantId(cart.getId(), productId, variantId);

        if (existingItem.isPresent()) {
            // Đã có → tăng số lượng
            CartItem item = existingItem.get();

            // số luong hiện có + số lượng mới set
            int newQty = item.getQuantity() + quantity;
            if (newQty > available) {
                throw new RuntimeException("Not available. Remain: " + available);
            }
            item.setQuantity(newQty);
        } else {
            // Chưa có → tạo mới
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setVariant(variant);
            newItem.setQuantity(quantity); // set sô luowgnj người dùng mới set
            cart.getItems().add(newItem); // 1 cart thì có nhiều item -> set cho cartItem xong thigf set cho cart
            cartRepository.save(cart);
        }

        // 6. Trả về giỏ hàng mới nhất
        return toCartResponse(cart);
    }

    // === HÀM PHỤ: CHUYỂN CART ENTITY -> DTO ===
    private CartResponse toCartResponse(Cart cart) {
        var items = cart.getItems().stream()
                .map(item -> {
                    Product product = item.getProduct();
                    ProductVariant variant = item.getVariant();

                    // tính subtotal
                    BigDecimal pricePerItem = variant.getPrice(); // Giá 1 sản phẩm
                    int quantity = item.getQuantity(); // Số lượng mua
                    BigDecimal quantityBigDecimal = BigDecimal.valueOf(quantity); // Chuyển int → BigDecimal
                    BigDecimal subtotal = pricePerItem.multiply(quantityBigDecimal); // Tính tổng tiền (nhân)

                    int available = variant.getQuantity() - variant.getSoldQuantity();

                    return new CartItemDto(
                            item.getId(),
                            product.getId(),
                            product.getProductName(),
                            product.getProductImage(),
                            variant.getId(),
                            variant.getSize(),
                            variant.getPrice(),
                            item.getQuantity(),
                            available,
                            subtotal);
                })
                .toList();

        int totalItems = 0;
        for (CartItemDto item : items) {
            totalItems += item.quantity();
        }

        BigDecimal totalPrice = BigDecimal.ZERO;
        for (CartItemDto item : items) {
            totalPrice = totalPrice.add(item.subtotal()); // cộng mấy subtotal lại
        }

        return new CartResponse(items, totalItems, BigDecimal.ZERO, totalPrice);
    }
}