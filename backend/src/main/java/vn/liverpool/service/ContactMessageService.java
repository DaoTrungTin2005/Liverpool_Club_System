package vn.liverpool.service;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;  // ← SỬA CÁI NÀY
import org.springframework.data.domain.Sort;
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

    // Lấy danh sách tin nhắn cho admin (có phân trang + search)
    @Transactional(readOnly = true)
    public Page<ContactMessageResponse> getMessagesForAdmin(
            int page,
            int size,
            String keyword,
            String sortBy) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());

        Page<ContactMessage> messagePage = (keyword == null || keyword.isBlank())
                ? contactRepo.findAll(pageable)
                : contactRepo.searchMessages(keyword, pageable);

        return messagePage.map(message -> new ContactMessageResponse(
                message.getId(),
                message.getFullName(),
                message.getPhone(),
                message.getEmail(),
                message.getContent(),
                message.getCreatedAt()));
    }
}