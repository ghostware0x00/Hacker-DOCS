
## Port Forwarding

- Port Forwarding is a technique that allows us to redirect a communication request from one port to another. 
- Port forwarding uses TCP as primary means of communication to provide interactive communication for the forwarded port.


#### Example Scenario

![port forwarding](content/Penetration%20Testing/HTB/Pivot%20Tunnel%20Port%20Forword/SSH%20Port%20Forwarding/Images/img1.png)

- Here the Victim Server's MYSQL database is not accessible from outside network. Like the one from the Attack Host.
- The SSH service of the Victim Server accepts connection from any devices outside at port 22. 
- The Attack Host communicates with the SSH server and tells it to redirect the data sent to 22 at port 3306.
- The SSH service redirects the data sent to port 22 to port 3306 and the SQL database executes it. Since the data is sent locally so it bypasses the firewall and the firewall doesn't block the incoming data packets.
- The Attack Host can sent malicious commands and perform port forwarding to redirect the data sent to port 22 to port 3306 because of this and then execute that payload on the Victim Server's MYSQL database.


## Proxy

- An intermediary computer or software that sits between your device and the internet. 
- It forwards your web requests, hides your real IP address from websites, and can filter, cache, or control data flow.

## SOCKS

- A network protocol that routes internet traffic between client and server through a proxy server.
- Your connection requests doesn't go directly to the destination, rather via the SOCKS server.
- The SOCKS is a low level general purpose proxy that handles any type of network protocol(**TCP/UDP/FTP/SMTP ...etc..**.) without inspecting the payload.


---
## Questions and Solutions


