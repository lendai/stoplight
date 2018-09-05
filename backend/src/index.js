const { GraphQLServer } = require('graphql-yoga')
const lights = require('./lights')
const randomInt = require('random-int');

const minWait = 5 * 60
const maxWait = 15 * 60

const getTimeout = () => randomInt(minWait, maxWait)

const global = {
  timeUntilGreen: getTimeout(),
  greenOn: false,
  redOn: false,
}

function turnGreen() {
  global.timeUntilGreen = -1

  // Turn off all lights
  lights.turnOffRed()
  global.redOn = false

  lights.turnOnGreen()
  global.greenOn = true
}

function initLights() {
  // Turn off all lights
  lights.turnOffRed()
  lights.turnOffGreen()

  // Turn on red light
  lights.turnOnRed()
  global.redOn = true
}

function loop() {
  setInterval(() => {
    if (global.timeUntilGreen < 1 && !global.greenOn) {
      // Countdown has reached zero, turn on the green light!

      global.redOn = false
      lights.turnOffRed()

      global.greenOn = true
      lights.turnOnGreen()
    }

    console.log('tick')
    global.timeUntilGreen--
    console.log(global.timeUntilGreen)
  }, 1000)
}

function resetCountdown(_time) {
  const time = _time ? _time : getTimeout()
  global.timeUntilGreen = time

  global.greenOn = false
  lights.turnOffGreen()
  
  global.redOn = true
  lights.turnOnRed()

  return time
}

const typeDefs = `
  type Query {
    timeUntilGreen: Int

    greenLightOn: Boolean
    redLightOn: Boolean
  }

  type Mutation {
    resetCountdown(time: Int): Int
    turnGreen: Boolean
  }
`

const resolvers = {
  Query: {
    // hello: (_, args) => `Hello ${args.name || 'World'}!`,

    greenLightOn: () => {
      return global.greenOn
    },

    redLightOn: () => {
      return global.redOn
    },

    timeUntilGreen: () => { 
      return global.timeUntilGreen
    }
  },

  Mutation: {
    resetCountdown: (_, { time }) => {
      return resetCountdown(time)
    },
    turnGreen: () => {
      turnGreen()
      return true
    }
  }
}

const server = new GraphQLServer({ typeDefs, resolvers })
server.start({
  port: 8981
}, () => {
  console.log(`Server is running at http://localhost:8981`)
  console.log('Initiating countdown loop')
  initLights()
  loop()
})
