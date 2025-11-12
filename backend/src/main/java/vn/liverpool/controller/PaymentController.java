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

    // ========== TẠO ĐƠN HÀNG ==========
    @PostMapping("/create-order")
    public ResponseEntity<ApiResponse<OrderTicketResponse>> createOrder(
            @RequestBody @Valid CreateOrderTicketRequest request) {
        
        OrderTicketResponse response = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Tạo đơn hàng thành công!", response));
    }

    // ========== PAYMENT METHOD SELECTION ==========
    
    //  TẠO LINK VNPAY
    @PostMapping("/create-vnpay/{orderId}")
    public ResponseEntity<ApiResponse<Map<String, String>>> createVNPayUrl(
            @PathVariable Long orderId) {
        
        String paymentUrl = orderService.createVNPaymentUrl(orderId);
        Map<String, String> data = new HashMap<>();
        data.put("paymentUrl", paymentUrl);
        
        return ResponseEntity.ok(ApiResponse.success("Tạo link VNPay thành công!", data));
    }
    //  TẠO LINK MOMO
    @PostMapping("/create-momo/{orderId}")
    public ResponseEntity<ApiResponse<Map<String, String>>> createMomoUrl(
            @PathVariable Long orderId) {
        
        String paymentUrl = orderService.createMomoPaymentUrl(orderId);
        Map<String, String> data = new HashMap<>();
        data.put("paymentUrl", paymentUrl);
        
        return ResponseEntity.ok(ApiResponse.success("Tạo link Momo thành công!", data));
    }

    //  TẠO LINK ZALOPAY - THÊM ENDPOINT NÀY
    @PostMapping("/create-zalopay/{orderId}")
    public ResponseEntity<ApiResponse<Map<String, String>>> createZaloPayUrl(
            @PathVariable Long orderId) {
        
        String paymentUrl = orderService.createZaloPayPaymentUrl(orderId);
        Map<String, String> data = new HashMap<>();
        data.put("paymentUrl", paymentUrl);
        
        return ResponseEntity.ok(ApiResponse.success("Tạo link ZaloPay thành công!", data));
    }

    // ========== CALLBACK URLs ==========
    
    //  VNPAY CALLBACK
    @GetMapping("/vnpay-return")
    public ResponseEntity<ApiResponse<OrderTicketResponse>> vnpayReturn(HttpServletRequest request) {
        Map<String, String> params = new HashMap<>();
        request.getParameterMap().forEach((key, value) -> {
            if (value != null && value.length > 0) {
                params.put(key, value[0]);
            }
        });

        OrderTicketResponse response = orderService.handleVNPayReturn(params);
        
        String message = response.status().name().equals("PAID") 
            ? "Thanh toán VNPay thành công!" 
            : "Thanh toán VNPay thất bại!";
        
        return ResponseEntity.ok(ApiResponse.success(message, response));
    }

    //  MOMO CALLBACK - RETURN
    @GetMapping("/momo-return")
    public ResponseEntity<ApiResponse<OrderTicketResponse>> momoReturn(
            @RequestParam String orderId,
            @RequestParam String resultCode,
            @RequestParam String transId,
            @RequestParam(required = false) String message,
            HttpServletRequest request) {
        
        Map<String, String> params = new HashMap<>();
        request.getParameterMap().forEach((key, value) -> {
            if (value != null && value.length > 0) {
                params.put(key, value[0]);
            }
        });

        OrderTicketResponse response = orderService.handleMomoReturn(params);
        
        String responseMessage = "0".equals(resultCode)
            ? "Thanh toán Momo thành công!"
            : "Thanh toán Momo thất bại!";
        
        return ResponseEntity.ok(ApiResponse.success(responseMessage, response));
    }

    //  MOMO CALLBACK - NOTIFY (Server-to-Server)
    @PostMapping("/momo-notify")
    public ResponseEntity<Map<String, Object>> momoNotify(
            @RequestBody Map<String, String> params) {
        
        try {
            orderService.handleMomoReturn(params);
            
            Map<String, Object> result = new HashMap<>();
            result.put("resultCode", 0);
            result.put("resultMessage", "Success");
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("resultCode", 1);
            result.put("resultMessage", "Failed: " + e.getMessage());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }
    }

    //  ZALOPAY CALLBACK - RETURN - THÊM ENDPOINT NÀY
    @GetMapping("/zalopay-return")
    public ResponseEntity<ApiResponse<OrderTicketResponse>> zaloPayReturn(
            HttpServletRequest request) {
        
        Map<String, String> params = new HashMap<>();
        request.getParameterMap().forEach((key, value) -> {
            if (value != null && value.length > 0) {
                params.put(key, value[0]);
            }
        });

        OrderTicketResponse response = orderService.handleZaloPayReturn(params);
        
        String returnCode = request.getParameter("return_code");
        String message = "1".equals(returnCode)
            ? "Thanh toán ZaloPay thành công!"
            : "Thanh toán ZaloPay thất bại!";
        
        return ResponseEntity.ok(ApiResponse.success(message, response));
    }

    //  ZALOPAY CALLBACK - NOTIFY (Server-to-Server) - THÊM ENDPOINT NÀY
    @PostMapping("/zalopay-callback")
    public ResponseEntity<Map<String, Object>> zaloPayCallback(
            @RequestBody Map<String, String> params) {
        
        try {
            orderService.handleZaloPayReturn(params);
            
            Map<String, Object> result = new HashMap<>();
            result.put("return_code", 1);
            result.put("return_message", "success");
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("return_code", 0);
            result.put("return_message", "failed");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }
    }
}