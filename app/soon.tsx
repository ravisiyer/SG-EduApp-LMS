import React from 'react';
import { View, Text, Platform, Button, Alert, Linking } from 'react-native';
import '@/global.css';

// Web-only import outside the main component
let WaitlistComponent: React.ComponentType<any> | null = null;
if (Platform.OS === 'web') {
  try {
    // only import on web
    const { Waitlist } = require('@clerk/clerk-react');
    WaitlistComponent = Waitlist;
  } catch (e) {
    console.warn('Waitlist not available', e);
  }
}

const Page = () => {
  const handleMobileWaitlist = () => {
    Alert.alert(
      'Join the waitlist',
      'Sign ups are currently unavailable on mobile. Please visit our web waitlist to join.',
      [
        { text: 'Open Web', onPress: () => Linking.openURL('http://10.50.171.151:8081/soon') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: Platform.OS === 'web' ? undefined : 'white' }}>
      <Text style={{ fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>
        We're not yet open to the public
      </Text>
      <Text style={{ fontSize: 14, color: 'gray', textAlign: 'center', marginBottom: 20 }}>
        Please join the waitlist to get early access to the app
      </Text>

      {Platform.OS === 'web' && WaitlistComponent ? (
        <WaitlistComponent
          appearance={{ variables: { colorPrimary: '#0d6c9a' } }}
          afterJoinWaitlistUrl="/wait"
          signInUrl="/login"
        />
      ) : (
        <Button title="Join Waitlist" onPress={handleMobileWaitlist} />
      )}
    </View>
  );
};

export default Page;
