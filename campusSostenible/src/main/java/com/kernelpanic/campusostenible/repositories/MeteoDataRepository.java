import com.kernelpanic.campusostenible.domain.MeteoData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.kernelpanic.campusostenible.domain.MeteoData;

@Repository
public interface MeteoDataRepository extends JpaRepository<MeteoData, String>{

}