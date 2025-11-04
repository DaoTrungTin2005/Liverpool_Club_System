package vn.liverpool.domain;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "ticket_settings")
@Getter @Setter
public class TicketSetting {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne // nhìu vé cho 1 trận 
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

    @ManyToOne // nhiều vé cho 1 khu vực (kiểu trận real trỏ tới CE1, vé trận MU cũng trỏ tới CE1 (CE1 là one đóa))
    @JoinColumn(name = "section_id", nullable = false)
    private StadiumSection section;

    @Column(precision = 10, scale = 2)
    private BigDecimal price = BigDecimal.ZERO;

    @Column(name = "total_quantity")
    private int totalQuantity = 0;

    @Column(name = "sold_quantity")
    private int soldQuantity = 0;
}