import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ChevronLeft } from 'lucide-react-native';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import RoomListScreen from '../screens/RoomListScreen';
import RoomDetailsScreen from '../screens/RoomDetailsScreen';
import { COLORS } from '../theme/theme';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator 
                initialRouteName="Login"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#FFF',
                        elevation: 0,
                        shadowOpacity: 0,
                        borderBottomWidth: 0,
                    },
                    headerTintColor: COLORS.textPrimary,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerBackImage: () => (
                        <ChevronLeft size={28} color={COLORS.textPrimary} style={{ marginLeft: 15 }} />
                    ),
                    headerBackButtonDisplayMode: 'minimal',
                }}
            >
                <Stack.Screen 
                    name="Login" 
                    component={LoginScreen} 
                    options={{ headerShown: false }} 
                />
                <Stack.Screen 
                    name="Dashboard" 
                    component={DashboardScreen} 
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="RoomList" 
                    component={RoomListScreen} 
                    options={{ title: 'Rooms' }}
                />
                <Stack.Screen 
                    name="RoomDetails" 
                    component={RoomDetailsScreen} 
                    options={{ title: 'Room Details' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
