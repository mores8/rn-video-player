import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const backgroundColor = 'transparent';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor,
    justifyContent: 'center',
    minWidth: 60,
    padding: 10,
  },
});

type TimeProps = {
  time: number;
  theme: string;
  mode: 'second' | 'minute';
};

function addZeros(time: number) {
  return time < 10 ? `0${time}` : time;
}

function getTime(time: number, mode: 'second' | 'minute') {
  // format the seconds saved into 00:00:00
  const secs = time % 60;
  const s2 = (time - secs) / 60;
  const mins = s2 % 60;
  const hrs = ((s2 - mins) / 60) % 24;
  const hours =
    addZeros(hrs) > 0 ? `${addZeros(hrs)}:` : mode === 'minute' ? '00:' : '';
  if (mode === 'second') {
    return `${hours}${addZeros(mins)}:${addZeros(secs)}`;
  }
  return `${hours}${addZeros(mins)}`;
}

class Time extends Component<TimeProps> {
  static defaultProps = {
    mode: 'second',
  };
  render() {
    return (
      <View style={styles.container}>
        <Text style={{ color: this.props.theme, fontSize: 17 }}>
          {getTime(Math.floor(this.props.time), this.props.mode)}
        </Text>
      </View>
    );
  }
}

export { Time };
