package vn.liverpool.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.liverpool.domain.dto.cart.AddToCartRequest;
import vn.liverpool.domain.dto.cart.CartResponse;
import vn.liverpool.domain.dto.cart.UpdateCartItemRequest;
import vn.liverpool.service.CartService;
import vn.liverpool.util.ApiResponse;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // THÊM GIỎ HÀNG
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(
            @RequestBody @Valid AddToCartRequest request) {

        CartResponse cart = cartService.addToCart(
                request.productId(),
                request.variantId(),

                // quantity ko gửi -> mặc định là 1
                request.quantity() == null ? 1 : request.quantity());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Add to cart successfully", cart));
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse<CartResponse>> updateQuantity(
            @RequestBody @Valid UpdateCartItemRequest request) {

        CartResponse cart = cartService.updateQuantity(
                request.cartItemId(),
                request.quantity());

        return ResponseEntity.ok(ApiResponse.success("Update quantity successfully", cart));
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<ApiResponse<CartResponse>> removeItem(
            @PathVariable Long cartItemId) {

        CartResponse cart = cartService.removeItem(cartItemId);
        return ResponseEntity.ok(ApiResponse.success("Remove product successfully", cart));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<String>> clearCart() {
        cartService.clearCart();
        return ResponseEntity.ok(ApiResponse.success("Remove all shopping cart successfully"));
    }

    @GetMapping("/show")
    public ResponseEntity<ApiResponse<CartResponse>> getCart() {
        CartResponse cart = cartService.getCurrentCart();
        return ResponseEntity.ok(ApiResponse.success("Take shopping cart successfully", cart));
    }

    // Thêm vào CartController.java
    @GetMapping("/count")
    public ResponseEntity<ApiResponse<Integer>> getCartCount() {
        int count = cartService.getCartItemCount();
        return ResponseEntity.ok(ApiResponse.success("Count quantity in shopping cart successfully", count));
    }
}
