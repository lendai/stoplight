import React, { Component } from 'react';
import './App.css';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";

const secondsToString = seconds => {
  const minutes = Math.floor(seconds / 60)
  const secLeft = seconds % 60

  if (minutes > 0) return `${minutes}m ${secLeft}s`

  return `${secLeft}s`
}

const client = new ApolloClient({
  uri: "http://localhost:8981/"
})

const lightStatusQuery = gql`
  query LightStatus {
    timeUntilGreen
    greenLightOn
    redLightOn
  }
`

const resetCountDownMutation = gql`
  mutation {
    resetCountdown
  }
`

const turnGreenMutation = gql`
  mutation {
    turnGreen
  }
`

const OnOrOff = ({ isOn }) => {
  return (
    <span style={{  marginLeft: '10px', fontSize: '24px' }}>
      {isOn ? '💡' : '⚫'}
    </span>
  )
}

const LightStatus = props => (
  <Query query={lightStatusQuery} pollInterval={500}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;
            
      return (
        <div className="container" style={{ maxWidth: '400px', textAlign: 'left' }}>
          <h3>Light status</h3>

          <p>
            <span style={{ color: 'red' }}>Red</span> light: 
            <OnOrOff isOn={data.redLightOn} />
          </p>
          <p>
            <span style={{ color: 'green' }}>Green</span> light:
            <OnOrOff isOn={data.greenLightOn} />
          </p>

          <p>Time until green: {secondsToString(data.timeUntilGreen)}</p>
          <br />
          <br />
          <button disabled={data.greenLightOn} type="button" className="btn btn-success btn-block" onClick={props.onTurnGreen}>Turn green NOW</button>
          <br />
          <button type="button" className="btn btn-primary btn-block" onClick={props.onReset}>Reset countdown</button>
        </div>
      )
    }}
  </Query>
);

const LightController = () => (
  <Mutation mutation={turnGreenMutation}>
    {(onTurnGreen, _) => (
      <Mutation mutation={resetCountDownMutation}>
        {(onReset, _) => (
          <LightStatus onTurnGreen={() => { onTurnGreen() }}
            onReset={() => { onReset() }} />
        )}
      </Mutation>
    )}
  </Mutation>
)

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">

          <LightController />
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
