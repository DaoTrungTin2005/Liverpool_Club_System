package vn.liverpool.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.liverpool.domain.dto.cart.AddToCartRequest;
import vn.liverpool.domain.dto.cart.CartResponse;
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
}
