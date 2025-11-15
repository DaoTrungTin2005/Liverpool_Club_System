package vn.liverpool.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import vn.liverpool.config.MomoConfig;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;

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
            String requestType = "captureWallet";

            // CHÍNH XÁC NHƯ PHP: 9 THAM SỐ, KHÔNG CÓ timeExpire
            String rawSignature = String.format(
                "accessKey=%s&amount=%d&extraData=%s&ipnUrl=%s&orderId=%s&orderInfo=%s&partnerCode=%s&redirectUrl=%s&requestId=%d&requestType=%s",
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

            // BODY GIỐNG PHP 99%
            Map<String, Object> body = new LinkedHashMap<>();
            body.put("partnerCode", momoConfig.getPartnerCode());
            body.put("partnerName", "Liverpool Club");
            body.put("storeId", "MomoTestStore");
            body.put("requestId", String.valueOf(requestId));
            body.put("amount", amount);
            body.put("orderId", orderCode);
            body.put("orderInfo", orderInfo);
            body.put("redirectUrl", redirectUrl);
            body.put("ipnUrl", ipnUrl);
            body.put("lang", "vi");
            body.put("extraData", extraData);
            body.put("requestType", requestType);
            body.put("signature", signature);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> entity = new HttpEntity<>(objectMapper.writeValueAsString(body), headers);

            ResponseEntity<String> response = restTemplate.exchange(
                momoConfig.getEndpoint(),
                HttpMethod.POST,
                entity,
                String.class
            );

            Map<String, Object> map = objectMapper.readValue(response.getBody(), Map.class);

            if ("0".equals(map.get("resultCode").toString())) {
                return (String) map.get("payUrl");
            } else {
                throw new RuntimeException("Momo error: " + map.get("message"));
            }

        } catch (Exception e) {
            log.error("Error creating Momo payment URL", e);
            throw new RuntimeException("Error creating Momo payment URL: " + e.getMessage());
        }
    }

    // DÙNG CHO CALLBACK
    public boolean verifySignature(Map<String, String> params) {
        try {
            String raw = String.format(
                "accessKey=%s&amount=%s&extraData=%s&orderId=%s&orderInfo=%s&orderType=%s&partnerCode=%s&responseTime=%s&resultCode=%s&transId=%s",
                momoConfig.getAccessKey(),
                params.get("amount"),
                params.getOrDefault("extraData", ""),
                params.get("orderId"),
                params.get("orderInfo"),
                params.get("orderType"),
                momoConfig.getPartnerCode(),
                params.get("responseTime"),
                params.get("resultCode"),
                params.get("transId")
            );
            String computed = hmacSHA256(momoConfig.getSecretKey(), raw);
            return computed.equals(params.get("signature"));
        } catch (Exception e) {
            log.error("Verify Momo signature error", e);
            return false;
        }
    }

    private String hmacSHA256(String key, String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("HMAC error", e);
        }
    }
}