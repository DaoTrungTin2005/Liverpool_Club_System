package vn.liverpool.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import vn.liverpool.config.MomoConfig;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class MomoService {

    private final MomoConfig momoConfig;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public String createPaymentUrl(String orderCode, long amount, String orderInfo) {
        try {
            long requestId = System.currentTimeMillis();
            String extraData = "";
            String redirectUrl = momoConfig.getReturnUrl();
            String ipnUrl = momoConfig.getNotifyUrl();

            // Tạo requestType
            String requestType = "captureWallet";

            // Tạo signature
            String rawSignature = String.format(
                "accessKey=%s&amount=%d&extraData=%s&ipnUrl=%s&orderId=%s&orderInfo=%s&partnerCode=%s&redirectUrl=%s&requestId=%d&requestType=%s&timeExpire=0",
                momoConfig.getAccessKey(),
                amount,
                extraData,
                ipnUrl,
                orderCode,
                orderInfo,
                momoConfig.getPartnerCode(),
                redirectUrl,
                requestId,
                requestType
            );

            String signature = hmacSHA256(momoConfig.getSecretKey(), rawSignature);

            // Tạo request body
            Map<String, Object> requestBody = new LinkedHashMap<>();
            requestBody.put("partnerCode", momoConfig.getPartnerCode());
            requestBody.put("partnerName", "Liverpool Club");
            requestBody.put("partnerUserId", "");
            requestBody.put("partnerTransId", "");
            requestBody.put("customerId", "");
            requestBody.put("customerIdType", "");
            requestBody.put("customerName", "");
            requestBody.put("customerEmail", "");
            requestBody.put("customerPhone", "");
            requestBody.put("orderId", orderCode);
            requestBody.put("orderInfo", orderInfo);
            requestBody.put("orderGroupId", "");
            requestBody.put("amount", amount);
            requestBody.put("originalAmount", amount);
            requestBody.put("accountNumber", "");
            requestBody.put("description", orderInfo);
            requestBody.put("orderExpireTime", 0);
            requestBody.put("items", new ArrayList<>());
            requestBody.put("checkoutUrl", "");
            requestBody.put("returnUrl", redirectUrl);
            requestBody.put("notifyUrl", ipnUrl);
            requestBody.put("redirectUrl", redirectUrl);
            requestBody.put("ipnUrl", ipnUrl);
            requestBody.put("requestId", requestId);
            requestBody.put("requestType", requestType);
            requestBody.put("extraData", extraData);
            requestBody.put("timeExpire", 0);
            requestBody.put("paymentOptionId", "");
            requestBody.put("signature", signature);

            // Call Momo API
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> entity = new HttpEntity<>(
                objectMapper.writeValueAsString(requestBody),
                headers
            );

            String response = restTemplate.postForObject(
                momoConfig.getEndpoint(),
                entity,
                String.class
            );

            log.info("Momo response: {}", response);

            Map<String, Object> responseMap = objectMapper.readValue(response, Map.class);
            if ("0".equals(responseMap.get("resultCode"))) {
                return (String) responseMap.get("payUrl");
            } else {
                throw new RuntimeException("Momo API error: " + responseMap.get("message"));
            }

        } catch (Exception e) {
            log.error("Error creating Momo payment URL", e);
            throw new RuntimeException("Error creating Momo payment URL: " + e.getMessage(), e);
        }
    }

    public boolean verifyPaymentSignature(Map<String, String> params) {
        try {
            String signature = params.get("signature");
            String amount = params.get("amount");
            String orderId = params.get("orderId");
            String orderInfo = params.get("orderInfo");
            String orderType = params.get("orderType");
            String transId = params.get("transId");
            String resultCode = params.get("resultCode");
            String responseTime = params.get("responseTime");
            String extraData = params.getOrDefault("extraData", "");

            String rawSignature = String.format(
                "accessKey=%s&amount=%s&extraData=%s&orderId=%s&orderInfo=%s&orderType=%s&partnerCode=%s&responseTime=%s&resultCode=%s&transId=%s",
                momoConfig.getAccessKey(),
                amount,
                extraData,
                orderId,
                orderInfo,
                orderType,
                momoConfig.getPartnerCode(),
                responseTime,
                resultCode,
                transId
            );

            String computedSignature = hmacSHA256(momoConfig.getSecretKey(), rawSignature);
            return computedSignature.equals(signature);

        } catch (Exception e) {
            log.error("Error verifying Momo signature", e);
            return false;
        }
    }

    private String hmacSHA256(String key, String data) {
        try {
            Mac hmac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(
                key.getBytes(StandardCharsets.UTF_8),
                "HmacSHA256"
            );
            hmac.init(secretKey);
            byte[] result = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));

            StringBuilder sb = new StringBuilder();
            for (byte b : result) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error generating HMAC SHA256", e);
        }
    }
}