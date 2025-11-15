package vn.liverpool.domain;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "order_tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false) // hoặc nullable = true nếu cho guest
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id", nullable = false)
    private StadiumSection section;

    @Column(nullable = false)
    private String customerName;

    @Column(nullable = false)
    private String customerEmail;

    @Column(nullable = false)
    private String customerPhone;

    @Column(length = 255)
    private String customerAddress;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal totalPrice;

    @Column(nullable = false, length = 50)
    private String orderCode;

    // ========== PAYMENT TRANSACTION IDs ==========
    @Column(length = 50)
    private String vnpayTransactionNo; // VNPay

    @Column(length = 50)
    private String momoTransactionId; // Momo

    @Column(length = 100)
    private String zaloPayAppTransId; // ZaloPay 

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;

    @Column(length = 20)
    private String paymentMethod; // Bank code (VNPay) hoặc payment provider

    @Column(length = 20)
    private String paymentType; // "VNPAY", "MOMO", "ZALOPAY" - ✅ THÊM DÒNG NÀY

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column
    private LocalDateTime paidAt;

    public enum OrderStatus {
        PENDING, // Chờ thanh toán
        PAID, // Đã thanh toán
        CANCELLED, // Đã hủy
        FAILED // Thanh toán thất bại
    }
}