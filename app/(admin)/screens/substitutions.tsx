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
    { key: "pending", title: `En attente (${nbExchangesPending})` },
    { key: "approved", title: `Approuvés (${nbExchangesApproved})` },
    { key: "rejected", title: `Rejetés (${nbExchangesRejected})` },
  ]);

  useEffect(() => {
    fetchExchanges();
  }, [fetchExchanges]);

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
        Échange #{exchange.id}
      </Text>
      <Text style={{ color: theme.colors.text }}>
        <Text style={styles.label}>Statut :</Text> {exchange.status}
      </Text>
      <Text style={{ color: theme.colors.text }}>
        <Text style={styles.label}>Note :</Text> {exchange.note}
      </Text>
      <Text style={{ color: theme.colors.text }}>
        <Text style={styles.label}>Date de demande :</Text>{" "}
        {new Date(exchange.request_date).toLocaleString()}
      </Text>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Véhicule
        </Text>
        <Text style={{ color: theme.colors.text }}>
          {exchange.vehicle.model} ({exchange.vehicle.registration_number}) -{" "}
          {exchange.vehicle.year}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          De conducteur
        </Text>
        <Text style={{ color: theme.colors.text }}>
          {exchange.from_driver.name} ({exchange.from_driver.email})
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          À conducteur
        </Text>
        <Text style={{ color: theme.colors.text }}>
          {exchange.to_driver.name} ({exchange.to_driver.email})
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Photo avant
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
                console.error("Échec de l'approbation de l'échange :", err);
              }
            }}
          >
            <Text style={styles.buttonText}>Approuver</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.error }]}
            onPress={async () => {
              try {
                await rejectExchange(exchange.id.toString());
              } catch (err) {
                console.error("Échec du rejet de l'échange :", err);
              }
            }}
          >
            <Text style={styles.buttonText}>Rejeter</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const PendingRoute = () => (
    <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
      {exchanges.filter((e) => e.status === "pending").length === 0 ? (
        <Text style={[styles.noData, { color: theme.colors.text }]}>
          Aucun échange en attente disponible.
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
          Aucun échange approuvé disponible.
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
          Aucun échange rejeté disponible.
        </Text>
      ) : (
        exchanges
          .filter((e) => e.status === "rejected")
          .map((exchange) => renderExchangeCard(exchange))
      )}
    </ScrollView>
  );

  return (
    <Container>
      <BackHeader title="Échanges" />
      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <TabView
          navigationState={{ index, routes }}
          renderScene={SceneMap({
            pending: PendingRoute,
            approved: ApprovedRoute,
            rejected: RejectedRoute,
          })}
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
      )}
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
