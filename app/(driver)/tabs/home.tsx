import { Ionicons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type DrawerParamList = {
  Home: undefined;
};

export default function Home() {
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={28} color="black" />
        </TouchableOpacity>

        <View style={styles.avatarContainer}>
          <Text style={styles.welcomeText}>Welcome Helmi 👋</Text>
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
            style={styles.avatar}
          />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Driver Home Screen</Text>
      </View>
    </View>
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
  avatarContainer: { flexDirection: 'row', alignItems: 'center' },
  welcomeText: { marginRight: 10, fontSize: 16, fontWeight: '600', color: '#333' },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333' },
});
