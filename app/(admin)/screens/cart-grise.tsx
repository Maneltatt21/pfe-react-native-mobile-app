import BackHeader from '@/app/components/back-botton';
import Container from '@/app/components/container';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

const cartGrises = [
  { id: '1', owner: 'Ahmed Ben Salah', vehicle: 'Renault Clio', registrationNumber: 'TN-1234-AB' },
  { id: '2', owner: 'Mohamed Ali', vehicle: 'Peugeot 208', registrationNumber: 'TN-5678-CD' },
  { id: '3', owner: 'Fatma Trabelsi', vehicle: 'Toyota Corolla', registrationNumber: 'TN-9012-EF' },
];

export default function CartGrisePage() {
  return (
    <Container>
      <BackHeader title="Carte Grise" />
      <FlatList
        data={cartGrises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.owner}>Owner: {item.owner}</Text>
            <Text style={styles.vehicle}>Vehicle: {item.vehicle}</Text>
            <Text style={styles.registration}>Registration #: {item.registrationNumber}</Text>
            
          </View>
        )}
        contentContainerStyle={{ paddingTop: 10 }}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    marginBottom: 10,
  },
  owner: {
    fontSize: 16,
    fontWeight: '600',
  },
  vehicle: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
  registration: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});
