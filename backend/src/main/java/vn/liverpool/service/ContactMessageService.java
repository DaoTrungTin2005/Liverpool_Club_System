package vn.liverpool.service;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.liverpool.domain.Account;
import vn.liverpool.domain.ContactMessage;
import vn.liverpool.domain.dto.contact.ContactMessageRequest;
import vn.liverpool.domain.dto.contact.ContactMessageResponse;
import vn.liverpool.repository.AccountRepository;
import vn.liverpool.repository.ContactMessageRepository;

@Service
@RequiredArgsConstructor
public class ContactMessageService {

    private final ContactMessageRepository contactRepo;
    private final AccountRepository accountRepo;

    // Thêm tin nhắn vào database
    @Transactional
    public ContactMessageResponse createMessage(ContactMessageRequest request) {

        Account currentAccount = UserContextService.getCurrentAccount();

        ContactMessage message = ContactMessage.builder()
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .content(request.getContent())
                .account(currentAccount)
                .build();

        ContactMessage saved = contactRepo.save(message);

        return new ContactMessageResponse(
                saved.getId(),
                saved.getFullName(),
                saved.getPhone(),
                saved.getEmail(),
                saved.getContent(),
                saved.getAccount() != null ? saved.getAccount().getId() : null,
                saved.getAccount() != null ? saved.getAccount().getEmail() : null,
                saved.getCreatedAt());
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
                message.getAccount() != null ? message.getAccount().getId() : null,
                message.getAccount() != null ? message.getAccount().getEmail() : null,
                message.getCreatedAt()));
    }

}