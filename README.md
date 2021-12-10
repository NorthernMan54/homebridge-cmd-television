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
    "powerstatecmd": "atvremote -s 192.168.1.27 --airplay-credentials `cat ~/atv.cred` power_state"
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
