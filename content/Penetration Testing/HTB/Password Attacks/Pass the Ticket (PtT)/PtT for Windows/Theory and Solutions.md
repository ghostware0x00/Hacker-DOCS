
## Pass the Ticket (PtT)

- We learnt previously about the Pass the Hash (PtT) attack  but now we are going to learn about one more lateral movement technique for Active Directory which is Pass the Ticket.
- In Pass the Ticket (PtT) instead of an NTLM password hash, we use **kerberos ticket** to move laterally through the Active Directory network.


## Kerberos Protocol

- Kerberos authentication is ticket based.
- The central idea of this protocol is to not give the password to every service you use. Instead it keeps tickets of services you use and only presents that particular ticket when you require it, preventing a ticket from being used for something else.

### TGT and TGS

- The `Ticket Granting Ticket` (`TGT`) is the first ticket obtained on a Kerberos system. The TGT permits the client to obtain additional Kerberos tickets or `TGS`.
- The `Ticket Granting Service` (`TGS`) is requested by users who want to use a service. These tickets allow services to verify the user's identity.


## Requirements to Perform PtT Attacks

- We need a valid **Kerberos ticket** to perform `Pass the Ticket (PtT)`. It can be :-
	- Service Ticket (TGS) to allow access to a particular service or resource.
	- Ticket Granting Ticket (TGT) which we use to request service tickets to allow any resource the user privileges allow.



