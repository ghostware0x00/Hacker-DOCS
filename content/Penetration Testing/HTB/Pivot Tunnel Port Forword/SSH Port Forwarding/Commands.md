
## Port Forwarding


### using SSH as Pivot

- **SCENARIO :**
	- Lets say you want to access the SQL database of the victim machine but its hosted locally and hence you cannot access it directly so you use the SSH service and perform port forwarding to redirect your data to the SQL database. First you scan the target for open ports on SSH and SQL and then start the port forwarding attack.


### 1. Scanning the Pivot Target

```bash
nmap -sT -p22,3306 <TARGET IP>
```

### 2. Executing the Local Port Forward

- For example: if we send data from attacker's port `1234` to SSH port `22` it will get redirected to Victim Machine's database hosted locally at port `3306`.
- The `ATTACKER PORT` you need to choose 
- The `VICTIM PORT` you need to choose based on the SQL open port you get.

```bash
ssh -L <ATTACKER PORT>:localhost:<VICTIM PORT> <VICTIM USERNAME>@<TARGET_IP>
```

**OR**

- This is to **port forward** to multiple ports.

```bash
ssh -L <ATTACKER PORT1>:localhost:<VICTIM PORT1> <ATTACKER PORT2>:localhost<VICTIM PORT2> ... <VICTIM USERNAME>@<TARGET IP>
```


### 3. Confirming Port Forward

#### `netstat` method

```bash
netstat -antp | grep <ATTACKER PORT>
```

**OR**

#### `nmap` method

```bash
nmap -v -sV -p<ATTACKER PORT> localhost
```


---
## Dynamic Port Forwarding


### using SSH SOCKS Proxy paired with Proxychains

- **WORKFLOW :**
	1. **The Request :**
		- We run the `nmap` tool through a program called `proxychains`.
	2. **The Local Catch :**
		- `proxychains` catches `nmap`'s traffic and drops it off at a local port in the attacker machine where the attacker is listening. `proxychains` is basically intercepting the commands and formatting them into the SOCKS proxy format and then pushing that data into the `<ATTACKER PORT specified>`. This port acts as a **gateway** for routing various commands to the Victim Server's SSH.
	3. **The Travel :**
		- The attacker's SSH client grabs whatever is in port `<ATTACKER PORT specified>`, packages it and sends through an encrypted channel to the **Victim Server** on port `22` for example.
	4. **The Distribution :**
		- The Victim Server opens the package, looks at the final destination and sends the data to any internal IP:PORT or machine in the internal network.

### 1. Enabling Dynamic Port Forwarding with SSH

- This `<ATTACKER PORT>` will act as the **gateway** to route the data to the Victim Machine's SSH.
- To find the `<ATTACKER PORT>` checkout the `/etc/proxychains.conf`. There, the **port** will be mentioned in the `socks` line...

```bash
ssh -D <ATTACKER PORT> <VICTIM USERNAME>@<TARGET IP>
```

### Using `nmap` with Proxychains

- This part of packaging all the `nmap` data using `proxychains` and forwarding into the remote server is called **SOCKS TUNNELLING**, 
- We can only perform **FULL TCP CONNECT SCAN** using `proxychains` because `proxychains` cannot understand partial packets and Windows Defender Firewall blocks traditional ICMP echo (ping request) by default.

```bash
proxychains nmap -v -sn <TARGET IP>/<IP RANGE>
```

### Using `xfreerdp` with Proxychains

```bash
proxychains xfreerdp /v:<TARGET IP> /u:<USERNAME> /p:<PASSWORD>
```








