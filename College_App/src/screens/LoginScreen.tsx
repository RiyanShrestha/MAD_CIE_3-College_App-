import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert, Image } from 'react-native';
import { Mail, Lock, LogIn } from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';
import { CustomButton, CustomInput } from '../components/Common';

interface LoginErrors {
    email?: string;
    password?: string;
}

const LoginScreen = ({ navigation }: { navigation: any }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<LoginErrors>({});

    const validate = () => {
        let valid = true;
        let newErrors: LoginErrors = {};

        if (!email) {
            newErrors.email = 'Email is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email';
            valid = false;
        }

        if (!password) {
            newErrors.password = 'Password is required';
            valid = false;
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleLogin = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            // Demo Login Logic (Connect to Backend later)
            // Replace with actual API call: 
            // const res = await axios.post('/api/auth/login', { email, password });
            
            setTimeout(() => {
                setLoading(false);
                // Bypassed login criteria for development
                navigation.replace('Dashboard');
            }, 1000);
        } catch (error) {
            setLoading(false);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <Image 
                                source={require('../assets/logo.png')} 
                                style={{ width: 60, height: 60, resizeMode: 'contain' }} 
                            />
                        </View>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Sign in to manage your room bookings</Text>
                    </View>

                    <View style={styles.formCard}>
                        <CustomInput 
                            label="Email Address"
                            placeholder="example@rvu.edu.in"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                if (errors.email) {
                                    const nextErrors = { ...errors };
                                    delete nextErrors.email;
                                    setErrors(nextErrors);
                                }
                            }}
                            icon={Mail}
                            error={errors.email}
                        />

                        <CustomInput 
                            label="Password"
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                if (errors.password) {
                                    const nextErrors = { ...errors };
                                    delete nextErrors.password;
                                    setErrors(nextErrors);
                                }
                            }}
                            icon={Lock}
                            secureTextEntry={true}
                            error={errors.password}
                        />

                        <TouchableOpacity style={styles.forgotPassword}>
                            <Text style={styles.forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        <CustomButton 
                            title="Login"
                            onPress={handleLogin}
                            loading={loading}
                            style={styles.loginBtn}
                        />

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account? </Text>
                            <TouchableOpacity>
                                <Text style={styles.signUpText}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 25,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        width: 80,
        height: 80,
        backgroundColor: '#FFF',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        ...SHADOWS.medium,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    formCard: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 20,
        padding: 25,
        ...SHADOWS.medium,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    forgotText: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    loginBtn: {
        marginTop: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25,
    },
    footerText: {
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    signUpText: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default LoginScreen;
