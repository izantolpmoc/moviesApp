import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import MoviesList from './MoviesList';
import AddMovie from './AddMovie';

export default function App() {
  const Stack = createNativeStackNavigator();
  
  return (
    <NavigationContainer>
      
      <Stack.Navigator initialRouteName="MoviesList">
        {/* <Stack.Screen name={'MoviesList'} options={{title: "Movies List"}} component={MoviesList} /> */}
        <Stack.Screen
        name={'MoviesList'}
        component={MoviesList}
        options={{
          title: "Movies List",
          headerRight: () => {
            const navigation = useNavigation();
            return (
              <Button
                onPress={() => navigation.navigate("AddMovie")}
                title="Add movie"
                color="#000"
              />
            );
          },
        }}
      />
        <Stack.Screen name={'AddMovie'} component={AddMovie} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
