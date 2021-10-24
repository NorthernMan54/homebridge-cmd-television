var request = require("request");
var Service, Characteristic, VolumeCharacteristic;
const { exec } = require('child_process');

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
  this.input1cmd = config["input1cmd"];
  this.input2cmd = config["input2cmd"];

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
  this.tvService.setCharacteristic(Characteristic.ActiveIdentifier, 1);

  this.tvService
    .getCharacteristic(Characteristic.ActiveIdentifier)
    .on("set", this.setInput.bind(this, inputMap));

  this.inputHDMI1Service = createInputSource("hdmi1", "HDMI 1", 1);
  this.inputHDMI2Service = createInputSource("hdmi2", "HDMI 2", 2);

  this.tvService.addLinkedService(this.inputHDMI1Service);
  this.tvService.addLinkedService(this.inputHDMI2Service);

  this.enabledServices.push(this.tvService);
  this.enabledServices.push(this.inputHDMI1Service);
  this.enabledServices.push(this.inputHDMI2Service);
}

//set input
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
CmdTelevisionAccessory.prototype.setPowerState = function(state, callback) {
  this.log.debug("state", state);
  if (state) {
    	exec(this.oncmd);
      this.log("aangezet");
      callback();
    ;
  } else {
    exec(this.offcmd);
	  this.log("uitgezet");
      callback();
    };
  }
;

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
