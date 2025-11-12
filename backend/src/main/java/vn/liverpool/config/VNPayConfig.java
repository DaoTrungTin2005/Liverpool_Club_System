package vn.liverpool.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class VNPayConfig {
    
    @Value("${vnpay.tmn-code:V47H1UFP}")
    private String tmnCode;
    
    @Value("${vnpay.hash-secret:GCXFR9H3H5XT3IH3XTWU6PQXAONP969P}")
    private String hashSecret;
    
    @Value("${vnpay.url:https://sandbox.vnpayment.vn/paymentv2/vpcpay.html}")
    private String vnpUrl;
    
    @Value("${vnpay.return-url:https://8c9550b36ed5.ngrok-free.app/api/payment/vnpay-return}")
    private String returnUrl;
    
    @Value("${vnpay.version:2.1.0}")
    private String version;
    
    @Value("${vnpay.command:pay}")
    private String command;
    
    @Value("${vnpay.order-type:other}")
    private String orderType;
}