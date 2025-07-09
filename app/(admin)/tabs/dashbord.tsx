import { Ionicons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

type DrawerParamList = {
  Home: undefined;
};

export default function AdminDashbord() {
      const router = useRouter();
  
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);
  const handleLogout = () => {
    setDropdownVisible(false);
    // TODO: implement actual logout logic here
      Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () =>router.replace("/")},
    ]);
    console.log('Logging out...');
  };

 return (
  <Pressable style={styles.container} onPress={() => dropdownVisible && setDropdownVisible(false)}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Ionicons name="menu" size={28} color="black" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.avatarContainer} onPress={toggleDropdown}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
          style={styles.avatar}
        />
        <View style={styles.adminLabelContainer}>
          <Text style={styles.adminLabel}>Admin</Text>
          <Ionicons name="chevron-down" size={18} color="#333" />
        </View>
      </TouchableOpacity>
    </View>

    <View style={styles.content}>
  <View style={styles.statsRow}>
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>Véhicules Totaux</Text>
      <Text style={styles.statNumber}>345</Text>
    </View>
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>Véhicules Assigné</Text>
      <Text style={styles.statNumber}>300</Text>
    </View>
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>Véhicules Disponible</Text>
      <Text style={styles.statNumber}>45</Text>
    </View>


  </View>
      <View style={styles.actionRow}>
  <View style={styles.searchContainer}>
    <Ionicons name="search" size={18} color="#999" style={{ marginRight: 6 }} />
    <Text style={styles.searchPlaceholder}>Rechercher un véhicule...</Text>
  </View>

  <TouchableOpacity style={styles.addButton} onPress={() => console.log('Add vehicle')}>
    <Ionicons name="add" size={20} color="#fff" />
    <Text style={styles.addButtonText}>Ajouter</Text>
  </TouchableOpacity>
</View>


<View style={styles.table} >
  {/* Table Header */}
  <View style={styles.tableRowHeader}>
    <Text style={styles.tableCellHeader}>#</Text>
    <Text style={styles.tableCellHeader}>N°</Text>
    <Text style={styles.tableCellHeader}>Type</Text>
    <Text style={styles.tableCellHeader}>Model</Text>
  </View>

  {/* Table Rows (sample data) */}
  <TouchableOpacity style={styles.tableRow}  onPress={() =>
        router.push({
          pathname: '/vehicles/[id]',
          params: { type: 'Frigo', model: 'earum' },
        })}>
    <Text style={styles.tableCell}>1</Text>
    <Text style={styles.tableCell}>456</Text>
    <Text style={styles.tableCell}>Frigo</Text>
    <Text style={styles.tableCell}>earum</Text>
  </TouchableOpacity>

  {/* Add Row */}
  <View style={styles.tableRowAdd}>
    <Text style={styles.tableCell}>+</Text>
    <Text style={styles.tableCell}>--- </Text>
    <Text style={styles.tableCell}>Ajouter</Text>
    <Text style={styles.tableCell}>un véhicule</Text>
  </View>
</View>

</View>


    {dropdownVisible && (
      <Pressable style={styles.dropdown} onPress={() => {}}>
        <Pressable onPress={handleLogout} style={styles.dropdownItem}>
          <Ionicons name="log-out-outline" size={20} color="#e74c3c" />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </Pressable>
    )}
    </ScrollView>
  </Pressable>
);

}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, backgroundColor: '#F9F9F9' },
  header: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scrollContainer: {
  justifyContent: 'flex-start',
},

  avatarContainer: {
    width:150,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  adminLabelContainer: {
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 4,
  },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333' },

  dropdown: {
    position: 'absolute',
    top: 60,
    right: 16,
    width:150,
    backgroundColor: '#fff',
    borderRadius:  16,
    elevation: 4,
    padding: 8,
    zIndex: 100,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  logoutText: {
    marginLeft: 8,
    color: '#e74c3c',
    fontWeight: '600',
    fontSize: 16,
  },
  statsRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: 16,
  marginTop: 20,
},
statCard: {
  flex: 1,
  marginHorizontal: 5,
  backgroundColor: '#fff',
  borderRadius: 12,
  paddingVertical: 20,
  alignItems: 'center',
  justifyContent: 'center',
  elevation: 3,
},
statLabel: {
  fontSize: 16,
  fontWeight: '500',
  color: '#666',
  marginBottom: 8,
  textAlign: 'center',
},
statNumber: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#333',
},
actionRow: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 16,
  marginTop: 20,
  width: '100%',
},

searchContainer: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#f1f1f1',
  borderRadius: 10,
  paddingHorizontal: 10,
  height: 40,
  marginRight: 10,
},

searchPlaceholder: {
  color: '#999',
  fontSize: 14,
},

addButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#4CAF50',
  paddingHorizontal: 14,
  height: 40,
  borderRadius: 10,
},

addButtonText: {
  color: '#fff',
  fontWeight: '600',
  marginLeft: 6,
},
table: {
  marginTop: 20,
  width: '100%',
  paddingHorizontal: 16,
},

tableRowHeader: {
  flexDirection: 'row',
  backgroundColor: '#f0f0f0',
  paddingVertical: 10,
  borderTopLeftRadius: 10,
  borderTopRightRadius: 10,
},

tableRow: {
  flexDirection: 'row',
  backgroundColor: '#fff',
  paddingVertical: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#eee',
},

tableRowAdd: {
  flexDirection: 'row',
  backgroundColor: '#eafaf1',
  paddingVertical: 10,
  borderBottomLeftRadius: 10,
  borderBottomRightRadius: 10,
},

tableCellHeader: {
  flex: 1,
  fontWeight: 'bold',
  color: '#333',
  textAlign: 'center',
},

tableCell: {
  flex: 1,
  textAlign: 'center',
  color: '#444',
},

});
