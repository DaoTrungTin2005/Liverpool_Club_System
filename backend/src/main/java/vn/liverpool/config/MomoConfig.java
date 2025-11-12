package vn.liverpool.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class MomoConfig {
    
    @Value("${momo.partner-code:MOMO}")
    private String partnerCode;
    
    @Value("${momo.access-key:F8590A51A5AFCC5A}")
    private String accessKey;
    
    @Value("${momo.secret-key:I6Er3EIrg84ViNO95HiO7g5Havi12g5d}")
    private String secretKey;
    
    @Value("${momo.endpoint:https://test-payment.momo.vn/v2/gateway/api/create}")
    private String endpoint;
    
    @Value("${momo.return-url:https://8c9550b36ed5.ngrok-free.app/api/payment/momo-return}")
    private String returnUrl;
    
    @Value("${momo.notify-url:https://8c9550b36ed5.ngrok-free.app/api/payment/momo-notify}")
    private String notifyUrl;
}