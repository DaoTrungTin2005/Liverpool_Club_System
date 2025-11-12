package vn.liverpool.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class ZaloPayConfig {
    
    @Value("${zalopay.app-id:553}")
    private String appId;
    
    @Value("${zalopay.key1:9phuBg69KkgfxPKBjVrQHWj7Vtetdzq1}")
    private String key1;
    
    @Value("${zalopay.key2:Uat5fAacbErBcrVQbZ0FSpcJHiynzCqA}")
    private String key2;
    
    @Value("${zalopay.endpoint:https://sandbox.zalopay.com.vn/api/v2/create}")
    private String endpoint;
    
    @Value("${zalopay.return-url:https://8c9550b36ed5.ngrok-free.app/api/payment/zalopay-return}")
    private String returnUrl;
    
    @Value("${zalopay.callback-url:https://8c9550b36ed5.ngrok-free.app/api/payment/zalopay-callback}")
    private String callbackUrl;
}