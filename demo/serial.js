var serial = {};

(function() {
  'use strict';

  serial.getPorts = function() {
    return navigator.usb.getDevices().then(devices => {
      return devices.map(device => new serial.Port(device));
    });
  };

  serial.requestPort = function() {
    const filters = [
      { 'vendorId': 0x2888, 'productId': 0x0002 },
      { 'vendorId': 0x2888, 'productId': 0x0003 },
      { 'vendorId': 0x2888, 'productId': 0x0501 },
      { 'vendorId': 0x2888, 'productId': 0x0507 },
    ];
    return navigator.usb.requestDevice({ 'filters': filters }).then(
      device => new serial.Port(device)
    );
  }

  serial.Port = function(device) {
    this.device_ = device;
  };

  serial.Port.prototype.connect = function() {

    return this.device_.open()
        .then(() => {
          if (this.device_.configuration === null) {
            return this.device_.selectConfiguration(1);
          }
        })
        .then(() => {
          console.log('configuration selected');
          return this.device_.claimInterface(1);
        })
        .then(() => {
            console.log('Interface claimed');
        });
  };

  serial.Port.prototype.disconnect = function() {
        this.device_.close();
  };

  serial.Port.prototype.send = function(data) {
    return this.device_.transferOut(4, data);
  };
})();
