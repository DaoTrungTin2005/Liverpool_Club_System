package vn.liverpool.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.liverpool.domain.dto.contact.ContactMessageRequest;
import vn.liverpool.domain.dto.contact.ContactMessageResponse;
import vn.liverpool.service.ContactMessageService;
import vn.liverpool.util.ApiResponse;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactMessageService contactService;

    // User gửi tin nhắn
    @PostMapping("/send")
    public ResponseEntity<ApiResponse<ContactMessageResponse>> sendMessage(
            @RequestBody @Valid ContactMessageRequest request) {

        ContactMessageResponse response = contactService.createMessage(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Sent message successfully!", response));
    }
}

