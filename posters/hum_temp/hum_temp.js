var SerialPort = require("serialport");
let fetch = require("node-fetch")
let d = ""
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var serialPort = new SerialPort("/dev/ttyACM0", {
  baudRate: 9600
});
serialPort.on("open", function () {
  console.log('open');
})
serialPort.on('data', function (data) {
  d += data;
});
setInterval(() => {
  if (d.length > 0) {
    let i = d.indexOf("*")
    if (i > 0) {
      let data = d.slice(0, i)
      d = d.slice(i + 1)

      let temp = data.slice(data.indexOf("t") + 1)
      let hum = data.slice(1, data.indexOf("t"))
      fetch("https://10.8.0.1:3001/data/temp", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        referrerPolicy: 'no-referrer', body: JSON.stringify({ temp: parseFloat(temp) })
      })
      fetch("https://10.8.0.1:3001/data/hum", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        referrerPolicy: 'no-referrer', body: JSON.stringify({ hum: parseFloat(hum) })
      })
    }
  }
}, 3000)
