package vn.liverpool.domain.dto.player;

import java.time.LocalDate;
import java.util.List;

// để đổ dữ liệu cũ từ thằng muốn sửa (phải trả về id để fe xử lí, khác với việc hiển thị chỉ trả tên là ok)
public record PlayerEditResponse(
        Long id,
        String playerName,
        String bio,
        Integer shirtNumber,
        Long positionId,
        String backgroundImage,
        String bioImage,
        LocalDate dateOfBirth,
        String location,
        String nationality,
        LocalDate joinedClub,
        List<StatsEdit> stats) {
    public record StatsEdit(
            Long tournamentId,
            String tournamentName,
            Integer matches,
            Integer goals,
            Integer assists) {
    }
}
