package vn.liverpool.error;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import vn.liverpool.util.ApiResponse;

@RestControllerAdvice // bắt mọi controller
public class GlobalExceptionHandler {

    // Bắt lỗi validation
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleHandleValidationErrors(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors() // lấy ds lỗi, lấy từng lỗi theo field
                .forEach(error -> errors.put(
                        error.getField(), // lấy tên field lỗi
                        error.getDefaultMessage()  // lấy message lỗi (Từ annotation như @NotBlank , ...)
                ));

        return ResponseEntity.badRequest()
                .body(ApiResponse.error("Validation failed", errors)); // errors là data đó , làm trong ApoResponse ròi
    }

    //Bắt lỗi tự throw 
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<String>> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.badRequest()
                .body(ApiResponse.error(ex.getMessage())); // message là tự làm á
    }
}