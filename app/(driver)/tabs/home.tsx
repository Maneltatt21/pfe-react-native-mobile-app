import { useAuth } from "@/app/components/authProvider";
import ConfirmModal from "@/app/components/confirm-model";
import { useTheme } from "@/app/theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatListProps } from "react-native/Libraries/Lists/FlatList";

type DrawerParamList = {
  Home: undefined;
};
interface ImageItem {
  id: string;
  uri: string;
}

const images: ImageItem[] = [
  { id: "1", uri: "https://picsum.photos/300/200?random=1" },
  { id: "2", uri: "https://picsum.photos/300/200?random=2" },
  { id: "3", uri: "https://picsum.photos/300/200?random=3" },
  { id: "4", uri: "https://picsum.photos/300/200?random=4" },
];
// Create AnimatedFlatList to support native onScroll animations
const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList
) as any as React.ComponentType<
  Animated.AnimatedProps<FlatListProps<ImageItem>>
>;
export default function Home() {
  const router = useRouter();
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const { theme } = useTheme();
  const { logout, user } = useAuth();

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);
  const handleLogout = () => setShowLogoutModal(true);

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    try {
      await logout();
      router.replace("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: true,
      listener: (event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / 320); // 300px width + 20px margin
        setCurrentIndex(index);
      },
    }
  );

  return (
    <Pressable
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      onPress={() => dropdownVisible && setDropdownVisible(false)}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.header, { backgroundColor: theme.colors.appBar }]}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={28} color={theme.colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.avatarContainer,
              { backgroundColor: theme.colors.card },
            ]}
            onPress={toggleDropdown}
          >
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=12" }}
              style={styles.avatar}
            />
            <View style={styles.driverLabelContainer}>
              <Text style={[styles.driverLabel, { color: theme.colors.text }]}>
                {user?.name
                  ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
                  : "Driver"}
              </Text>
              <Ionicons
                name="chevron-down"
                size={18}
                color={theme.colors.text}
              />
            </View>
          </TouchableOpacity>
        </View>

        {dropdownVisible && (
          <Pressable
            style={[styles.dropdown, { backgroundColor: theme.colors.card }]}
          >
            <Pressable onPress={handleLogout} style={styles.dropdownItem}>
              <Ionicons
                name="log-out-outline"
                size={20}
                color={theme.colors.deleteButton}
              />
              <Text
                style={[
                  styles.logoutText,
                  { color: theme.colors.deleteButton },
                ]}
              >
                Logout
              </Text>
            </Pressable>
          </Pressable>
        )}

        <View style={styles.carouselContainer}>
          <AnimatedFlatList
            data={images as ImageItem[]}
            keyExtractor={(item: ImageItem, index: number) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={320}
            snapToAlignment="center"
            decelerationRate="fast"
            renderItem={({ item }: { item: ImageItem }) => (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item.uri }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            )}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          />
          <View style={styles.dotsContainer}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      index === currentIndex
                        ? theme.colors.primary
                        : theme.colors.border,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        <ConfirmModal
          visible={showLogoutModal}
          title="Logout"
          message="Are you sure you want to logout?"
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={confirmLogout}
          confirmText="Logout"
          cancelText="Cancel"
        />
      </ScrollView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  scrollContainer: {
    justifyContent: "flex-start",
  },
  header: {
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatarContainer: {
    width: 180,
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 16,
    elevation: 2,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  driverLabelContainer: {
    marginLeft: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  driverLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 4,
  },
  dropdown: {
    position: "absolute",
    top: 60,
    right: 16,
    width: 180,
    borderRadius: 16,
    elevation: 4,
    padding: 8,
    zIndex: 100,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  logoutText: {
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 16,
  },
  carouselContainer: {
    marginTop: 20,
    marginHorizontal: 16,
  },
  imageContainer: {
    width: 300,
    height: 200,
    marginRight: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
