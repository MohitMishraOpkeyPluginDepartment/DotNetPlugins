package AutomaticKeywordEntry.AutomaticKeywordEntry;

import java.sql.SQLException;

/**
 * Hello world!
 *
 */
public class App {
	public static void main(String[] args) throws SQLException {
		AutomaticKeywordEntry automaticEntry = new AutomaticKeywordEntry(
				"D:\\MyData\\OracleFusion Keywords.db");
		automaticEntry.setKeywordPrefix("Coupa_");
		automaticEntry.setKeywordPrefixReplace("OracleFusion_");
		automaticEntry.setPluginId("528d1e9e-adde-45be-9248-98bf300dd361");
		automaticEntry.updateAllKeywords();
		automaticEntry.updateAllKeywordArguments();
	}
}
