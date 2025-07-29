// ExchangesScreen.tsx
import BackHeader from "@/app/components/back-botton";
import Container from "@/app/components/container";
import { Exchange } from "@/app/models/exchange.model";
import { useExchangesStore } from "@/app/store/exchangesStore";
import { useTheme } from "@/app/theme/ThemeProvider";
import React, { useEffect } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

const ExchangesScreen = () => {
  const { theme } = useTheme();
  const { exchanges, isLoading, fetchExchanges } = useExchangesStore();

  useEffect(() => {
    fetchExchanges();
  }, [fetchExchanges]);

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
      {exchanges.length === 0 ? (
        <Text style={[styles.noData, { color: theme.colors.text }]}>
          No exchanges available.
        </Text>
      ) : (
        exchanges.map((exchange: Exchange) => (
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
              <Text style={styles.label}>Request Date:</Text>
              {new Date(exchange.request_date).toLocaleString()}
            </Text>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Vehicle
              </Text>
              <Text style={{ color: theme.colors.text }}>
                {exchange.vehicle.model} ({exchange.vehicle.registration_number}
                ) - {exchange.vehicle.year}
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

            {exchange.before_photo_path && (
              <View style={styles.section}>
                <Text
                  style={[styles.sectionTitle, { color: theme.colors.text }]}
                >
                  Before Photo
                </Text>
                <Image
                  source={{
                    uri: `http://127.0.0.1:8000/public/storage/${exchange.before_photo_path}`,
                  }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            )}
          </View>
        ))
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
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
});
