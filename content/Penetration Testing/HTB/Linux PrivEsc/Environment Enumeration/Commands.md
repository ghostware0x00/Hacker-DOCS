
## Look for a Pattern in the Entire Linux System

- Use `regex` to find that particular **pattern**.

```bash
grep -roE '<PATTERN>' / 2>/dev/null
```

## Find Python Version

```bash
python -v # method1
locate python # method2
whatis python # method3
```


## Credential Hunting


### Use `LinPeas.sh`

- Download the script using the below command.

```bash
wget https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh 
```

- Transfer the file to the compromised machine and then execute the script.

```bash
chmod +x linpeas.sh
./linepeas.sh
```

### WordPress Enumeration for Database Passwords and Usernames

- First find out whether the `wp-config.php` which is the core config file for **WordPress** exists or not.
- After executing the command you will get the path of the `wp-config.php` so use that in `grep` to find **database** passwords. For example :- The path can look like `/var/www/html/wp-config.php`.

```bash
find / -name "wp-config.php" -type f 2>/dev/null
```

- If the config file is found then execute the below command.

```bash
grep 'DB_USER\|DB_PASSWORD' <wp-config.php ABSOLUTE PATH>
```

### Look For SSH Keys

```bash
ls ~/.ssh
```

### Checkout Config Files

- In Linux, the `/proc` directory is not a real folder on the hard drive. It is a **virtual file system** created dynamically by the Linux Kernel to show running system processes and kernel configurations. That is why `!`(NOT OPERATOR) used to exclude `/proc` folder.
- You can change the `config` keyword and add your own specific word you want to look for.

```bash
find / ! -path "*/proc/*" -iname "*config*" -type f 2>/dev/null
```

