import * as React from 'react';
import { Text } from 'react-native';

export default (props: React.ComponentProps<typeof Text>) => {
  const incomingStyle = Array.isArray(props.style) ? props.style : [props.style];
  const classNames = props.className?.split(' ') || [];
  return <Text {...props} className={`font-phantom ${classNames.join(' ')}`} style={[...incomingStyle]} />;
};