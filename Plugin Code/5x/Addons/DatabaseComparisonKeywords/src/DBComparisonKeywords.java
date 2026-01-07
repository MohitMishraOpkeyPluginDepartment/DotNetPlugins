import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import com.crestech.opkey.plugin.KeywordLibrary;
import com.crestech.opkey.plugin.ResultCodes;
import com.crestech.opkey.plugin.communication.contracts.functionresult.FunctionResult;
import com.crestech.opkey.plugin.communication.contracts.functionresult.Result;
import com.crestech.opkey.plugin.exceptionhandling.ArgumentDataInvalidException;
import com.crestech.opkey.plugin.logging.OpkeyLogger;
import com.library.dbdumper.databasedatadumper.daos.DBDumper;
import com.library.dbdumper.databasedatadumper.dtos.DBConnectionDto;
import com.library.dbdumper.databasedatadumper.dtos.TableDataDto;
import com.library.dbdumper.databasedatadumper.dtos.TableHeaderDataDto;
import com.library.dbdumper.databasedatadumper.dtos.TableRowCellDataDto;
import com.library.dbdumper.databasedatadumper.dtos.TableRowDataDto;
import com.library.dbdumper.databasedatadumper.enums.DBType;
import com.library.dbdumper.databasedatadumper.exceptions.DBNotImplementedException;
import com.library.dbdumper.databasedatadumper.utils.DBDumperUtilities;
import com.mysql.cj.x.protobuf.MysqlxCrud.ViewAlgorithm;

public class DBComparisonKeywords implements KeywordLibrary {

	static public Class<DBComparisonKeywords> _class = DBComparisonKeywords.class;

	public FunctionResult dbConnectToDb(String dbtype, String hostName, int portNo, String userName, String password,
			String schema) throws SQLException, DBNotImplementedException {
		if (isStringNullOrBlank(dbtype) || isStringNullOrBlank(hostName) || isStringNullOrBlank(userName)
				|| isStringNullOrBlank(password) || isStringNullOrBlank(schema)) {
			return Result.PASS()
					.setMessage("Argument(s): (DBtype,HostName,PortNo,UserName,Password,Schema) is/are blank.")
					.setOutput("").make();
		}

		UUID dbcid;
		if (password == null) {
			password = "";
		}
		try {
			DBType dbtypeEnum = new DBDumperUtilities().getDBType(dbtype);
			DBConnectionDto dto = new DBConnectionDto(dbtypeEnum, hostName, portNo, userName, password, schema);
			dbcid = ConnectionManager.get().addDBConnection(dto);
		} catch (Exception e) {
			return Result.PASS().setMessage("Not able to connect to database").setOutput("").make();

		}
		return Result.PASS().setOutput(dbcid.toString()).setMessage("Done").make();
	}

	public FunctionResult dbConnectToOracleDB(String hostName, int portNo, String userName, String password,
			String serviceName) throws SQLException, DBNotImplementedException {
		if (isStringNullOrBlank(hostName) || isStringNullOrBlank(userName) || isStringNullOrBlank(password)
				|| isStringNullOrBlank(serviceName)) {
			return Result.PASS()
					.setMessage("Argument(s): (hostName,portNo,userName,Password,serviceName) is/are blank.")
					.setOutput("").make();
		}
		String dbtype = "ORACLEDB";
		UUID dbcid;
		if (password == null) {
			password = "";
		}
		try {
			DBType dbtypeEnum = new DBDumperUtilities().getDBType(dbtype);
			DBConnectionDto dto = new DBConnectionDto(hostName, portNo, userName, password, serviceName, dbtypeEnum);
			dbcid = ConnectionManager.get().addDBConnection(dto);
		} catch (Exception e) {
			return Result.PASS().setMessage("Not able to connect to database").setOutput("").make();
		}
		return Result.PASS().setOutput(dbcid.toString()).setMessage("Done").make();
	}

	public FunctionResult dbConnectToMSsqlDB(String hostName, int portNo, String userName, String password,
			String dataBaseName) throws SQLException, DBNotImplementedException {
		if (isStringNullOrBlank(hostName) || isStringNullOrBlank(userName) || isStringNullOrBlank(password)
				|| isStringNullOrBlank(dataBaseName)) {
			return Result.PASS()
					.setMessage("Argument(s): (hostName,portNo,userName,Password,DataBaseName) is/are blank.")
					.setOutput("").make();
		}
		String dbtype = "MSSQL";
		UUID dbcid;
		if (password == null) {
			password = "";
		}
		try {
			DBType dbtypeEnum = new DBDumperUtilities().getDBType(dbtype);
			DBConnectionDto dto = new DBConnectionDto(hostName, portNo, userName, password, dbtypeEnum, dataBaseName);
			dbcid = ConnectionManager.get().addDBConnection(dto);
		} catch (Exception e) {
			return Result.PASS().setMessage("Not able to connect to database").setOutput("").make();
		}
		return Result.PASS().setOutput(dbcid.toString()).setMessage("Done").make();
	}

	public FunctionResult dbConnectToPostGres(String hostName, int portNo, String userName, String password,
			String dataBaseName) throws SQLException, DBNotImplementedException {
		if (isStringNullOrBlank(hostName) || isStringNullOrBlank(userName) || isStringNullOrBlank(password)
				|| isStringNullOrBlank(dataBaseName)) {
			return Result.PASS()
					.setMessage("Argument(s): (hostName,portNo,userName,Password,DataBaseName) is/are blank.")
					.setOutput("").make();
		}
		String dbtype = "POSTGRESSQL";
		UUID dbcid;
		if (password == null) {
			password = "";
		}
		try {
			DBType dbtypeEnum = new DBDumperUtilities().getDBType(dbtype);
			DBConnectionDto dto = new DBConnectionDto(hostName, portNo, userName, password, dbtypeEnum, dataBaseName);
			dbcid = ConnectionManager.get().addDBConnection(dto);
		} catch (Exception e) {
			return Result.PASS().setMessage("Not able to connect to database").setOutput("").make();
		}
		return Result.PASS().setOutput(dbcid.toString()).setMessage("Done").make();
	}

	public FunctionResult dbConnectToSqlite(String sqlitePath, String password) {
		if (isStringNullOrBlank(sqlitePath)) {
			return Result.PASS().setMessage("Argument: sqlitepath is blank.").setOutput("").make();
		}
		UUID dbcid;
		DBConnectionDto dto = new DBConnectionDto();
		dto.setDbtype(DBType.SQLITE);
		try {
			dto.setSqlitePath(sqlitePath);
			dto.setPassword(password);
			dbcid = ConnectionManager.get().addDBConnection(dto);
		} catch (Exception e) {
			return Result.PASS().setMessage("Not able to connect to database").setOutput("").make();
		}
		return Result.PASS().setOutput(dbcid.toString()).setMessage("Done").make();
	}

	public FunctionResult dbGetTableRowCount(String connectionId, String tableName)
			throws ArgumentDataInvalidException, SQLException, DBNotImplementedException {
		System.out.println("Inside dbGetTableRowCount()");

		if (isStringNullOrBlank(connectionId)) {
			return Result.PASS().setMessage("Argument: ConnectionId is blank.").setOutput(false).make();
		}

		if (isStringNullOrBlank(tableName)) {
			return Result.PASS().setMessage("Argument: TableName is blank.").setOutput(false).make();
		}

		OpkeyLogger.printLog(_class, ">>Inside dbGetTableRowCount()");

		DBConnectionDto dto = ConnectionManager.get().getDBConnection(UUID.fromString(connectionId));
		DBDumper dbDumper = new DBDumper(dto);

		if (!dbDumper.isConnectionSuccessful()) {
			return Result.PASS().setMessage(
					"Not able to connect to database because of any/all mention reasion- HostName, UserId, Password is/are invalid (or) Server is not present on given host.")
					.setOutput("").make();
		}

		if (dto.getDbtype() == DBType.MYSQL) {

			if (!dbDumper.isSchemaExists()) {
				return Result.PASS()
						.setMessage("Schema name: " + dto.getSchemaName() + "  is not present in your database")
						.setOutput(false).make();
			}
		} else if (dto.getDbtype() == DBType.MSSQL || dto.getDbtype() == DBType.POSTGRESSQL) {
			System.out.println("dbCompareTableHeaders checking for MSSQL and Postgressql");
			String shema = "";
			String tablename = "";
			String arr[] = tableName.split("\\.", 2);
			shema = arr[0];
			tablename = arr[1];
			System.out.println("Schema name is:" + shema);
			System.out.println("Table name is:" + tablename);
			dto.setSchemaName(shema);
			if (!dbDumper.isSchemaExists()) {
				return Result.PASS()
						.setMessage("Schema name: " + dto.getSchemaName() + "  is not present in your database")
						.setOutput(false).make();
			}
		}
//		  else if(dto.getDbtype()==DBType.ORACLEDB) {
//			System.out.println("***************################checking for oracleuser");
//			  if(!dbDumper.isUserExists()) {
//					return Result.PASS().setMessage("Schema name: "+ dto.getUserName()+"  is not present in your database").setOutput(false).make();
//			  }
//		  }

		if (dto.getDbtype() == DBType.MYSQL || dto.getDbtype() == DBType.ORACLEDB || dto.getDbtype() == DBType.MSSQL
				|| dto.getDbtype() == DBType.POSTGRESSQL || dto.getDbtype() == DBType.SQLITE) {
			if (!dbDumper.isTableExists(tableName)) {
				return Result.PASS().setMessage("Table: " + tableName + " is not present in your schema or database")
						.setOutput(false).make();
			}
		}
		long rowCount = dbDumper.getTableRowCount(tableName);
		if (rowCount == 0) {
			return Result.PASS().setMessage("No record found").setOutput(false).make();
		}
		return Result.PASS().setOutput(rowCount).make();
	}

	public FunctionResult dbCompareTableHeaders(String connectionId1, String connectionId2, String tableName1,
			String tableName2) throws ArgumentDataInvalidException, SQLException, DBNotImplementedException {
		System.out.println("Inside dbCompareTableHeaders()");

		if (isStringNullOrBlank(connectionId1) || isStringNullOrBlank(connectionId2)) {
			return Result.PASS().setMessage("Argument(s): (ConnectionId1,connectionId2) is/are blank.").setOutput(false)
					.make();
		}

		DBConnectionDto dto1 = ConnectionManager.get().getDBConnection(UUID.fromString(connectionId1));
		DBConnectionDto dto2 = ConnectionManager.get().getDBConnection(UUID.fromString(connectionId2));

		DBDumper dbDumper1 = new DBDumper(dto1);
		DBDumper dbDumper2 = new DBDumper(dto2);
		if (!dbDumper1.isConnectionSuccessful()) {
			return Result.PASS().setMessage(
					"Not able to connect to database because of any/all mention reasion- HostName, UserId, Password is/are invalid (or) Server is not present on given host.")
					.setOutput("").make();
		}

		if (!dbDumper2.isConnectionSuccessful()) {
			return Result.PASS().setMessage(
					"Not able to connect to database because of any/all mention reasion- HostName, UserId, Password is/are invalid (or) Server is not present on given host.")
					.setOutput("").make();
		}

		if (dto1.getDbtype() == DBType.MYSQL) {
			if (!dbDumper1.isSchemaExists()) {
				return Result.PASS()
						.setMessage("Schema name: " + dto1.getSchemaName() + "  is not present in your database")
						.setOutput(false).make();
			}
		} else if (dto1.getDbtype() == DBType.MSSQL || dto1.getDbtype() == DBType.POSTGRESSQL) {
			System.out.println("Inside  dbCompareTableHeaders checking for MSSQL and Postgressql");
			String shema = "";
			String tablename = "";
			String arr[] = tableName1.split("\\.", 2);
			shema = arr[0];
			tablename = arr[1];
			System.out.println("Schema name is:" + shema);
			System.out.println("Table name is:" + tablename);
			dto1.setSchemaName(shema);
			if (!dbDumper1.isSchemaExists()) {
				return Result.PASS()
						.setMessage("Schema name: " + dto1.getSchemaName() + "  is not present in your database")
						.setOutput(false).make();
			}
		}

		if (dto2.getDbtype() == DBType.MYSQL) {
			if (!dbDumper2.isSchemaExists()) {
				return Result.PASS()
						.setMessage("Schema name: " + dto2.getSchemaName() + "  is not present in your database")
						.setOutput(false).make();
			}
		} else if (dto2.getDbtype() == DBType.MSSQL || dto2.getDbtype() == DBType.POSTGRESSQL) {
			System.out.println("Inside  dbCompareTableHeaders checking for MSSQL and Postgressql");
			String shema = "";
			String tablename = "";
			String arr[] = tableName2.split("\\.", 2);
			shema = arr[0];
			tablename = arr[1];
			System.out.println("Schema name is:" + shema);
			System.out.println("Table name is:" + tablename);
			dto2.setSchemaName(shema);
			if (!dbDumper2.isSchemaExists()) {
				return Result.PASS()
						.setMessage("Schema name: " + dto2.getSchemaName() + "  is not present in your database")
						.setOutput(false).make();
			}
		}

		if (isStringNullOrBlank(tableName1) || isStringNullOrBlank(tableName2)) {
			return Result.PASS().setMessage("Argument(s): (TableName1,TableName2) is/are blank.").setOutput(false)
					.make();
		}

		if (dto1.getDbtype() == DBType.MYSQL || dto1.getDbtype() == DBType.ORACLEDB || dto1.getDbtype() == DBType.MSSQL
				|| dto1.getDbtype() == DBType.POSTGRESSQL || dto1.getDbtype() == DBType.SQLITE) {
			if (!dbDumper1.isTableExists(tableName1)) {
				return Result.PASS().setMessage("Table: " + tableName1 + " is not present in your schema or database")
						.setOutput(false).make();
			}
		}

		if (dto2.getDbtype() == DBType.MYSQL || dto2.getDbtype() == DBType.ORACLEDB || dto2.getDbtype() == DBType.MSSQL
				|| dto2.getDbtype() == DBType.POSTGRESSQL || dto2.getDbtype() == DBType.SQLITE) {
			if (!dbDumper2.isTableExists(tableName2)) {
				return Result.PASS().setMessage("Table: " + tableName2 + " is not present in your schema or database")
						.setOutput(false).make();
			}
		}

		List<TableHeaderDataDto> table1headers = dbDumper1.getTableHeader(tableName1);
		List<TableHeaderDataDto> table2headers = dbDumper2.getTableHeader(tableName2);
		System.out.println("Size of table1header is: " + table1headers.size());
		System.out.println("Size of table2header is: " + table2headers.size());
		if (table1headers.size() != table2headers.size()) {
			OpkeyLogger.printLog(_class, "Table Columns match not found");
			return Result.PASS().setMessage("Table Columns match not found").setOutput(false).make();
		}
		System.out.println("checking when header is  same");

		List<String> comparisonResult = new ArrayList<String>();
		for (TableHeaderDataDto header1 : table1headers) {
			boolean found = false;
			for (TableHeaderDataDto header2 : table2headers) {
				if (header1.getColumnName().trim().equals(header2.getColumnName().trim())) {
					found = true;
					break;
				}
			}
			if (found == false) {
				comparisonResult.add(">>Column name " + header1.getColumnName() + " not found");
			}
		}

		if (comparisonResult.isEmpty() == false) {
			return Result.PASS().setMessage("Data Mismatch.").setOutput(false).make();
		}
		return Result.PASS().setOutput(true).make();
	}

	public FunctionResult dbCompareTableData(String connectionId1, String connectionId2, String tableName1,
			String tableName2) throws ArgumentDataInvalidException, SQLException, DBNotImplementedException {

		if (isStringNullOrBlank(connectionId1) || isStringNullOrBlank(connectionId2)) {
			return Result.PASS().setMessage("Argument(s): (ConnectionId1,connectionId2) is/are blank.").setOutput(false)
					.make();
		}

		List<String> comparisonResult = new ArrayList<String>();
		DBConnectionDto dto1 = ConnectionManager.get().getDBConnection(UUID.fromString(connectionId1));
		DBConnectionDto dto2 = ConnectionManager.get().getDBConnection(UUID.fromString(connectionId2));

		DBDumper dbDumper1 = new DBDumper(dto1);
		DBDumper dbDumper2 = new DBDumper(dto2);

		if (!dbDumper1.isConnectionSuccessful()) {
			return Result.PASS().setMessage(
					"Not able to connect to database because of any/all mention reasion- HostName, UserId, Password is/are invalid (or) Server is not present on given host.")
					.setOutput("").make();
		}

		if (!dbDumper2.isConnectionSuccessful()) {
			return Result.PASS().setMessage(
					"Not able to connect to database because of any/all mention reasion- HostName, UserId, Password is/are invalid (or) Server is not present on given host.")
					.setOutput("").make();
		}

		if (dto1.getDbtype() == DBType.MYSQL) {
			if (!dbDumper1.isSchemaExists()) {
				return Result.PASS()
						.setMessage("Schema name: " + dto1.getSchemaName() + "  is not present in your database")
						.setOutput(false).make();
			}
		} else if (dto1.getDbtype() == DBType.MSSQL || dto1.getDbtype() == DBType.POSTGRESSQL) {
			System.out.println("Inside  dbCompareTableHeaders checking for MSSQL and Postgressql");
			String shema = "";
			String tablename = "";
			String arr[] = tableName1.split("\\.", 2);
			shema = arr[0];
			tablename = arr[1];
			System.out.println("Schema name is:" + shema);
			System.out.println("Table name is:" + tablename);
			dto1.setSchemaName(shema);
			if (!dbDumper1.isSchemaExists()) {
				return Result.PASS()
						.setMessage("Schema name: " + dto1.getSchemaName() + "  is not present in your database")
						.setOutput(false).make();
			}
		}

		if (dto2.getDbtype() == DBType.MYSQL) {
			if (!dbDumper2.isSchemaExists()) {
				return Result.PASS()
						.setMessage("Schema name: " + dto2.getSchemaName() + "  is not present in your database")
						.setOutput(false).make();
			}
		} else if (dto2.getDbtype() == DBType.MSSQL || dto2.getDbtype() == DBType.POSTGRESSQL) {
			System.out.println("Inside  dbCompareTableHeaders checking for MSSQL and Postgressql");
			String shema = "";
			String tablename = "";
			String arr[] = tableName2.split("\\.", 2);
			shema = arr[0];
			tablename = arr[1];
			System.out.println("Schema name is:" + shema);
			System.out.println("Table name is:" + tablename);
			dto2.setSchemaName(shema);
			if (!dbDumper2.isSchemaExists()) {
				return Result.PASS()
						.setMessage("Schema name: " + dto2.getSchemaName() + "  is not present in your database")
						.setOutput(false).make();
			}
		}

		if (isStringNullOrBlank(tableName1) || isStringNullOrBlank(tableName2)) {
			return Result.PASS().setMessage("Argument(s):(TableName1,Tablename2) is/are blank.").setOutput(false)
					.make();
		}

		if (!dbDumper1.isTableExists(tableName1)) {
			return Result.PASS().setMessage("Table: " + tableName1 + " is not present in your schema or database")
					.setOutput(false).make();
		}

		if (!dbDumper2.isTableExists(tableName2)) {
			return Result.PASS().setMessage("Table: " + tableName2 + " is not present in your schema or database")
					.setOutput(false).make();
		}

		TableDataDto table1datas = dbDumper1.getAllTableDatas(tableName1);
		TableDataDto table2datas = dbDumper2.getAllTableDatas(tableName2);

		List<TableRowDataDto> table1Rows = table1datas.getTableRows();
		List<TableRowDataDto> table2Rows = table2datas.getTableRows();

		if (table1Rows.size() == 0 || table2Rows.size() == 0) {
			OpkeyLogger.printLog(_class, "No record in both table");

			return Result.PASS().setMessage("No record in both table").setOutput(false).make();
		}

		if (table1Rows.size() != table2Rows.size()) {
			comparisonResult.add("Rows Count Mismatch");
			OpkeyLogger.printLog(_class, "Rows of both table are not same");
			return Result.PASS().setMessage("Rows of both table are not same").setOutput(false).make();

		}
		if (table1datas.getTableHeaders().size() != table2datas.getTableHeaders().size()) {
			System.out.println("Columns Count Mismatch");
			comparisonResult.add("Columns Count Mismatch");
			OpkeyLogger.printLog(_class, "Column of both table are not same");
			return Result.PASS().setMessage("Column of both table are not same").setOutput(false).make();

		}

		int columnSize = table1datas.getTableHeaders().size();
		int rowSize = table1Rows.size();
		System.out.println("ColumnSize is:" + columnSize);
		System.out.println("rowSize is:" + rowSize);

		for (int row = 0; row < rowSize; row++) {
			TableRowDataDto table1Row = table1Rows.get(row);
			TableRowDataDto table2Row = table2Rows.get(row);

			for (int i = 0; i < columnSize; i++) {
				TableRowCellDataDto cell1 = table1Row.getCells().get(i);
				TableRowCellDataDto cell2 = table2Row.getCells().get(i);

//				if (cell1 == null || cell2 == null) {
//					continue;
//				}
//				if (cell1.getValue().toString() == null || cell2.getValue().toString() == null) {
//					continue;
//				}

				if (cell1 == null && cell2 == null) {
					continue;
				}

				if (cell1.getValue() == null && cell2.getValue() == null) {
					continue;
				}

				if (cell1 != null && cell2 != null && cell1.getValue() != null && cell2.getValue() != null) {
					System.out.println("index-  row : " + row + " and column " + i + " cell value from table 1:"
							+ cell1.getValue().toString());
					System.out.println("index-  row : " + row + " and column " + i + " cell value from table 2:"
							+ cell2.getValue().toString());
					if (!(cell1.getValue().toString().trim()).equals(cell2.getValue().toString().trim())) {
						System.out.println("When cell value from both the table is not equal");
						comparisonResult.add(String.format("Cell Data Mismatch Row: %s Col: %s", "" + row, "" + i));
					}
				} else {
					comparisonResult.add(String.format("Cell Data Mismatch Row: %s Col: %s", "" + row, "" + i));
				}

//				if (!(cell1.getValue().toString()).equals(cell2.getValue().toString())) {
//					System.out.println("When cell value from both the table is not equal");
//					comparisonResult.add(String.format("Cell Data Mismatch Row: %s Col: %s", "" + row, "" + i));
//				}
			}
		}

		if (comparisonResult.isEmpty() == false) {
			System.out.println("checking test cass value is false");
			return Result.PASS().setMessage("Data Mismatch.").setOutput(false).make();
		}
		return Result.PASS().setOutput(true).make();
	}

	public static boolean isStringNullOrBlank(String str) {
		if (str == null || "".equals(str.trim())) {
			return true;
		}
		return false;
	}

	public FunctionResult db_copyDataToTable(String fromConectionId, String toConnectionId, String toTableName,
			String selectQuery) throws ArgumentDataInvalidException, SQLException, DBNotImplementedException {
		
		if(isStringNullOrBlank(fromConectionId) || isStringNullOrBlank(toConnectionId) || isStringNullOrBlank(toTableName) || isStringNullOrBlank(selectQuery)) {
			return Result.PASS().setMessage("Argument(s):(fromConectionId,toConnectionId,tableName,selectQuery) is/are blank.").setOutput(false)
					.make();
		}
		
		DBConnectionDto dto1 = null;
		DBConnectionDto dto2 = null;
		try {
		 dto1 = ConnectionManager.get().getDBConnection(UUID.fromString(fromConectionId));
		 dto2 = ConnectionManager.get().getDBConnection(UUID.fromString(toConnectionId));
		}catch(Exception ex) {
			return Result.FAIL(ResultCodes.ERROR_CONNECTION_FAILURE).setOutput(false).setMessage("Argument(s):(From connection id1,To connection id2,Table Name, Query) is/are invalid").make();
		}

		DBDumper fromConnectionObject = new DBDumper(dto1);
		DBDumper toConectionObject = new DBDumper(dto2);
		
		if (!fromConnectionObject.isConnectionSuccessful()) {
			return Result.FAIL(ResultCodes.ERROR_CONNECTION_FAILURE).setOutput(false).setMessage("Not able to connect to database because of any/all mention reasion- HostName, UserId, Password is/are invalid (or) Server is not present on given host.")
					.make();

		}

		if (!toConectionObject.isConnectionSuccessful()) {
			return Result.FAIL(ResultCodes.ERROR_CONNECTION_FAILURE).setOutput(false).setMessage("Not able to connect to database because of any/all mention reasion- HostName, UserId, Password is/are invalid (or) Server is not present on given host.")
					.make();

		}
		
		 if(dto1.getDbtype()==DBType.ORACLEDB) {
				//System.out.println("***************################checking for oracleuser");
				  if(!fromConnectionObject.isUserExists()) {
						return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("User: "+ dto1.getUserName()+"  is not present in your database")
								.make();
				  }
			  }
		 if(dto2.getDbtype()==DBType.ORACLEDB) {
				//System.out.println("***************################checking for oracleuser");
				  if(!toConectionObject.isUserExists()) {
						return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("User: "+ dto2.getUserName()+"  is not present in your database")
								.make();
				  }
			  }
		
//		if (!fromConnectionObject.isTableExists(toTableName)) {
//			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Table: " + toTableName + " is not present in your schema or database").make();
//
//		}
		if (!toConectionObject.isTableExists(toTableName)) {
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Table: " + toTableName + " is not present in your schema or database").make();
		}
		
		List<TableHeaderDataDto> headersOfFirst = fromConnectionObject.getTableHeader(toTableName);
		List<TableHeaderDataDto> headersOfSecond = toConectionObject.getTableHeader(toTableName);
		
//		System.out.println("**********size of first table header"+headersOfFirst.size());
//		System.out.println("**********size of second table header"+headersOfSecond.size());

		
//		if(!headersOfFirst.size().equals(headersOfSecond.size())) {
//			return Result.FAIL(ResultCodes.ERROR_METHOD_SIGNATURE_MISMATCH).setOutput(false).setMessage("Column match not found").make();
//		}
		if(headersOfFirst.size()!=headersOfSecond.size()) {
			return Result.FAIL(ResultCodes.ERROR_METHOD_SIGNATURE_MISMATCH).setOutput(false).setMessage("Column match not found").make();
		}

		for (int i = 0; i <headersOfFirst.size(); i++) {
			TableHeaderDataDto headerDataDto1 = headersOfFirst.get(i);
			TableHeaderDataDto headerDataDto2 = headersOfSecond.get(i);
			//System.out.println("***********Comparing column name  - "+headerDataDto1.getColumnName()+" , "+headerDataDto2.getColumnName());
			if (headerDataDto1.getColumnName().equals(headerDataDto2.getColumnName())) {
				//System.out.println("***********Comparing column type  - "+headerDataDto1.getColumnType()+" , "+headerDataDto2.getColumnType());
				if (!headerDataDto1.getColumnType().equals(headerDataDto2.getColumnType())) {
					return Result.FAIL(ResultCodes.ERROR_CONFLICTING_CONFIGURATION).setOutput(false)
							.setMessage("Column data type is different").make();
				}
			} else {
				return Result.FAIL(ResultCodes.ERROR_METHOD_SIGNATURE_MISMATCH).setOutput(false)
						.setMessage("Column name is different").make();
			}
		}
			

		
		String insertQuery = "INSERT INTO %s(%s) VALUES%s";
		List<ColumnDto> columns = new ArrayList<ColumnDto>();
		List<String> columnsStr = new ArrayList<String>();
		ResultSet selectResult;
		try {
		    selectResult = fromConnectionObject.executeQuery(selectQuery);
		}catch(SQLException se){
			return Result.FAIL(ResultCodes.ERROR_ARGUMENT_DATA_INVALID).setOutput(false).setMessage("Query is invalid").make();

		}
		for (int i = 1; i <= selectResult.getMetaData().getColumnCount(); i++) {
			String columnName = selectResult.getMetaData().getColumnName(i);
			String columnDataType = selectResult.getMetaData().getColumnTypeName(i);
			if (columnName == null) {
				continue;
			}
			columns.add(new ColumnDto(columnDataType, columnName));
			columnsStr.add(columnName);
		}

		int rscount = 0;
		while (selectResult.next()) {
			StringBuilder valueQuery = new StringBuilder();
			valueQuery.append("(");
			int count = 0;
			for (ColumnDto column : columns) {
				if (count > 0) {
					valueQuery.append(", ");
				}

				String dataType = column.getDataType();
				Object value = selectResult.getObject(column.getColumnaName());
				String formattedValue = getFormatedData(dataType, value);
				valueQuery.append(formattedValue);
				count++;
			}
			valueQuery.append(")");
			String finalQuery = String.format(insertQuery, toTableName, String.join(", ", columnsStr),valueQuery.toString());
			try {
				toConectionObject.executeUpdate(finalQuery);
			}catch (SQLIntegrityConstraintViolationException conExc) {
//				conExc.printStackTrace();
//				System.out.println("**********Message is : "+conExc.getMessage());
				if(conExc.getMessage().contains("cannot insert NULL")) {
					return Result.FAIL(ResultCodes.ERROR_METHOD_SIGNATURE_MISMATCH).setMessage("Column should not be null").setOutput(false).make();
				}
				
				if(conExc.getMessage().contains("unique constraint")) {
					return Result.FAIL(ResultCodes.ERROR_METHOD_SIGNATURE_MISMATCH).setMessage("Table have Primary key").setOutput(false).make();
				}
			}
			catch (Exception e) {
				System.out.println("Unable to Execute " + finalQuery);
				e.printStackTrace();
				System.out.println("**********Message is : "+e.getMessage());
			}
			rscount++;
		}
		selectResult.close();
		return Result.PASS().setOutput(rscount).make();
	}

	private String getFormatedData(String dataType, Object data) {
		System.out.println(">>Data Type " + dataType + " <" + data + ">");
		String strValue = String.valueOf(data);
		if (data == null) {
			strValue = null;
		}
		if (strValue == null) {
			strValue = "";
		}

		if (dataType.toLowerCase().contains("date")) {
			String dateFormst = "TO_DATE('%s','YYYY-MM-DD HH24:MI:SS')";
			String[] dateArray = strValue.split("\\.");
			return String.format(dateFormst, String.valueOf(dateArray[0]));
		}

		if (dataType.toLowerCase().contains("char") || dataType.toLowerCase().contains("text")
				|| dataType.toLowerCase().contains("string") || dataType.toLowerCase().contains("time")) {
			if (data == null) {
				return "NULL";
			}
			if (strValue.trim().isEmpty()) {
				return "NULL";
			}
			return String.format("'%s'", String.valueOf(data).replaceAll("'", "''"));
		}
		if (dataType.toLowerCase().contains("int") || dataType.toLowerCase().contains("long")
				|| dataType.toLowerCase().contains("double") || dataType.toLowerCase().contains("number")) {
			if (strValue.trim().isEmpty()) {
				return "0";
			}
		}
		return String.valueOf(data);
	}
}

class ColumnDto {
	private String dataType;
	private String columnaName;

	public ColumnDto(String dataType, String columnaName) {
		super();
		this.dataType = dataType;
		this.columnaName = columnaName;
	}

	public String getDataType() {
		return dataType;
	}

	public void setDataType(String dataType) {
		this.dataType = dataType;
	}

	public String getColumnaName() {
		return columnaName;
	}

	public void setColumnaName(String columnaName) {
		this.columnaName = columnaName;
	}

}
