import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CLIENT_ID } from '@env';

import {
  makeRedirectUri,
  useAuthRequest,
  ResponseType,
} from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const Page = () => {
  // Initialize the request
  const [userInfo, setUserInfo] = React.useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: CLIENT_ID,
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile</Text>
      <Button
        disabled={!request}
        title='Login with Google'
        onPress={() => {
          promptAsync();
        }}
      />
    </View>
  );
};

export default Page;
