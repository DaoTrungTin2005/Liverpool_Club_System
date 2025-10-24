package vn.liverpool.util;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import java.time.LocalDateTime;

// Trả về api cùng format 
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private final String status;
    private final String message;
    private final T data;
    private final LocalDateTime timestamp;

    private ApiResponse(String status, String message, T data) {
        this.status = status; // success / error
        this.message = message;
        this.data = data;
        this.timestamp = LocalDateTime.now(); // tg phản hồi
    }

    // thành công + data
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>("success", message, data);
    }

    //thành công ko data (delete chẳng hạn , đâu có dữ lieuj đâu mà trả )
    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>("success", message, null);
    }

    public static <T> ApiResponse<T> error(String message, T data) {
        return new ApiResponse<>("error", message, data);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>("error", message, null);
    }
}