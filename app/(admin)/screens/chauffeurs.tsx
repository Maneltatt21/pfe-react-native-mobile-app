import BackHeader from '@/app/components/back-botton';
import Container from '@/app/components/container';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';


const chauffeurs = [
  { id: '1', name: 'Ahmed Ben Salah', phone: '123-456-789' },
  { id: '2', name: 'Mohamed Ali', phone: '987-654-321' },
  { id: '3', name: 'Fatma Trabelsi', phone: '456-789-123' },
];

export default function ChauffeursPage() {
  return (
    <Container>
      <BackHeader title="Chauffeurs" />
      <FlatList
        data={chauffeurs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.phone}>{item.phone}</Text>
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
  name: {
    fontSize: 18,
    fontWeight: '500',
  },
  phone: {
    fontSize: 14,
    color: '#666',
  },
});
