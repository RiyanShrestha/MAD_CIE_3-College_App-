import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, TextInput, ActivityIndicator } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';

interface CustomButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    style?: any;
    color?: string;
}

export const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, loading, style, color = COLORS.primary }) => (
    <TouchableOpacity 
        style={[styles.button, { backgroundColor: color }, style]} 
        onPress={onPress} 
        disabled={loading}
    >
        {loading ? (
            <ActivityIndicator color="#FFF" />
        ) : (
            <Text style={styles.buttonText}>{title}</Text>
        )}
    </TouchableOpacity>
);

interface CustomInputProps {
    label?: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    icon?: React.ElementType;
    error?: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({ label, value, onChangeText, placeholder, secureTextEntry, icon: Icon, error }) => (
    <View style={styles.inputContainer}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={[styles.inputWrapper, error && styles.errorBorder]}>
            {Icon && <Icon size={20} color={COLORS.textSecondary} style={styles.icon} />}
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={COLORS.textSecondary}
                secureTextEntry={secureTextEntry}
                autoComplete="off"
                textContentType="none"
                autoCorrect={false}
            />
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
);

interface CardProps {
    children: React.ReactNode;
    style?: any;
    statusColor?: string;
}

export const Card: React.FC<CardProps> = ({ children, style, statusColor }) => (
    <View style={[styles.card, SHADOWS.light, style, statusColor && { borderLeftWidth: 4, borderLeftColor: statusColor }]}>
        {children}
    </View>
);

const styles = StyleSheet.create({
    button: {
        paddingVertical: 14,
        borderRadius: SIZES.radius,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: '#FFF',
        fontSize: SIZES.fontMd,
        fontWeight: 'bold',
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: SIZES.fontSm,
        color: COLORS.textPrimary,
        marginBottom: 5,
        fontWeight: '500',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.inputBackground,
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
        borderRadius: SIZES.radius,
        paddingHorizontal: 12,
        height: 50,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: COLORS.textPrimary,
        fontSize: SIZES.fontMd,
    },
    errorBorder: {
        borderColor: COLORS.error,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 12,
        marginTop: 4,
    },
    card: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: SIZES.radius,
        padding: 20,
        marginVertical: 10,
    },
});
