import com.kernelpanic.campusostenible.domain.BackOffice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BackOfficeRepository extends JpaRepository<BackOffice, String>{

}