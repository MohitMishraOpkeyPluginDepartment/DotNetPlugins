package AutomaticKeywordEntry.AutomaticKeywordEntry;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.UUID;

import org.sqlite.SQLiteConfig;

public class AutomaticKeywordEntry {
	private String dbFilePath;
	private String pluginId;
	private String keywordPrefix;
	private String keywordPrefixReplace;
	private Connection connection;

	public AutomaticKeywordEntry(String dbFilePath) throws SQLException {
		this.setDbFilePath(dbFilePath);
		SQLiteConfig config = new SQLiteConfig();
		config.enforceForeignKeys(true);
		connection = DriverManager.getConnection("jdbc:sqlite:" + dbFilePath, config.toProperties());
	}

	public String getDbFilePath() {
		return dbFilePath;
	}

	public void setDbFilePath(String dbFilePath) {
		this.dbFilePath = dbFilePath;
	}

	public void updateAllKeywordsName() throws SQLException {
		PreparedStatement ps = connection.prepareStatement("Select * from main_keywords");
		ResultSet rs = ps.executeQuery();
		while (rs.next()) {
			String keywordId = rs.getString("KeywordID");
			String keywordName = rs.getString("Name");
			System.out.println("Updating Keyword " + keywordId + "  " + keywordName);
			keywordName = keywordName.replaceAll(getKeywordPrefixReplace(), getKeywordPrefix());
			PreparedStatement ps1 = connection
					.prepareStatement("UPDATE main_keywords SET Name=?,PluginID=? WHERE KeywordID=?");
			ps1.setString(1, keywordName);
			ps1.setString(2, getPluginId());
			ps1.setString(3, keywordId);
			ps1.executeUpdate();
		}
	}
	
	public void updateAllKeywords() throws SQLException {
		PreparedStatement ps = connection.prepareStatement("Select * from main_keywords");
		ResultSet rs = ps.executeQuery();
		while (rs.next()) {
			String keywordId = rs.getString("KeywordID");
			String keywordName = rs.getString("Name");
			System.out.println("Updating Keyword " + keywordId + "  " + keywordName);
			keywordName = keywordName.replaceAll(getKeywordPrefixReplace(), getKeywordPrefix());
			PreparedStatement ps1 = connection
					.prepareStatement("UPDATE main_keywords SET KeywordID=?,Name=?,PluginID=? WHERE KeywordID=?");
			ps1.setString(1, UUID.randomUUID().toString());
			ps1.setString(2, keywordName);
			ps1.setString(3, getPluginId());
			ps1.setString(4, keywordId);
			ps1.executeUpdate();
		}
	}

	public void updateAllKeywordArguments() throws SQLException {
		PreparedStatement ps = connection.prepareStatement("SELECT ArgId FROM main_keywordarguments");
		ResultSet rs = ps.executeQuery();
		while (rs.next()) {
			String argumentId = rs.getString("ArgId");
			System.out.println("Updating Keyword Argument " + argumentId);
			PreparedStatement ps1 = connection
					.prepareStatement("UPDATE main_keywordarguments SET ArgId=? WHERE ArgId=?");
			ps1.setString(1, UUID.randomUUID().toString());
			ps1.setString(2, argumentId);
			ps1.executeUpdate();
		}
	}

	public String getPluginId() {
		return pluginId;
	}

	public void setPluginId(String pluginId) {
		this.pluginId = pluginId;
	}

	public String getKeywordPrefix() {
		return keywordPrefix;
	}

	public void setKeywordPrefix(String keywordPrefix) {
		this.keywordPrefix = keywordPrefix;
	}

	public String getKeywordPrefixReplace() {
		return keywordPrefixReplace;
	}

	public void setKeywordPrefixReplace(String keywordPrefixReplace) {
		this.keywordPrefixReplace = keywordPrefixReplace;
	}

}
