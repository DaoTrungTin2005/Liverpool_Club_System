
package vn.liverpool.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class VNPayProductConfig {

    @Value("${vnpay-product.tmn-code}")
    private String tmnCode;

    @Value("${vnpay-product.hash-secret}")
    private String hashSecret;

    @Value("${vnpay-product.url}")
    private String vnpUrl;

    @Value("${vnpay-product.return-url}")
    private String returnUrl;

    @Value("${vnpay-product.version}")
    private String version;

    @Value("${vnpay-product.command}")
    private String command;

    @Value("${vnpay-product.order-type}")
    private String orderType;
}