import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

// Mock Venues
const venues = [
    { id: '1', name: 'Elite Sports Arena', price: '₹1200/hr', image: 'https://picsum.photos/seed/elite/800/600' },
    { id: '2', name: 'Greenfields Cricket', price: '₹2500/hr', image: 'https://picsum.photos/seed/cricket/800/600' }
];

function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TurfOS</Text>
      <FlatList
        data={venues}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
            <TouchableOpacity 
                style={styles.card} 
                onPress={() => navigation.navigate('VenueDetail', { id: item.id })}
            >
                <Image source={{ uri: item.image }} style={styles.image} accessibilityLabel={item.name} alt={item.name} />
                <View style={styles.cardContent}>
                    <Text style={styles.venueName}>{item.name}</Text>
                    <Text style={styles.venuePrice}>{item.price}</Text>
                </View>
            </TouchableOpacity>
        )}
      />
      <StatusBar style="light" />
    </View>
  );
}

function VenueDetailScreen({ route }: any) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Slot Booking (Socket.io)</Text>
            <Text style={styles.subtitle}>Venue ID: {route.params.id}</Text>
            {/* Real app uses Socket.io here to connect to Next.js server */}
             <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Book Select Slot</Text>
            </TouchableOpacity>
        </View>
    );
}

export default function App() {
  return (
    <NavigationContainer theme={{ colors: { background: '#0B0F1A' } } as any}>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#0B0F1A' }, headerTintColor: '#fff' }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Discover Venues' }} />
        <Stack.Screen name="VenueDetail" component={VenueDetailScreen} options={{ title: 'Book Slot' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F1A',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  subtitle: {
    color: '#aaa',
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 180,
  },
  cardContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  venueName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  venuePrice: {
    color: '#3B82F6',
    fontWeight: 'bold',
  },
  button: {
      backgroundColor: '#3B82F6',
      padding: 16,
      borderRadius: 100,
      alignItems: 'center',
      marginTop: 'auto',
      marginBottom: 30
  },
  buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16
  }
});
