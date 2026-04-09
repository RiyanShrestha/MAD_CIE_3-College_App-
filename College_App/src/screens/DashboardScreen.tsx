import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, Platform, StatusBar } from 'react-native';
import { Home, CheckCircle, XCircle, Clock, Users, ArrowRight } from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS } from '../theme/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    onPress: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, onPress }) => (
    <TouchableOpacity 
        style={[styles.statCard, { borderBottomColor: color, borderBottomWidth: 4 }]} 
        onPress={onPress}
        activeOpacity={0.8}
    >
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
            <Icon size={24} color={color} />
        </View>
        <View style={styles.statContent}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statTitle}>{title}</Text>
        </View>
    </TouchableOpacity>
);

const DashboardScreen = ({ navigation }: { navigation: any }) => {
    // Dynamic Stats (Mocked for now, will connect to backend)
    const stats = {
        total: 25,
        available: 12,
        booked: 8,
        pending: 5,
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.welcomeText}>Hello, Riyan!</Text>
                        <Text style={styles.headerTitle}>Dashboard</Text>
                    </View>
                    <TouchableOpacity style={styles.profileBtn}>
                        <Users size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.mainCard}>
                    <View style={styles.mainCardContent}>
                        <Text style={styles.mainCardLabel}>Total Rooms</Text>
                        <Text style={styles.mainCardValue}>{stats.total}</Text>
                        <Text style={styles.mainCardDesc}>Explore all available facilities</Text>
                    </View>
                    <TouchableOpacity 
                        style={styles.exploreBtn}
                        onPress={() => navigation.navigate('RoomList', { filter: 'All' })}
                    >
                        <Text style={styles.exploreBtnText}>Explore Rooms</Text>
                        <ArrowRight size={18} color="#FFF" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Room Statistics</Text>
                
                <View style={styles.statsGrid}>
                    <StatCard 
                        title="Available" 
                        value={stats.available} 
                        icon={CheckCircle} 
                        color={COLORS.success}
                        onPress={() => navigation.navigate('RoomList', { filter: 'Available' })}
                    />
                    <StatCard 
                        title="Booked" 
                        value={stats.booked} 
                        icon={XCircle} 
                        color={COLORS.error}
                        onPress={() => navigation.navigate('RoomList', { filter: 'Booked' })}
                    />
                    <StatCard 
                        title="Pending" 
                        value={stats.pending} 
                        icon={Clock} 
                        color={COLORS.warning}
                        onPress={() => navigation.navigate('RoomList', { filter: 'Pending' })}
                    />
                    <StatCard 
                        title="Upcoming" 
                        value="3" 
                        icon={Home} 
                        color={COLORS.primary}
                        onPress={() => navigation.navigate('RoomList', { filter: 'All' })}
                    />
                </View>

                <View style={styles.recentActivity}>
                    <Text style={styles.sectionTitle}>Recent Activity</Text>
                    <View style={styles.activityCard}>
                        <Clock size={20} color={COLORS.primary} />
                        <View style={styles.activityInfo}>
                            <Text style={styles.activityTitle}>Room LH-101 Booked</Text>
                            <Text style={styles.activityTime}>2 hours ago</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: COLORS.success + '20' }]}>
                            <Text style={[styles.statusText, { color: COLORS.success }]}>Success</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    scrollContent: {
        paddingBottom: 30,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingTop: 20,
        marginBottom: 25,
    },
    welcomeText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    profileBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.light,
    },
    mainCard: {
        marginHorizontal: 25,
        backgroundColor: COLORS.primary,
        borderRadius: 20,
        padding: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...SHADOWS.medium,
    },
    mainCardContent: {
        flex: 1,
    },
    mainCardLabel: {
        color: '#E0E7FF',
        fontSize: 14,
        marginBottom: 5,
    },
    mainCardValue: {
        color: '#FFF',
        fontSize: 34,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    mainCardDesc: {
        color: '#FFF',
        fontSize: 12,
        opacity: 0.8,
    },
    exploreBtn: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    exploreBtnText: {
        color: '#FFF',
        fontWeight: 'bold',
        marginRight: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginHorizontal: 25,
        marginTop: 30,
        marginBottom: 15,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
    },
    statCard: {
        width: CARD_WIDTH,
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
        marginHorizontal: 5,
        ...SHADOWS.light,
    },
    iconContainer: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    statContent: {
        marginTop: 5,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    statTitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    recentActivity: {
        marginTop: 10,
    },
    activityCard: {
        marginHorizontal: 25,
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        ...SHADOWS.light,
    },
    activityInfo: {
        flex: 1,
        marginLeft: 15,
    },
    activityTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    activityTime: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    statusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
    },
});

export default DashboardScreen;
