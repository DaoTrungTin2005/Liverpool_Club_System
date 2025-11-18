package vn.liverpool.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import vn.liverpool.domain.dto.order.CreateOrderTicketRequest;
import vn.liverpool.domain.dto.order.OrderTicketResponse;
import vn.liverpool.domain.dto.order.ValidateSelectionRequest;
import vn.liverpool.domain.dto.order.ValidateSelectionResponse;
import vn.liverpool.service.OrderTicketService;
import vn.liverpool.util.ApiResponse;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final OrderTicketService orderService;

    // lúc nhấn nút buy now thì ktra coi có lố số lượng ko, lố thì báo lỗi
    @PostMapping("/tickets/buy-now")
    public ResponseEntity<ApiResponse<ValidateSelectionResponse>> validateSelection(
            @RequestBody @Valid ValidateSelectionRequest request) {

        ValidateSelectionResponse response = orderService.validateSelection(request);
        return ResponseEntity.ok(ApiResponse.success("QUANTITY OK", response));
    }

    // tạo đơn hàng
    @PostMapping("/create-order")
    public ResponseEntity<ApiResponse<OrderTicketResponse>> createOrder(
            @RequestBody @Valid CreateOrderTicketRequest request) {

        OrderTicketResponse response = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("CREATE ORDER SUCCESSFULLY", response));
    }

    // tạo link VNPAY
    @PostMapping("/create-vnpay/{orderId}")
    public ResponseEntity<ApiResponse<Map<String, String>>> createVNPayUrl(
            @PathVariable Long orderId) {

        String paymentUrl = orderService.createVNPaymentUrl(orderId);
        Map<String, String> data = new HashMap<>();
        data.put("paymentUrl", paymentUrl);

        return ResponseEntity.ok(ApiResponse.success("Tạo link VNPay thành công!", data));
    }

    // tạo link MOMO
    @PostMapping("/create-momo/{orderId}")
    public ResponseEntity<ApiResponse<Map<String, String>>> createMomoUrl(
            @PathVariable Long orderId) {

        String paymentUrl = orderService.createMomoPaymentUrl(orderId);
        Map<String, String> data = new HashMap<>();
        data.put("paymentUrl", paymentUrl);

        return ResponseEntity.ok(ApiResponse.success("Tạo link Momo thành công!", data));
    }

    // tạo link ZALOPAY
    @PostMapping("/create-zalopay/{orderId}")
    public ResponseEntity<ApiResponse<Map<String, String>>> createZaloPayUrl(
            @PathVariable Long orderId) {

        String paymentUrl = orderService.createZaloPayPaymentUrl(orderId);
        Map<String, String> data = new HashMap<>();
        data.put("paymentUrl", paymentUrl);

        return ResponseEntity.ok(ApiResponse.success("Tạo link ZaloPay thành công!", data));
    }

    // VNPAY CALLBACK
    @GetMapping("/vnpay-return")
    public RedirectView vnpayReturn(HttpServletRequest request) {
        Map<String, String> params = new HashMap<>();
        request.getParameterMap().forEach((key, value) -> {
            if (value != null && value.length > 0) {
                params.put(key, value[0]);
            }
        });

        try {
            OrderTicketResponse orderResponse = orderService.handleVNPayReturn(params);
            return new RedirectView("http://localhost:5174/match");

        } catch (Exception e) {
            return new RedirectView("http://localhost:5174/match");
        }
    }

    // MOMO CALLBACK
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

    // MOMO CALLBACK
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

    // ZALOPAY CALLBACK - RETURN
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

    // ZALOPAY CALLBACK
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

    // === LẤY DANH SÁCH ĐƠN HÀNG CHO ADMIN ===

    @GetMapping("/admin/tickets/orders")
    public ResponseEntity<Page<OrderTicketResponse>> getOrdersForAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "createdAt") String sortBy) {

        Page<OrderTicketResponse> result = orderService.getOrdersForAdmin(
                page, size, keyword, sortBy);

        return ResponseEntity.ok(result);
    }

}