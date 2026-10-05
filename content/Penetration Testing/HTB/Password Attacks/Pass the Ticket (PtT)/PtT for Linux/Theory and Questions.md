
## Kerberos on Linux

- Linux machines store **Kerberos Tickets** in `ccache files` in the `/tmp` directory. By default the Kerberos ticket is stored in the environment variable `KRB5CCNAME`.
- The `KRB5CCNAME` environment variable can identify if **Kerberos tickets** are being used or the default location of the tickets has changed.
- It also has `keytab` files where Kerberos encrypted keys and credentials are present.

## `keytab` file

- `keytab` is a file containing Kerberos principals and encrypted keys (which are derived from the **Kerberos password**). 
- To use a `keytab` file, the user must have **read and write** privileges.


## `ccache` file

- A credential cache or `ccache` file holds Kerberos credentials while they remain valid, generally while the user's session lasts. Once a user authenticates to the domain, a `ccache` file is created that stores the ticket information. The path is placed in the `KRBCCNAME` environment variable.
-  Linux machines store **Kerberos Tickets** in `ccache files` in the `/tmp` directory.


## `KRB5CCNAME` 

- an environment variable that tells Kerberos where to find the active user's credentials and ticket cache

---
## Questions and Solutions


- Connect to the target machine using SSH to the port TCP/2222 and the provided credentials. Read the flag in David's home directory.
	- **`Gett1ng_Acc3$$_to_LINUX01`**

##### SSH into the Target

Using the `ssh` command to log into the target system with the given credentials and then reading the flag.

```bash
❯ ssh david@inlanefreight.htb@10.129.204.23 -p 2222
The authenticity of host '[10.129.204.23]:2222 ([10.129.204.23]:2222)' can't be established.
ED25519 key fingerprint is: SHA256:HfXWue9Dnk+UvRXP6ytrRnXKIRSijm058/zFrj/1LvY
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '[10.129.204.23]:2222' (ED25519) to the list of known hosts.
** WARNING: connection is not using a post-quantum key exchange algorithm.
** This session may be vulnerable to "store now, decrypt later" attacks.
** The server may need to be upgraded. See https://openssh.com/pq.html
david@inlanefreight.htb@10.129.204.23's password: 
Welcome to Ubuntu 20.04.5 LTS (GNU/Linux 5.4.0-128-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Mon 05 Oct 2026 06:03:10 AM UTC

  System load:  0.44               Processes:               244
  Usage of /:   26.3% of 13.70GB   Users logged in:         0
  Memory usage: 24%                IPv4 address for ens160: 172.16.1.15
  Swap usage:   0%

 * Super-optimized for small spaces - read how we shrank the memory
   footprint of MicroK8s to make it the smallest full K8s around.

   https://ubuntu.com/blog/microk8s-memory-optimisation

3 updates can be applied immediately.
To see these additional updates run: apt list --upgradable


The list of available updates is more than a week old.
To check for new updates run: sudo apt update

Last login: Tue Oct 25 13:23:44 2022 from 172.16.1.5
david@inlanefreight.htb@linux01:~$ whoami
david@inlanefreight.htb
david@inlanefreight.htb@linux01:~$ ls -la ~
total 36
drwx---r-x 3 david@inlanefreight.htb domain users@inlanefreight.htb 4096 Oct 12  2022 .
drwxr-xr-x 7 root                    root                           4096 Oct 12  2022 ..
-rw------- 1 david@inlanefreight.htb domain users@inlanefreight.htb   25 Oct 25  2022 .bash_history
-rw-r--r-- 1 david@inlanefreight.htb domain users@inlanefreight.htb  220 Oct  5  2022 .bash_logout
-rw-r--r-- 1 david@inlanefreight.htb domain users@inlanefreight.htb 3771 Oct  5  2022 .bashrc
drwx------ 3 david@inlanefreight.htb domain users@inlanefreight.htb 4096 Oct  6  2022 .cache
-rw-r--r-- 1 david@inlanefreight.htb domain users@inlanefreight.htb   27 Oct 12  2022 flag.txt
-rw-r--r-- 1 david@inlanefreight.htb domain users@inlanefreight.htb  807 Oct  5  2022 .profile
-rw------- 1 david@inlanefreight.htb domain users@inlanefreight.htb  733 Oct 12  2022 .viminfo
david@inlanefreight.htb@linux01:~$ cat ~/flag.txt
{redacted}
```


- Which group can connect to LINUX01? 
	- **asdad**


```bash
david@inlanefreight.htb@linux01:~$ ls -la /tmp
...(SNIP)...
-rw-------  1 julio@inlanefreight.htb  domain users@inlanefreight.htb 1406 Oct  5 06:10 krb5cc_647401106_HRJDux
-rw-------  1 julio@inlanefreight.htb  domain users@inlanefreight.htb 1414 Oct  5 06:10 krb5cc_647401106_lWs3XS
-rw-------  1 david@inlanefreight.htb  domain users@inlanefreight.htb 1406 Oct  5 06:03 krb5cc_647401107_FRpFUL
-rw-------  1 carlos@inlanefreight.htb domain users@inlanefreight.htb 1746 Oct  5 06:10 krb5cc_647402606
...(SNIP)...
```

```bash
david@inlanefreight.htb@linux01:~$ klist
Ticket cache: FILE:/tmp/krb5cc_647401107_FRpFUL
Default principal: david@INLANEFREIGHT.HTB

Valid starting       Expires              Service principal
10/05/2026 06:03:26  10/05/2026 16:03:26  krbtgt/INLANEFREIGHT.HTB@INLANEFREIGHT.HTB
        renew until 10/06/2026 06:03:26
```


```bash
david@inlanefreight.htb@linux01:~$ klist
Ticket cache: FILE:/tmp/krb5cc_647401107_FRpFUL
Default principal: david@INLANEFREIGHT.HTB

Valid starting       Expires              Service principal
10/05/2026 06:03:26  10/05/2026 16:03:26  krbtgt/INLANEFREIGHT.HTB@INLANEFREIGHT.HTB
        renew until 10/06/2026 06:03:26
david@inlanefreight.htb@linux01:~$ klist -k -t krb5cc_647401106_HRJDux
Keytab name: FILE:krb5cc_647401106_HRJDux
klist: Key table file 'krb5cc_647401106_HRJDux' not found while starting keytab scan
david@inlanefreight.htb@linux01:~$ klist -k -t /tmp/krb5cc_647401106_HRJDux
Keytab name: FILE:/tmp/krb5cc_647401106_HRJDux
klist: Permission denied while starting keytab scan
david@inlanefreight.htb@linux01:~$ klist -k -t /tmp/krb5cc_647401106_lWs3XS
Keytab name: FILE:/tmp/krb5cc_647401106_lWs3XS
klist: Key table file '/tmp/krb5cc_647401106_lWs3XS' not found while starting keytab scan
david@inlanefreight.htb@linux01:~$ klist -k -t /tmp/krb5cc_647401106_lWs3XS
Keytab name: FILE:/tmp/krb5cc_647401106_lWs3XS
klist: Key table file '/tmp/krb5cc_647401106_lWs3XS' not found while starting keytab scan
david@inlanefreight.htb@linux01:~$ klist -k -t /tmp/krb5cc_647401107_FRpFUL
Keytab name: FILE:/tmp/krb5cc_647401107_FRpFUL
klist: Unsupported key table format version number while starting keytab scan
david@inlanefreight.htb@linux01:~$ klist -k -t /tmp/krb5cc_647402606
Keytab name: FILE:/tmp/krb5cc_647402606
klist: Permission denied while starting keytab scan
```

