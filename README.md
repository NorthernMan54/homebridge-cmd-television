# Homebridge Apple TV command plugin, using pyatv to control your Apple TV

## Installation

1. install homebridge
2. install pyatv `pip3 install pyatv`
3. scan for your Apple TV devices `atvremote scan`
4. if your Apple TV is not using a fixed IP address, please take a moment and configure it to use a fixed IP address.
5. authenticate pyatv with your Apple TV, and record the credential to a file `atvremote -s 192.168.1.10 --protocol companion pair`.  Please use the IP address of your Apple TV.
6. install this plugin using: sudo npm i -g https://github.com/NorthernMan54/homebridge-cmd-television
7. configure accessory (See configuration sample)
Thats it! Now when you turn the television on or switch the input to another source it will run the command set in the config.

## Configuration

Configuration sample:

 ```
"accessories": [
  {
    "accessory": "cmd-television",
    "name": "Main Room TV",
    "oncmd": "atvremote -s 192.168.1.27 --airplay-credentials `cat ~/atv.cred` turn_on",
    "offcmd": "atvremote -s 192.168.1.27 --airplay-credentials `cat ~/atv.cred` turn_off; sleep 30; atvremote -s 192.168.1.27 --airplay-credentials `cat ~/atv.cred` turn_off",
    "pausecmd": "atvremote -s 192.168.1.27 --airplay-credentials `cat ~/atv.cred` pause",
    "playcmd": "atvremote -s 192.168.1.27 --airplay-credentials `cat ~/atv.cred` play",
    "powerstate": "atvremote -s 192.168.1.27 --airplay-credentials `cat ~/atv.cred` power_state"
    }
  ]
```
