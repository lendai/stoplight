const chalk = require('chalk');
const { LiveApi } = require('telldus-api');

const config = require('../config')

const api = new LiveApi({
  key: config.key,
  secret: config.secret,
  tokenKey: config.tokenKey,
  tokenSecret: config.tokenSecret,
});

const deviceKeywords = {
  red: config.redLampKeyword,
  green: config.greenLampKeyword
}

let colorIds = {
  green: undefined,
  red: undefined
}

const registerColor = (devices, color) => {
  const device = devices.find(device => device.name.includes(deviceKeywords[color]))
  if (device) { colorIds[color] = device["id"]}
  if (!colorIds[color]) {
    console.log(chalk.blue(`Telldus Red lamp not found. Add keyword \"${color}\" to the name of a lamp`))
  }
}

const getLightId = async (color) => {
  if (colorIds[color]) { return colorIds[color] }

  const devices = await api.listDevices();
  registerColor(devices, 'red')
  registerColor(devices, 'green')

  return colorIds[color]
}

const onOffLight = async (color, onOff) => {
  const res = await api.onOffDevice(await getLightId(color), onOff);
  const onOffWithColor = onOff ? chalk.green('ON') : chalk.red('OFF')
  if (res['status'] === 'success') {
    console.log(chalk.green(color) + ' light is turned ' + onOffWithColor)
  } else {
    console.log(chalk.green(color) + ' DID NOT TURN ' + onOffWithColor)
  }
}

exports.turnOnGreen = async () => {
  await onOffLight('green', true)
}

exports.turnOffGreen = async () => {
  await onOffLight('green', false)
}

exports.turnOnRed = async () => {
  await onOffLight('red', true)
}

exports.turnOffRed = async () => {
  await onOffLight('red', false)
}
