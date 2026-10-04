
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