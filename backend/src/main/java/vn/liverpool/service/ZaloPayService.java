package vn.liverpool.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import vn.liverpool.config.ZaloPayConfig;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ZaloPayService {

    private final ZaloPayConfig zaloPayConfig;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public String createPaymentUrl(String orderCode, long amount, String orderInfo) {
        try {
            long appTime = System.currentTimeMillis();
            String appTransId = System.currentTimeMillis() + "|" + UUID.randomUUID().toString().substring(0, 8);

            // Tạo item
            List<Map<String, Object>> items = new ArrayList<>();
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("itemid", "1");
            item.put("itemname", orderInfo);
            item.put("itemprice", amount);
            item.put("itemquantity", 1);
            items.add(item);

            // Tạo body request
            Map<String, Object> requestBody = new LinkedHashMap<>();
            requestBody.put("app_id", Integer.parseInt(zaloPayConfig.getAppId()));
            requestBody.put("app_trans_id", appTransId);
            requestBody.put("app_user", "liverpool_user");
            requestBody.put("app_time", appTime);
            requestBody.put("amount", amount);
            requestBody.put("app_data", "");
            requestBody.put("embed_data", "{}");
            requestBody.put("item", objectMapper.writeValueAsString(items));
            requestBody.put("description", orderInfo);
            requestBody.put("callback_url", zaloPayConfig.getCallbackUrl());
            requestBody.put("bank_code", "");

            // Tạo MAC
            String data = String.format("%s|%s|%s|%s|%s|%s|%s",
                zaloPayConfig.getAppId(),
                appTransId,
                "liverpool_user",
                amount,
                zaloPayConfig.getCallbackUrl(),
                ""
            );

            String mac = HmacSHA256(data, zaloPayConfig.getKey1());
            requestBody.put("mac", mac);

            log.info("ZaloPay request: {}", objectMapper.writeValueAsString(requestBody));

            // Call API
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            
            String formData = mapToFormData(requestBody);
            HttpEntity<String> entity = new HttpEntity<>(formData, headers);

            String response = restTemplate.postForObject(
                zaloPayConfig.getEndpoint(),
                entity,
                String.class
            );

            log.info("ZaloPay response: {}", response);

            Map<String, Object> responseMap = objectMapper.readValue(response, Map.class);
            
            if (responseMap.get("return_code") != null && responseMap.get("return_code").equals(1)) {
                // Lưu app_trans_id để verify sau
                String returnCode = responseMap.get("return_code").toString();
                String zaloPayUrl = responseMap.get("order_url") != null 
                    ? responseMap.get("order_url").toString() 
                    : "";
                
                // Nếu không có order_url thì tạo redirect URL
                if (zaloPayUrl.isEmpty() && responseMap.get("zpc_trans_token") != null) {
                    zaloPayUrl = "https://sandbox.zalopay.com.vn/pay/" + responseMap.get("zpc_trans_token");
                }
                
                return zaloPayUrl;
            } else {
                throw new RuntimeException("ZaloPay API error: " + responseMap.get("return_message"));
            }

        } catch (Exception e) {
            log.error("Error creating ZaloPay payment URL", e);
            throw new RuntimeException("Error creating ZaloPay payment URL: " + e.getMessage(), e);
        }
    }

    public boolean verifyPaymentSignature(Map<String, String> params) {
        try {
            String mac = params.get("mac");
            String appId = params.get("app_id");
            String appTransId = params.get("app_trans_id");
            String appUser = params.get("app_user");
            String amount = params.get("amount");
            String callbackUrl = zaloPayConfig.getCallbackUrl();

            String data = String.format("%s|%s|%s|%s|%s",
                appId,
                appTransId,
                appUser,
                amount,
                callbackUrl
            );

            String computedMac = HmacSHA256(data, zaloPayConfig.getKey2());
            return computedMac.equals(mac);

        } catch (Exception e) {
            log.error("Error verifying ZaloPay signature", e);
            return false;
        }
    }

    // ✅ Query transaction status từ ZaloPay
    public Map<String, Object> queryTransactionStatus(String appTransId) {
        try {
            Map<String, Object> params = new LinkedHashMap<>();
            params.put("app_id", Integer.parseInt(zaloPayConfig.getAppId()));
            params.put("app_trans_id", appTransId);

            String data = zaloPayConfig.getAppId() + "|" + appTransId + "|" + zaloPayConfig.getKey1();
            String mac = HmacSHA256(data, zaloPayConfig.getKey1());
            params.put("mac", mac);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            
            String formData = mapToFormData(params);
            HttpEntity<String> entity = new HttpEntity<>(formData, headers);

            String response = restTemplate.postForObject(
                "https://sandbox.zalopay.com.vn/api/v2/query",
                entity,
                String.class
            );

            return objectMapper.readValue(response, Map.class);

        } catch (Exception e) {
            log.error("Error querying ZaloPay transaction", e);
            return new HashMap<>();
        }
    }

    private String HmacSHA256(String message, String secret) throws Exception {
        byte[] hmac = getHmacSHA256(secret.getBytes(StandardCharsets.UTF_8), message.getBytes(StandardCharsets.UTF_8));
        StringBuilder result = new StringBuilder();
        for (byte b : hmac) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }

    private byte[] getHmacSHA256(byte[] key, byte[] message) throws Exception {
        javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA256");
        javax.crypto.spec.SecretKeySpec secretKeySpec = 
            new javax.crypto.spec.SecretKeySpec(key, "HmacSHA256");
        mac.init(secretKeySpec);
        return mac.doFinal(message);
    }

    private String mapToFormData(Map<String, Object> params) throws UnsupportedEncodingException {
        StringBuilder result = new StringBuilder();
        boolean first = true;
        for (Map.Entry<String, Object> entry : params.entrySet()) {
            if (first) {
                first = false;
            } else {
                result.append("&");
            }
            result.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8.toString()));
            result.append("=");
            result.append(URLEncoder.encode(String.valueOf(entry.getValue()), StandardCharsets.UTF_8.toString()));
        }
        return result.toString();
    }
}