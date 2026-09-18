
## Active Directory

- Its a network which is used to manage Windows systems.
- Once a machine gets connected to the active directory network it will ask the domain controller inside the network for authentication instead of using the SAM Database for authentication purposes.


## NTDS

- `NTDS.dit` is a database file which stores Active Directory data. This data consists of the following stuff and more :-
	- user accounts (usernames and password hashes)
	- group accounts
	- computer accounts
	- group policy objects
- This `NTDS` is maintained by a Domain Controller in the Windows Domain network which is responsible to main authorization and authentication in this network. It controls the Active Directory forest. Each domain controller has a `NTDS.dit` file which is synchronized across all Domain Controllers. 