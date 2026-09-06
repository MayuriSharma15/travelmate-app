import React from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapScreen() {
  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 3.1478,   // Kuala Lumpur
          longitude: 101.6953,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={{ latitude: 3.1478, longitude: 101.6953 }}
          title="Kuala Lumpur City Center"
          description="Main area"
        />
      </MapView>
    </View>
  );
}
