package vn.liverpool.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import vn.liverpool.config.ZaloPayProductConfig;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ZaloPayProductService {

    private final ZaloPayProductConfig config;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String createPaymentUrl(String orderCode, Long amount, String description) {
        try {
            String appTransId = getCurrentDateFormatted() + "_" + orderCode;

            Map<String, Object> embedData = new HashMap<>();
            embedData.put("redirecturl", config.getReturnUrl());

            List<Map<String, Object>> items = new ArrayList<>();
            Map<String, Object> item = new HashMap<>();
            item.put("itemid", orderCode);
            item.put("itemname", description);
            item.put("itemprice", amount);
            item.put("itemquantity", 1);
            items.add(item);

            long appTime = System.currentTimeMillis();

            Map<String, Object> order = new LinkedHashMap<>();
            order.put("app_id", Integer.parseInt(config.getAppId()));
            order.put("app_trans_id", appTransId);
            order.put("app_user", "user_" + orderCode);
            order.put("app_time", appTime);
            order.put("amount", amount);
            order.put("item", objectMapper.writeValueAsString(items));
            order.put("embed_data", objectMapper.writeValueAsString(embedData));
            order.put("callback_url", config.getCallbackUrl());
            order.put("description", description);
            order.put("bank_code", "");

            String data = config.getAppId() + "|"
                    + order.get("app_trans_id") + "|"
                    + order.get("app_user") + "|"
                    + order.get("amount") + "|"
                    + order.get("app_time") + "|"
                    + order.get("embed_data") + "|"
                    + order.get("item");

            String mac = generateHMAC(data, config.getKey1());
            order.put("mac", mac);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(order, headers);

            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(
                    config.getEndpoint() + "/create",
                    entity,
                    Map.class);

            if (response != null && Integer.valueOf(1).equals(response.get("return_code"))) {
                return (String) response.get("order_url");
            } else {
                String errorMsg = response != null ? (String) response.get("return_message") : "Unknown error";
                throw new RuntimeException("ZaloPay error: " + errorMsg);
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to create ZaloPay payment: " + e.getMessage(), e);
        }
    }

    public boolean verifyPaymentSignature(Map<String, String> params) {
        try {
            String data = params.get("data");
            String receivedMac = params.get("mac");

            String calculatedMac = generateHMAC(data, config.getKey2());

            return calculatedMac.equals(receivedMac);
        } catch (Exception e) {
            return false;
        }
    }

    private String generateHMAC(String data, String key) throws Exception {
        Mac hmac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(), "HmacSHA256");
        hmac.init(secretKey);
        byte[] hash = hmac.doFinal(data.getBytes());
        return new String(org.springframework.security.crypto.codec.Hex.encode(hash));
    }

    private String getCurrentDateFormatted() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyMMdd");
        return sdf.format(new Date());
    }
}