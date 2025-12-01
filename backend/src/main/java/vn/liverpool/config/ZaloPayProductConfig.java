package vn.liverpool.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class ZaloPayProductConfig {

    @Value("${zalopay-product.app-id}")
    private String appId;

    @Value("${zalopay-product.key1}")
    private String key1;

    @Value("${zalopay-product.key2}")
    private String key2;

    @Value("${zalopay-product.endpoint}")
    private String endpoint;

    @Value("${zalopay-product.return-url}")
    private String returnUrl;

    @Value("${zalopay-product.callback-url}")
    private String callbackUrl;
}