import BackHeader from "@/app/components/back-botton";
import Container from "@/app/components/container";
import { Exchange } from "@/src/models/exchange.model";
import { useExchangesStore } from "@/src/store/exchangesStore";
import { useTheme } from "@/src/theme/ThemeProvider";
import Constants from "expo-constants";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";

const ExchangesScreen = () => {
  const { theme } = useTheme();
  const {
    exchanges,
    isLoading,
    fetchExchanges,
    approveExchange,
    rejectExchange,
    nbExchangesPending,
    nbExchangesApproved,
    nbExchangesRejected,
  } = useExchangesStore();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "pending", title: `Pending (${nbExchangesPending})` },
    { key: "approved", title: `Approved (${nbExchangesApproved})` },
    { key: "rejected", title: `Rejected (${nbExchangesRejected})` },
  ]);

  useEffect(() => {
    fetchExchanges();
  }, [fetchExchanges]);
  // console.log("exchanges :", JSON.stringify(exchanges, null, 2));

  const renderExchangeCard = (exchange: Exchange) => (
    <View
      key={exchange.id}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
        Exchange #{exchange.id}
      </Text>
      <Text style={{ color: theme.colors.text }}>
        <Text style={styles.label}>Status:</Text> {exchange.status}
      </Text>
      <Text style={{ color: theme.colors.text }}>
        <Text style={styles.label}>Note:</Text> {exchange.note}
      </Text>
      <Text style={{ color: theme.colors.text }}>
        <Text style={styles.label}>Request Date:</Text>{" "}
        {new Date(exchange.request_date).toLocaleString()}
      </Text>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Vehicle
        </Text>
        <Text style={{ color: theme.colors.text }}>
          {exchange.vehicle.model} ({exchange.vehicle.registration_number}) -{" "}
          {exchange.vehicle.year}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          From Driver
        </Text>
        <Text style={{ color: theme.colors.text }}>
          {exchange.from_driver.name} ({exchange.from_driver.email})
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          To Driver
        </Text>
        <Text style={{ color: theme.colors.text }}>
          {exchange.to_driver.name} ({exchange.to_driver.email})
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Before Photo
        </Text>
        <Image
          source={{
            uri: `http://${Constants.expoConfig?.extra?.APP_IP_EMULATOR_DEVICE}:8000/storage/${exchange.before_photo_path}`,
          }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {exchange.status === "pending" && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.success }]}
            onPress={async () => {
              try {
                await approveExchange(exchange.id.toString());
              } catch (err) {
                console.error("Failed to approve exchange:", err);
              }
            }}
          >
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.error }]}
            onPress={async () => {
              try {
                await rejectExchange(exchange.id.toString());
              } catch (err) {
                console.error("Failed to reject exchange:", err);
              }
            }}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const PendingRoute = () => (
    <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
      {exchanges.filter((e) => e.status === "pending").length === 0 ? (
        <Text style={[styles.noData, { color: theme.colors.text }]}>
          No pending exchanges available.
        </Text>
      ) : (
        exchanges
          .filter((e) => e.status === "pending")
          .map((exchange) => renderExchangeCard(exchange))
      )}
    </ScrollView>
  );

  const ApprovedRoute = () => (
    <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
      {exchanges.filter((e) => e.status === "approved").length === 0 ? (
        <Text style={[styles.noData, { color: theme.colors.text }]}>
          No approved exchanges available.
        </Text>
      ) : (
        exchanges
          .filter((e) => e.status === "approved")
          .map((exchange) => renderExchangeCard(exchange))
      )}
    </ScrollView>
  );

  const RejectedRoute = () => (
    <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
      {exchanges.filter((e) => e.status === "rejected").length === 0 ? (
        <Text style={[styles.noData, { color: theme.colors.text }]}>
          No rejected exchanges available.
        </Text>
      ) : (
        exchanges
          .filter((e) => e.status === "rejected")
          .map((exchange) => renderExchangeCard(exchange))
      )}
    </ScrollView>
  );

  const renderScene = SceneMap({
    pending: PendingRoute,
    approved: ApprovedRoute,
    rejected: RejectedRoute,
  });

  if (isLoading) {
    return (
      <Container>
        <BackHeader title="Exchange Requests" />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <BackHeader title="Exchange Requests" />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={{ backgroundColor: theme.colors.background }}
            indicatorStyle={{ backgroundColor: theme.colors.primary }}
          />
        )}
      />
    </Container>
  );
};

export default ExchangesScreen;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noData: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 32,
  },
  card: {
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
  },
  section: {
    marginTop: 10,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  image: {
    marginTop: 8,
    height: 200,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
