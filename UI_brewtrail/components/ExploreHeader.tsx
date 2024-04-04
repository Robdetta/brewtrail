import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const ExploreHeader = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <View style={styles.container}></View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});
export default ExploreHeader;
