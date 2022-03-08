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

## Using with a Synology Docker Installation

Homebridge can be installed on Synology NAS devices, via a Docker container.

When using this plugin with a Synology installation, installation requires additional and altered steps.

Notably, the Synology container only persists the /homebridge path. In order for this plugin to persist across container restarts, it and its dependencies will need to be installed to this path. In turn, two items in the default container configuration must also be changed.


## Altered Synology Installation Instructions

First, stop the Homebridge container on the Synology if it is already running. Launch the "Docker" application, and switch to the "Container" page. Power off the container.

Once stopped, edit the Homebridge container. Switch to the "Environment" tab. Modify the "PATH" variable to append an aditional directory at the end: /homebridge/python/bin. Then, add a new variable: "PYTHONPATH"; its value should be /homebridge/python. Power the container on again.

Once the container is running, navigate and log in to the Homebridge UI. Launch a Homebridge Terminal from the upper-right drop-down menu. Then, run the following commands:

```
mkdir /homebridge/python
apk add gcc openssh python3-dev rust
pip3 install --upgrade pip
pip3 install --target /homebridge/python cryptography
pip3 install --target /homebridge/python pyatv
npm config set ssl-strict=false
npm i --prefix /homebridge https://github.com/NorthernMan54/homebridge-cmd-television
```

Voila! homebridge-cmd-television and its dependencies are now installed in /homebridge, and should persist through container restarts.

**You can now create a configuration and credentials file by following the instructions in the "Installation" section above**. Make sure they are placed inside /homebridge.
