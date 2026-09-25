
## Pass the Hash

- It is the type of attack where the attacker uses the hash instead of the plain text password.
- PtH attacks exploit the authentication protocol as the hash remains static throughout every session until the password is changed.


### Ways to obtain password hashes

- Dumping the local SAM database from a compromised host.
- Extracting hashes from NTDS database (`ntds.dit`) on a Domain Controller.
- Pulling the hashes from a memory (`lsass.exe`)


## Windows NTLM

- NTLM is an authentication procotol used to verify the user credentials against the NTDS database when an user tries to login to the Active Directory network.
- Nowadays, **Kerberos** has taken over the authentication part replacing NTLM although Microsoft still supports it.
#### IMPORTANT

- With NTLM, passwords stored on the server and domain controller are not "salted," which means that an adversary with a password hash can authenticate a session without knowing the original password. We call this a `Pass the Hash (PtH) Attack`.


## LSASS, NTDS, NTLM Relationship

- **LSASS** is the active memory engine that processes authentication requests; it uses the **NTLM** protocol to verify credentials against the user hashes stored permanently inside the **NTDS** database.



## UAC limits Pass the Hash for local accounts


 - UAC or User Access Control restricts or limits local user's ability to perform remote administration operations. When the registry key `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System\LocalAccountTokenFilterPolicy` is set to 0, only the local user of that system having RID 500 can execute admin related tasks. Setting it to 1 allows the other local admins as well.
