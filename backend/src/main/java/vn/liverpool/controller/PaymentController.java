package vn.liverpool.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import vn.liverpool.domain.dto.order.CreateOrderTicketRequest;
import vn.liverpool.domain.dto.order.OrderTicketResponse;
import vn.liverpool.service.OrderTicketService;
import vn.liverpool.util.ApiResponse;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final OrderTicketService orderService;

    // Tạo đơn hàng và lấy URL thanh toán
    @PostMapping("/create-order")
    public ResponseEntity<ApiResponse<OrderTicketResponse>> createOrder(
            @RequestBody @Valid CreateOrderTicketRequest request) {
        
        OrderTicketResponse response = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Tạo đơn hàng thành công!", response));
    }

    // VNPay callback URL
    @GetMapping("/vnpay-return")
    public ResponseEntity<ApiResponse<OrderTicketResponse>> vnpayReturn(HttpServletRequest request) {
        // Lấy tất cả params từ VNPay
        Map<String, String> params = new HashMap<>();
        request.getParameterMap().forEach((key, value) -> {
            if (value != null && value.length > 0) {
                params.put(key, value[0]);
            }
        });

        OrderTicketResponse response = orderService.handleVNPayReturn(params);
        
        String message = response.status().name().equals("PAID") 
            ? "Thanh toán thành công!" 
            : "Thanh toán thất bại!";
        
        return ResponseEntity.ok(ApiResponse.success(message, response));
    }
}