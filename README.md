# Homebridge television command plugin

## Installation

1. install homebridge
2. install my plugin using: sudo npm i -g homebridge-cmd-television
3. configure accesory (See configuration sample)
Thats it! Now when you turn the television on or switch the input to another source it will run the command set in the config.

## Configuration

Configuration sample:

 ```
"accessories": [{
{
   			"accessory": "cmd-television",
   			"name": "Televison",
   			"oncmd": "bash tvon.sh", <- this is the command that gets executed by linux when you turn the tv on with you're phone.
   			"offcmd": "bash tvoff.sh", <- this is the command that gets executed by linux when you turn the tv on with you're phone.
   			"input1cmd": "bash tvhdmi1.sh", <- this is the command that gets executed by linux when you switch the source with you're phone.
   			"input2cmd": "bash tvhdmi2.sh" <- this is the command that gets executed by linux when you switch the source with you're phone.
}
    ]
```

Warning do not install using git clone and moving the folder to youre node_modules dir. This will break the plugin.
