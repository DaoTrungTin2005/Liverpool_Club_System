package vn.liverpool.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.servlet.http.HttpServletRequest;
import vn.liverpool.domain.*;
import vn.liverpool.domain.dto.cart.*;
import vn.liverpool.repository.*;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

    @PersistenceContext
    private EntityManager entityManager;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;
    private final HttpServletRequest request;

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
                throw new RuntimeException("exceeds the available quantity. Available: " + available);
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

    // UPDATE QUANTITY
    public CartResponse updateQuantity(Long cartItemId, int quantity) {
        if (quantity < 1) {
            throw new RuntimeException("Quantity > 0");
        }

        // 1. Tìm CartItem theo ID
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Product not available in cart"));

        // 2. Kiểm tra có phải của user hiện tại không (bảo mật)
        Account currentAccount = UserContextService.getCurrentAccount();
        if (!cartItem.getCart().getAccount().getId().equals(currentAccount.getId())) {
            throw new RuntimeException("Không được phép sửa giỏ hàng của người khác");
        }

        // 3. Kiểm tra tồn kho của variant
        ProductVariant variant = cartItem.getVariant();
        int available = variant.getQuantity() - variant.getSoldQuantity();
        if (quantity > available) {
            throw new RuntimeException("exceeds the available quantity. Available: " + available);
        }

        // 4. Cập nhật số lượng
        cartItem.setQuantity(quantity);

        // 5. Save lại (có thể không cần vì đang trong @Transactional, nhưng save cho
        // chắc)
        cartItemRepository.save(cartItem);

        // 6. Trả về giỏ hàng mới nhất
        return toCartResponse(cartItem.getCart());
    }

    // DELETE item

    public CartResponse removeItem(Long cartItemId) {

        // tìm thawnfh cartItem để xóa nó
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Not found Product in cart"));

        Account current = UserContextService.getCurrentAccount();
        if (!cartItem.getCart().getAccount().getId().equals(current.getId())) {
            throw new RuntimeException("Không được xóa đồ của người khác");
        }

        Long cartId = cartItem.getCart().getId();

        cartItemRepository.delete(cartItem);
        cartItemRepository.flush(); // ép Hibernate thực hiện câu lệnh SQL ngay lập tức

        // Clear persistence context để chắc chắn load fresh data
        entityManager.clear(); // clear() = xóa cache, đảm bảo khi fetch lại Cart từ database là dữ liệu mới
                               // nhất.

        // load lại giỏ hàng
        Cart refreshedCart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Not Found your Shopping Cart"));

        return toCartResponse(refreshedCart);
    }

    // DELETE ALL SHOPPING CART
    public void clearCart() {
        Account account = UserContextService.getCurrentAccount();
        Cart cart = cartRepository.findByAccountId(account.getId())
                .orElseThrow(() -> new RuntimeException("Not Found shopping cart"));

        cart.getItems().clear();
        cartRepository.save(cart);
    }

    // SHOW RA DỮ LIỆU TRONG GIỎ HÀNG
    public CartResponse getCurrentCart() {
        Account account = UserContextService.getCurrentAccount();
        Cart cart = cartRepository.findByAccountId(account.getId())
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setAccount(account);
                    return cartRepository.save(newCart);
                });
        return toCartResponse(cart);
    }

    // SHOW RA CÁI SỐ (TÍNH TỔNG SỐ LƯỢNG CART_ITEM) Ở GIỎ HÀNG
    public int getCartItemCount() {
        // Lấy user hiện tại (đã login rồi nên chắc chắn có)
        Account account = UserContextService.getCurrentAccount();

        return cartRepository.findByAccountId(account.getId())
                .map(cart -> {
                    // Nếu có giỏ hàng → đếm tổng số lượng của tất cả món
                    return cart.getItems().stream()
                            .mapToInt(CartItem::getQuantity) // lấy quantity của từng món
                            .sum(); // cộng lại
                })
                .orElse(0); // Nếu chưa có giỏ hàng → trả về 0
    }

    // === HÀM PHỤ: CHUYỂN CART ENTITY -> DTO ===
    private CartResponse toCartResponse(Cart cart) {
        String baseUrl = getBaseUrl() + "/uploads/products/";

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
                            product.getProductImage() != null ? baseUrl + product.getProductImage()
                                    : null,
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

    // === LẤY BASE URL ===
    private String getBaseUrl() {
        return request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
    }
}