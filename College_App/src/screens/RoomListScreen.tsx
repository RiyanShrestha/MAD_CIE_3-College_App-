import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import { Search, Filter, Users, MapPin, ChevronRight } from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';

import { Room } from '../theme/types';

interface RoomItemProps {
    room: Room;
    onPress: () => void;
}

const RoomItem: React.FC<RoomItemProps> = ({ room, onPress }) => {
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Available': return { bg: COLORS.success + '20', text: COLORS.success };
            case 'Booked': return { bg: COLORS.error + '20', text: COLORS.error };
            case 'Pending': return { bg: COLORS.warning + '20', text: COLORS.warning };
            default: return { bg: COLORS.textSecondary + '20', text: COLORS.textSecondary };
        }
    };

    const statusStyle = getStatusStyle(room.status);

    return (
        <TouchableOpacity style={styles.roomCard} onPress={onPress}>
            <View style={styles.roomIcon}>
                <MapPin size={24} color={COLORS.primary} />
            </View>
            <View style={styles.roomDetails}>
                <View style={styles.roomRow}>
                    <Text style={styles.roomNumber}>{room.room_number}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                        <Text style={[styles.statusText, { color: statusStyle.text }]}>{room.status}</Text>
                    </View>
                </View>
                <Text style={styles.roomType}>{room.type}</Text>
                <View style={styles.capacityRow}>
                    <Users size={16} color={COLORS.textSecondary} />
                    <Text style={styles.capacityText}>Capacity: {room.capacity} Persons</Text>
                </View>
            </View>
            <ChevronRight size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
    );
};

const RoomListScreen = ({ navigation, route }: { navigation: any, route: any }) => {
    const initialFilter = route.params?.filter || 'All';
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState(initialFilter);
    const [rooms, setRooms] = useState<Room[]>([
        { id: 1, room_number: 'LH-101', type: 'Lecture Hall', capacity: 60, status: 'Available' },
        { id: 2, room_number: 'LB-202', type: 'Computer Lab', capacity: 30, status: 'Available' },
        { id: 3, room_number: 'SR-303', type: 'Seminar Room', capacity: 15, status: 'Booked' },
        { id: 4, room_number: 'LH-102', type: 'Lecture Hall', capacity: 50, status: 'Pending' },
        { id: 5, room_number: 'LB-205', type: 'Science Lab', capacity: 25, status: 'Available' },
        { id: 6, room_number: 'LH-201', type: 'Lecture Hall', capacity: 70, status: 'Booked' },
    ]);

    const filters = ['All', 'Available', 'Booked', 'Pending'];

    const filteredRooms = rooms.filter(room => {
        const matchesSearch = room.room_number.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             room.type.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'All' || room.status === activeFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Available Rooms</Text>
                <View style={styles.searchContainer}>
                    <View style={styles.searchWrapper}>
                        <Search size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
                        <TextInput 
                            style={styles.searchInput}
                            placeholder="Search by room or type..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    <TouchableOpacity style={styles.filterBtn}>
                        <Filter size={20} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.filterTabs}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                    {filters.map(filter => (
                        <TouchableOpacity 
                            key={filter}
                            style={[styles.filterTab, activeFilter === filter && styles.activeTab]}
                            onPress={() => setActiveFilter(filter)}
                        >
                            <Text style={[styles.filterText, activeFilter === filter && styles.activeHeaderText]}>
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={filteredRooms}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <RoomItem 
                        room={item} 
                        onPress={() => navigation.navigate('RoomDetails', { room: item })} 
                    />
                )}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No rooms found</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        paddingHorizontal: 25,
        paddingTop: 20,
        backgroundColor: '#FFF',
        paddingBottom: 20,
        ...SHADOWS.light,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 15,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.inputBackground,
        borderRadius: 15,
        paddingHorizontal: 12,
        height: 45,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: COLORS.textPrimary,
    },
    filterBtn: {
        width: 45,
        height: 45,
        backgroundColor: COLORS.inputBackground,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    filterTabs: {
        marginTop: 15,
        marginBottom: 10,
    },
    filterScroll: {
        paddingHorizontal: 20,
    },
    filterTab: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: '#FFF',
        marginRight: 10,
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
    },
    activeTab: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    filterText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    activeHeaderText: {
        color: '#FFF',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    roomCard: {
        backgroundColor: '#FFF',
        borderRadius: 18,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        ...SHADOWS.light,
    },
    roomIcon: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: COLORS.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
    },
    roomDetails: {
        flex: 1,
        marginLeft: 15,
    },
    roomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    roomNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    statusBadge: {
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    roomType: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginBottom: 6,
    },
    capacityRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    capacityText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginLeft: 5,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: COLORS.textSecondary,
        fontSize: 16,
    },
});

export default RoomListScreen;
