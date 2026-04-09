import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, Animated, Modal, FlatList } from 'react-native';
import { Calendar, Clock, MapPin, Users, Award, ShieldCheck, CheckCircle2 } from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';
import { CustomButton } from '../components/Common';

import { Room } from '../theme/types';

const RoomDetailsScreen = ({ navigation, route }: { navigation: any, route: any }) => {
    const { room }: { room: Room } = route.params;
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const dates = Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d;
    });

    const formatDate = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
        const dateStr = date.toLocaleDateString('en-US', options);
        
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        
        if (date.toDateString() === today.toDateString()) return `${dateStr} (Today)`;
        if (date.toDateString() === tomorrow.toDateString()) return `${dateStr} (Tomorrow)`;
        return dateStr;
    };

    const timeSlots = [
        "09:00 AM - 10:00 AM",
        "10:00 AM - 11:00 AM",
        "11:00 AM - 12:00 PM",
        "01:00 PM - 02:00 PM",
        "02:00 PM - 03:00 PM",
        "03:00 PM - 04:00 PM",
    ];

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Available': return { text: COLORS.success, bg: COLORS.success + '15' };
            case 'Booked': return { text: COLORS.error, bg: COLORS.error + '15' };
            case 'Pending': return { text: COLORS.warning, bg: COLORS.warning + '15' };
            default: return { text: COLORS.textSecondary, bg: COLORS.textSecondary + '15' };
        }
    };

    const statusStyle = getStatusStyle(room.status);

    const handleBooking = () => {
        if (!selectedSlot) {
            Alert.alert('Selection Required', 'Please select a time slot to proceed.');
            return;
        }

        Alert.alert(
            'Confirm Booking',
            `Are you sure you want to book ${room.room_number} for the ${selectedSlot} slot on ${formatDate(selectedDate)}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Confirm', 
                    onPress: () => {
                        setBookingSuccess(true);
                        Animated.timing(fadeAnim, {
                            toValue: 1,
                            duration: 500,
                            useNativeDriver: true,
                        }).start();
                        
                        setTimeout(() => {
                            navigation.navigate('Dashboard');
                        }, 2000);
                    } 
                },
            ]
        );
    };

    if (bookingSuccess) {
        return (
            <SafeAreaView style={styles.successContainer}>
                <Animated.View style={[styles.successContent, { opacity: fadeAnim }]}>
                    <View style={styles.successIconWrapper}>
                        <CheckCircle2 size={80} color={COLORS.success} />
                    </View>
                    <Text style={styles.successTitle}>Booking Successful!</Text>
                    <Text style={styles.successSubtitle}>Your reservation for {room.room_number} has been confirmed for {selectedSlot} on {formatDate(selectedDate)}.</Text>
                    <CustomButton 
                        title="Back to Dashboard" 
                        onPress={() => navigation.navigate('Dashboard')}
                        style={styles.backBtn}
                    />
                </Animated.View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Room Details</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                        <Text style={[styles.statusText, { color: statusStyle.text }]}>{room.status}</Text>
                    </View>
                </View>

                {/* Room Information Card */}
                <View style={styles.infoCard}>
                    <View style={styles.cardHeader}>
                        <View style={styles.iconBox}>
                            <MapPin size={24} color={COLORS.primary} />
                        </View>
                        <View>
                            <Text style={styles.roomNumText}>{room.room_number}</Text>
                            <Text style={styles.roomTypeText}>{room.type}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.divider} />
                    
                    <View style={styles.detailsGrid}>
                        <View style={styles.detailItem}>
                            <Users size={20} color={COLORS.textSecondary} />
                            <View style={styles.detailTextWrapper}>
                                <Text style={styles.detailLabel}>Capacity</Text>
                                <Text style={styles.detailValue}>{room.capacity} Persons</Text>
                            </View>
                        </View>
                        <View style={styles.detailItem}>
                            <Award size={20} color={COLORS.textSecondary} />
                            <View style={styles.detailTextWrapper}>
                                <Text style={styles.detailLabel}>Type</Text>
                                <Text style={styles.detailValue}>{room.type}</Text>
                            </View>
                        </View>
                        <View style={styles.detailItem}>
                            <ShieldCheck size={20} color={COLORS.textSecondary} />
                            <View style={styles.detailTextWrapper}>
                                <Text style={styles.detailLabel}>Floor</Text>
                                <Text style={styles.detailValue}>2nd Floor</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Booking Section */}
                <View style={styles.bookingCard}>
                    <View style={styles.sectionHeader}>
                        <Clock size={20} color={COLORS.primary} />
                        <Text style={styles.sectionTitle}>Select Time Slot</Text>
                    </View>

                    <View style={styles.slotsGrid}>
                        {timeSlots.map((slot) => (
                            <TouchableOpacity 
                                key={slot}
                                style={[
                                    styles.slotItem, 
                                    selectedSlot === slot && styles.selectedSlot,
                                    room.status === 'Booked' && styles.disabledSlot
                                ]}
                                onPress={() => room.status !== 'Booked' && setSelectedSlot(slot)}
                                disabled={room.status === 'Booked'}
                            >
                                <Text style={[
                                    styles.slotText,
                                    selectedSlot === slot && styles.selectedSlotText,
                                    room.status === 'Booked' && styles.disabledSlotText
                                ]}>
                                    {slot.split(' - ')[0]}
                                </Text>
                                <Text style={[
                                    styles.slotSubText,
                                    selectedSlot === slot && styles.selectedSlotText,
                                    room.status === 'Booked' && styles.disabledSlotText
                                ]}>
                                    to {slot.split(' - ')[1]}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity 
                        style={styles.datePickerPlaceholder}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Calendar size={20} color={COLORS.primary} />
                        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
                    </TouchableOpacity>

                    {/* Custom Date Picker Modal */}
                    <Modal
                        visible={showDatePicker}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setShowDatePicker(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Select Date</Text>
                                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                        <Text style={styles.closeBtn}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                                <FlatList
                                    data={dates}
                                    keyExtractor={(item) => item.toDateString()}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity 
                                            style={[
                                                styles.dateItem,
                                                selectedDate.toDateString() === item.toDateString() && styles.selectedDateItem
                                            ]}
                                            onPress={() => {
                                                setSelectedDate(item);
                                                setShowDatePicker(false);
                                            }}
                                        >
                                            <Calendar 
                                                size={18} 
                                                color={selectedDate.toDateString() === item.toDateString() ? COLORS.primary : COLORS.textSecondary} 
                                            />
                                            <Text style={[
                                                styles.dateItemText,
                                                selectedDate.toDateString() === item.toDateString() && styles.selectedDateItemText
                                            ]}>
                                                {formatDate(item)}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                    contentContainerStyle={styles.dateList}
                                />
                            </View>
                        </View>
                    </Modal>

                    <CustomButton 
                        title={room.status === 'Booked' ? 'Room Already Booked' : 'Confirm & Book Room'}
                        onPress={handleBooking}
                        style={styles.bookBtn}
                        color={room.status === 'Booked' ? COLORS.textSecondary : COLORS.primary}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    statusBadge: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    infoCard: {
        backgroundColor: '#FFF',
        borderRadius: 25,
        padding: 25,
        ...SHADOWS.medium,
        marginBottom: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: COLORS.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    roomNumText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    roomTypeText: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.inputBorder,
        marginVertical: 20,
    },
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    detailItem: {
        width: '45%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    detailTextWrapper: {
        marginLeft: 10,
    },
    detailLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    bookingCard: {
        backgroundColor: '#FFF',
        borderRadius: 25,
        padding: 25,
        ...SHADOWS.medium,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginLeft: 10,
    },
    slotsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    slotItem: {
        width: '48%',
        backgroundColor: COLORS.inputBackground,
        padding: 15,
        borderRadius: 15,
        marginBottom: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
    },
    selectedSlot: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    disabledSlot: {
        backgroundColor: '#F3F4F6',
        opacity: 0.6,
    },
    slotText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    slotSubText: {
        fontSize: 11,
        color: COLORS.textSecondary,
    },
    selectedSlotText: {
        color: '#FFF',
    },
    disabledSlotText: {
        color: COLORS.textSecondary,
    },
    datePickerPlaceholder: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.inputBackground,
        padding: 15,
        borderRadius: 15,
        marginBottom: 20,
    },
    dateText: {
        marginLeft: 10,
        fontSize: 14,
        color: COLORS.textPrimary,
        fontWeight: '500',
    },
    bookBtn: {
        height: 55,
    },
    successContainer: {
        flex: 1,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    successContent: {
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
    },
    successIconWrapper: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: COLORS.success + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    successTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 10,
        textAlign: 'center',
    },
    successSubtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
        paddingHorizontal: 10,
    },
    backBtn: {
        width: '100%',
        paddingVertical: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingTop: 20,
        maxHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.inputBorder,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    closeBtn: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    dateList: {
        padding: 10,
    },
    dateItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        marginBottom: 8,
    },
    selectedDateItem: {
        backgroundColor: COLORS.primary + '10',
    },
    dateItemText: {
        marginLeft: 12,
        fontSize: 16,
        color: COLORS.textPrimary,
    },
    selectedDateItemText: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
});

export default RoomDetailsScreen;
