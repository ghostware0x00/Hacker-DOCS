
## Tunnelling

- This technique is used to wrap your raw network traffic or custom payload or exploit with legitimate protocols like (SSH, ICMP, SOCKS) ...etc... so that it can be passed through restrictive firewalls or IDS/IPS filters without raising alarms.

---
## Questions and Solutions

- Which IP address assigned to the Ubuntu server Pivot host allows communication with the Windows server target? (Format: x.x.x.x)
	- **172.16.5.129**

`SSH to 10.129.247.188 (ACADEMY-PIVOTING-LINUXPIV), with user "ubuntu" and password "HTB_@cademy_stdnt!"`

### IP assigned to Pivot Machine

```bash
ubuntu@WEB01:~$ ifconfig
ens192: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 10.129.247.188  netmask 255.255.0.0  broadcast 10.129.255.255
        inet6 dead:beef::250:56ff:fe8a:28c4  prefixlen 64  scopeid 0x0<global>
        inet6 fe80::250:56ff:fe8a:28c4  prefixlen 64  scopeid 0x20<link>
        ether 00:50:56:8a:28:c4  txqueuelen 1000  (Ethernet)
        RX packets 1118  bytes 97656 (97.6 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 254  bytes 23304 (23.3 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

ens224: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.16.5.129  netmask 255.255.254.0  broadcast 172.16.5.255
        inet6 fe80::250:56ff:fe8a:ff1f  prefixlen 64  scopeid 0x20<link>
        ether 00:50:56:8a:ff:1f  txqueuelen 1000  (Ethernet)
        RX packets 171  bytes 13497 (13.4 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 130  bytes 8917 (8.9 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 576  bytes 45488 (45.4 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 576  bytes 45488 (45.4 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```


- What IP address is used on the attack host to ensure the handler is listening on all IP addresses assigned to the host? (Format: x.x.x.x)
	- **0.0.0.0**


