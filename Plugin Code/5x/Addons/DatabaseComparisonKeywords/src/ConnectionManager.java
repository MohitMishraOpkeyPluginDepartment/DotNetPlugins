
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataInvalidException;
import com.library.dbdumper.databasedatadumper.dtos.DBConnectionDto;

public class ConnectionManager {
	private volatile static ConnectionManager instance;
	private Map<UUID, DBConnectionDto> connections = new HashMap<>();

	public static ConnectionManager get() {
		if (instance == null) {
			instance = new ConnectionManager();
		}
		return instance;
	}

	public UUID addDBConnection(DBConnectionDto dto) {
		UUID dbcid = UUID.randomUUID();
		this.connections.put(dbcid, dto);
		return dbcid;
	}

	public DBConnectionDto getDBConnection(UUID id) throws ArgumentDataInvalidException {
		if (!connections.containsKey(id)) {
			throw new ArgumentDataInvalidException("Provided Connection Id is Invalid");
		}
		return connections.get(id);
	}
}
