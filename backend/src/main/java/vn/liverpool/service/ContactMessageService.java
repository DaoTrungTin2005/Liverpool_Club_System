package vn.liverpool.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.liverpool.domain.ContactMessage;
import vn.liverpool.domain.dto.contact.ContactMessageRequest;
import vn.liverpool.domain.dto.contact.ContactMessageResponse;
import vn.liverpool.repository.ContactMessageRepository;

@Service
@RequiredArgsConstructor
public class ContactMessageService {

    private final ContactMessageRepository contactRepo;

    // Thêm tin nhắn vào database
    @Transactional
    public ContactMessageResponse createMessage(ContactMessageRequest request) {
        ContactMessage message = ContactMessage.builder()
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .content(request.getContent())
                .build();

        ContactMessage saved = contactRepo.save(message);

        return new ContactMessageResponse(
                saved.getId(),
                saved.getFullName(),
                saved.getPhone(),
                saved.getEmail(),
                saved.getContent(),
                saved.getCreatedAt()
        );
    }
}