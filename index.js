var request = require("request");
var Service, Characteristic, VolumeCharacteristic;
const {
  exec
} = require('child_process');

const inputMap = {
  1: "Hdmi1",
  2: "Hdmi2",
};

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory(
    "homebridge-cmd-television",
    "cmd-television",
    CmdTelevisionAccessory
  );
};

function CmdTelevisionAccessory(log, config) {
  this.log = log;
  this.config = config;
  this.name = config["name"];
  this.oncmd = config["oncmd"];
  this.offcmd = config["offcmd"];
  this.pausecmd = config["pausecmd"];
  this.playcmd = config["playcmd"];
  this.powerstatecmd = config["powerstatecmd"];
  //  this.playpausecmd = config["playpausecmd"];

  this.enabledServices = [];

  this.isOn = false;

  this.tvService = new Service.Television(this.name, "Television");

  this.tvService.setCharacteristic(Characteristic.ConfiguredName, this.name);

  this.tvService.setCharacteristic(
    Characteristic.SleepDiscoveryMode,
    Characteristic.SleepDiscoveryMode.ALWAYS_DISCOVERABLE
  );
  this.tvService
    .getCharacteristic(Characteristic.Active)
    .on("set", this.setPowerState.bind(this))
    .on("get", this.getPowerState.bind(this))
  this.tvService.setCharacteristic(Characteristic.ActiveIdentifier, 1);

  //  this.tvService
  //    .getCharacteristic(Characteristic.ActiveIdentifier)
  //    .on("set", this.setInput.bind(this, inputMap));

  this.tvService
    .getCharacteristic(Characteristic.RemoteKey)
    .on("set", this.setKey.bind(this));

  this.tvService
    .getCharacteristic(Characteristic.TargetMediaState)
    .on("set", this.setMedia.bind(this));

  this.informationService = new Service.AccessoryInformation();

  this.informationService
    .setCharacteristic(Characteristic.Manufacturer, "NorthernMan54")
    .setCharacteristic(Characteristic.Model, "homebridge-cmd-television")
    .setCharacteristic(Characteristic.FirmwareRevision, require('./package.json').version);

  this.enabledServices.push(this.informationService);

  //  this.inputHDMI1Service = createInputSource("hdmi1", "HDMI 1", 1);
  //  this.inputHDMI2Service = createInputSource("hdmi2", "HDMI 2", 2);

  //  this.tvService.addLinkedService(this.inputHDMI1Service);
  //  this.tvService.addLinkedService(this.inputHDMI2Service);

  this.enabledServices.push(this.tvService);

  //  this.enabledServices.push(this.inputHDMI1Service);
  //  this.enabledServices.push(this.inputHDMI2Service);
}

// set input
CmdTelevisionAccessory.prototype.setInput = function(map, newValue, callback) {
  const remoteAction = map[newValue];
  if (!remoteAction) {
    callback(null);
  } else {
    callback();
    if (newValue == 1)
      this.log("naar kanaal: 1");
    exec(this.input1cmd);
    if (newValue == 2)
      this.log("naar kanaal: 2");
    exec(this.input2cmd);
  };
}

//set power status
CmdTelevisionAccessory.prototype.setKey = function(state, callback) {
  this.log("setKey", state);

  switch (state) {
    /*    case Characteristic.RemoteKey.ARROW_UP:
          yamaha.remoteCursor("Up");
          break;
        case Characteristic.RemoteKey.ARROW_DOWN:
          yamaha.remoteCursor("Down");
          break;
        case Characteristic.RemoteKey.ARROW_RIGHT:
          yamaha.remoteCursor("Right");
          break;
        case Characteristic.RemoteKey.ARROW_LEFT:
          yamaha.remoteCursor("Left");
          break;
        case Characteristic.RemoteKey.SELECT:
          yamaha.remoteCursor("Sel");
          break;
        case Characteristic.RemoteKey.BACK:
          yamaha.remoteCursor("Return");
          break;
        case Characteristic.RemoteKey.INFORMATION:
          yamaha.remoteMenu("On Screen");
          break;
    */
    case Characteristic.RemoteKey.SELECT:
      this.log("playcmd", state);
      exec(this.playcmd);
      break;
    case Characteristic.RemoteKey.PLAY_PAUSE:
      this.log("pausecmd", state);
      exec(this.pausecmd);
      break;
    default:
  }
  callback();
};

// set power status
CmdTelevisionAccessory.prototype.setMedia = function(state, callback) {
  this.log("setMedia", state);
  callback();
};

//set power status
CmdTelevisionAccessory.prototype.setPowerState = function(state, callback) {
  this.log.debug("state", state);
  if (state) {
    exec(this.oncmd);
    this.log("oncmd");
    callback();
  } else {
    exec(this.offcmd);
    this.log("offcmd");
    callback();
  }
};

CmdTelevisionAccessory.prototype.getPowerState = function(callback) {
  this.log.debug("getPowerState");

  exec(this.powerstatecmd, (error, stdout, stderr) => {
    if (error) {
      this.log(`getPowerState error: ${error}`);
      callback(error);
    } else {
      this.log.debug(`getPowerState: ${stdout}`);
      // console.error(`stderr: ${stderr}`);
      if (stdout.trim() === 'PowerState.On') {
        this.log('Characteristic On', Characteristic.Active.ACTIVE);
        callback(null, Characteristic.Active.ACTIVE);
      } else {
        this.log('Characteristic Off', Characteristic.Active.INACTIVE);
        callback(null, Characteristic.Active.INACTIVE);
      }
    }
  });
};

CmdTelevisionAccessory.prototype.getServices = function() {
  return this.enabledServices;
};

//make the input
function createInputSource(
  id,
  name,
  number,
  type = Characteristic.InputSourceType.HDMI
) {
  var input = new Service.InputSource(id, name);
  input
    .setCharacteristic(Characteristic.Identifier, number)
    .setCharacteristic(Characteristic.ConfiguredName, name)
    .setCharacteristic(
      Characteristic.IsConfigured,
      Characteristic.IsConfigured.CONFIGURED
    )
    .setCharacteristic(Characteristic.InputSourceType, type);
  return input;
}
