# Homebridge Apple TV command plugin, using pyatv to control your Apple TV

## Installation

1. Install homebridge
2. Install pyatv `pip3 install pyatv`
3. Scan for your Apple TV devices `atvremote scan`
4. Authenticate pyatv with your Apple TV, and record the companion credential to a file `atvremote -s 192.168.1.10 --protocol companion pair`.  Please use the IP address of your Apple TV, and put the output into this file ~/.homebridge/atv_companion.cred
5. Authenticate pyatv with your Apple TV, and record the airplay credential to a file `atvremote -s 192.168.1.10 --protocol airplay pair`.  Please use the IP address of your Apple TV, and put the output into this file ~/.homebridge/atv_airplay.cred
6. Install this plugin using: sudo npm i -g https://github.com/NorthernMan54/homebridge-cmd-television
7. Configure accessory (See configuration sample)
Thats it! Now when you turn the television on or switch the input to another source it will run the command set in the config.

## Configuration

Configuration sample:

 ```
"accessories": [
  {
    "accessory": "cmd-television",
    "name": "Main Room TV",
    "oncmd": "atvremote --id 08:66:98:D4:CF:79 --airplay-credentials `cat ~/.homebridge/atv_airplay.cred` --companion-credentials `cat ~/.homebridge/atv_companion.cred` turn_on",
    "offcmd": "atvremote --id 08:66:98:D4:CF:79 --airplay-credentials `cat ~/.homebridge/atv_airplay.cred` --companion-credentials `cat ~/.homebridge/atv_companion.cred` turn_off",
    "pausecmd": "atvremote --id 08:66:98:D4:CF:79 --airplay-credentials `cat ~/.homebridge/atv_airplay.cred` --companion-credentials `cat ~/.homebridge/atv_companion.cred` pause",
    "playcmd": "atvremote --id 08:66:98:D4:CF:79 --airplay-credentials `cat ~/.homebridge/atv_airplay.cred` --companion-credentials `cat ~/.homebridge/atv_companion.cred` play",
    "powerstatecmd": "atvremote --id 08:66:98:D4:CF:79 --airplay-credentials `cat ~/.homebridge/atv_airplay.cred` --companion-credentials `cat ~/.homebridge/atv_companion.cred` power_state"
  }
]
```

## Installing in Homebridge Synology docker container

I'm running the Homebridge Synology docker container, and can offer a few tips to those doing the same. (One is that you can launch a Terminal in the container from the Homebridge UI!)

But first, if anyone has issues where the "npm i" command to install the plugin from git insists on using ssh, despite git configuration overrides, this solved my issue; it no longer insisted on using ssh for cloning.

```
npm config set ssl-strict=false
```

As for the rest of it, here are the commands I ran. (I assume you can combine apk packages into one command)
# Ran inside the homebridge container on the synology (via web console)

```
apk add gcc openssh python3-dev rust
pip3 install --upgrade pip
# pip3 install wheel ## can't recall if this was required or not
pip3 install cryptography
pip3 install pyatv
atvremote scan
atvremote -s --protocol companion pair
npm config set ssl-strict=false
npm i -g https://github.com/NorthernMan54/homebridge-cmd-television
```

I am experiencing a strange error where my TV turns on ~30 seconds after I turn it off sometimes, but I don't see anything in the Homebridge debug logs, so I will assume it's something else for the moment!

Tks to @justinmm2
