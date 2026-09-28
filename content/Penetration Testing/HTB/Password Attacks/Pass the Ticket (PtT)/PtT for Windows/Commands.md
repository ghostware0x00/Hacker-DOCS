## Requirements to Perform PtT Attacks

- We need a valid **Kerberos ticket** to perform `Pass the Ticket (PtT)`. It can be :-
	- Service Ticket (TGS) to allow access to a particular service or resource.
	- Ticket Granting Ticket (TGT) which we use to request service tickets to allow any resource the user privileges allow.


## 1. Harvesting Kerberos tickets from Windows

- Tickets are processed and stored by the LSASS. Therefore to get a ticket we must communicate with the LSASS and request it.
- As a non administrator user you only get your own tickets but as an administrator you get everything.
- means copying active, pre-authorized Kerberos ticket files (**TGTs and TGSs**) out of LSASS memory. These are temporary `.kirbi` files that allow you to impersonate a user immediately, but they naturally expire within a few hours.

## Exporting Tickets 

### using `mimikatz`

- Tickets ending with `$` correspond to an computer account which needs a ticket to interact with the Active Directory. 
- User tickets have the user's name, followed by an `@` that separates the service domain for example `[randomvalue]-username@service-domain.local.kirbi`.

```mimikatz
privilege::debug
sekurlsa::tickets /export
```

## using `Robeus`

```cmd
Rubeus.exe dump /nowrap
```

**Note:** To collect all tickets we need to execute Mimikatz or Rubeus as an administrator.

---
## Pass the Ticket (PtT) Attack Procedure

#### STEP 1 : Extracting Kerberos Keys (`mimikatz`)

-  means pulling a user's long-term cryptographic credentials (**AES-256, AES-128, or NTLM hashes**) out of memory. These keys never expire on their own—they remain completely valid for as long as the user keeps their current password.

```mimikatz
privilege::debug
sekurlsa::ekeys
```

#### STEP 2: Pass the Key 

- is an **active execution action** (also known as Overpass-the-Hash). You take a key that you previously extracted (or cracked) and supply it to Mimikatz to create a brand-new, authenticated logon session on your machine without knowing the actual plaintext password.

##### via `mimikatz`

- This will create a new `cmd.exe` window that we can use to request access to any service we want in the context of the target user.

```mimikatz
sekurlsa::pth /domain:<DOMAIN_NAME> /user:<USERNAME> /ntlm:<HASH>
```

**OR**
##### via `Rubeus`

- `KEY` is the key extracted during the **Extracting Kerberos Keys** phase.

```cmd
Rubeus.exe asktgt /domain:<DOMAIN_NAME> /user:<USERNAME> /<KEY> /nowrap
```


**Note:** Mimikatz requires administrative rights to perform the Pass the Key/OverPass the Hash attacks, while Rubeus doesn't.

#### STEP 3: Pass the Ticket (PtT)

```
```



