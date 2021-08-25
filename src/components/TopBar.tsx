import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { ToggleIcon } from '.';
import { checkSource } from './utils';

const backgroundColor = 'transparent';

const styles = StyleSheet.create({
  back: {
    height: 28,
    width: 28,
  },
  backBtn: {
    paddingLeft: 25,
    paddingRight: 15,
  },
  container: {
    height: 60,
    justifyContent: 'center',
  },
  logo: {
    height: 25,
    marginLeft: 5,
    width: 25,
  },
  row: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  title: {
    backgroundColor,
    flex: 1,
    fontSize: 28,
    lineHeight: 32,
    paddingLeft: 10,
    paddingRight: 35,
  },
});

export type TopBarTheme = {
  title?: string;
  more?: string;
};

type TopBarProps = {
  title: string;
  logo?: string;
  more: boolean;
  onMorePress: () => void;
  onBackPress: () => void;
  theme: TopBarTheme;
};

const TopBar = (props: TopBarProps) => {
  const { logo, more, title, theme, onMorePress, onBackPress } = props;
  return (
    <LinearGradient
      colors={['rgba(0,0,0,0.75)', 'rgba(0,0,0,0)']}
      style={styles.container}
    >
      <View style={styles.row}>
        <TouchableOpacity style={styles.backBtn} onPress={() => onBackPress()}>
          <Image style={styles.back} source={require('./assets/Back.png')} />
        </TouchableOpacity>
        {logo && (
          <Image
            style={styles.logo}
            resizeMode="contain"
            {...checkSource(logo)}
          />
        )}
        <Text
          style={[styles.title, { color: theme.title }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
        {more && (
          <ToggleIcon
            // style={styles.more}
            onPress={() => onMorePress()}
            paddingRight
            iconOff="more-horiz"
            iconOn="more-horiz"
            theme={theme.more}
            size={25}
          />
        )}
      </View>
    </LinearGradient>
  );
};

export { TopBar };
