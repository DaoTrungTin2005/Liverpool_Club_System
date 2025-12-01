package vn.liverpool.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class MomoProductConfig {

    @Value("${momo-product.partner-code}")
    private String partnerCode;

    @Value("${momo-product.access-key}")
    private String accessKey;

    @Value("${momo-product.secret-key}")
    private String secretKey;

    @Value("${momo-product.endpoint}")
    private String endpoint;

    @Value("${momo-product.return-url}")
    private String returnUrl;

    @Value("${momo-product.notify-url}")
    private String notifyUrl;
}