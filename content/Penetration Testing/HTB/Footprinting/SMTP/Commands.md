
## Footprinting the Service

```bash
sudo nmap -Pn -sV -sC -p25,143,110,465,587,993,995 <TARGET IP>
```


## Find Mail Server(MX) Records 

```bash
host -t MX <TARGET IP/DOMAIN>
```

**OR**

```bash
dig mx <TARGET IP/DOMAIN> | grep "MX" | grep -v ";"
```


## Connect to SMTP Server

```bash
telnet <TARGET IP> 25
```

## Enumerate SMTP Users

- Use the VRFY method (`-M VRFY`) to check each individual users in the **user wordlist** on the target server.
- `-w` is for query timeout given to the server before moving to a new user in the **user wordlist**

```bash
smtp-user-enum -M VRFY -U <USER WORDLIST> -t <TARGET IP> -w <QUERY TIMEOUT> -v
```

**OR**

- Modern SMTP servers disable the `VRFY` command to prevent easy user enumeration so security professionals use `RCPT` instead of `VRFY`.

```bash
smtp-user-enum -M RCPT -U <USER WORDLIST> -D <DOMAIN> -t <TARGET IP> -v
```


## SMTP Possible Ports

- The following are some possible ports **SMTP** can have :-

| **Port**  | **Service**                                                                |
| --------- | -------------------------------------------------------------------------- |
| `TCP/25`  | SMTP Unencrypted                                                           |
| `TCP/143` | IMAP4 Unencrypted                                                          |
| `TCP/110` | POP3 Unencrypted                                                           |
| `TCP/465` | SMTP Encrypted                                                             |
| `TCP/587` | SMTP Encrypted/[STARTTLS](https://en.wikipedia.org/wiki/Opportunistic_TLS) |
| `TCP/993` | IMAP4 Encrypted                                                            |
| `TCP/995` | POP3 Encrypted                                                             |

## SMTP Server Commands

| **Command**  | **Description**                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------ |
| `AUTH PLAIN` | AUTH is a service extension used to authenticate the client.                                     |
| `HELO`       | The client logs in with its computer name and thus starts the session.                           |
| `MAIL FROM`  | The client names the email sender.                                                               |
| `RCPT TO`    | The client names the email recipient.                                                            |
| `DATA`       | The client initiates the transmission of the email.                                              |
| `RSET`       | The client aborts the initiated transmission but keeps the connection between client and server. |
| `VRFY`       | The client checks if a mailbox is available for message transfer.                                |
| `EXPN`       | The client also checks if a mailbox is available for messaging with this command.                |
| `NOOP`       | The client requests a response from the server to prevent disconnection due to time-out.         |
| `QUIT`       | The client terminates the session.                                                               |

## End Mail Body

- First authenticate yourself to the SMTP server.
- Start the mail body using `DATA` command as mentioned in the table.
- Write your mail.
- When mail is done writing Press **Enter** and go to a complete **newline** and Press **fullstop**(`.`) and again Press **Enter**.
- `.` signifies the end of the mail body.


---
## VRFY Command

- `VRFY` Command can be used to enumerate users in the server but depending on the SMTP configuration the server might give a status code that may indicate the presence of the user even if it doesn't exist in the server.

```
VRFY <USERNAME>
```

## EXPN Command

- Similar to `VRFY` command except it will expand the distribution list, group, aliases into its individual member and email addresses.

```
EXPN <LISTNAME>
```

## RCPT TO Command

- Determines the recipient of the message. 

```
RCPT TO:<RECIPIENT NAME>
```

## SMTP Status Codes

- [SMTP Status Codes](https://serversmtp.com/smtp-error/)

---
## Cloud Enumeration

### Microsoft 365 Enumeration

#### Domain Validation Check

- `--validate` flag to instruct the tool to perform a domain validation check. It verifies whether the target domain is actively using Microsoft 365 or Azure AD services.
- `--domain <DOMAIN>` specifies the target domain name you want to check.

```bash
python3 o365spray.py --validate --domain <DOMAIN>
```

#### Enumerate Microsoft 365 Users

```bash
python3 o365spray.py --enum -U <USER WORDLIST> --domain <DOMAIN>
```

#### Password Spraying

- You must have the `PASSWORD` first to use it against each username from the `USER WORDLIST`.

```bash
python3 o365spray.py --spray -U <USER WORDLIST> -p '<PASSWORD>' --count 1 --lockout 1 --domain <DOMAIN>
```

