import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Platform,
  Share,
  SafeAreaView,
  StatusBar,
} from 'react-native';

export default function HomeScreen() {
  const [habits, setHabits] = useState([
    { id: '1', name: 'Read 20 pages', status: 'synced' },
    { id: '2', name: '30 min Exercise', status: 'synced' },
  ]);
  const [input, setInput] = useState('');

  const addHabit = () => {
    if (!input.trim()) return;
    const newHabit = {
      id: Date.now().toString(),
      name: input,
      status: 'synced',
    };
    setHabits((prev) => [...prev, newHabit]);
    setInput('');
  };

  const handleShare = async () => {
    if (Platform.OS === 'web') {
      if (navigator.share) {
        await navigator.share({
          title: 'Habit Tracker',
          url: window.location.href,
        });
      } else {
        alert('Sharing is not supported on this browser.');
      }
    } else {
      await Share.share({
        message: 'Check out my Habit Tracker App!',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Habit Tracker Mobile</Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareText}>Share</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Add new habit..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.addButton} onPress={addHabit}>
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>Your Habits</Text>
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.habitName}>{item.name}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>✓ Synced</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  shareButton: { backgroundColor: '#e2e8f0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  shareText: { color: '#334155', fontWeight: '600', fontSize: 13 },
  form: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  input: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  addButton: { backgroundColor: '#4f46e5', paddingHorizontal: 16, justifyContent: 'center', borderRadius: 8 },
  addText: { color: '#ffffff', fontWeight: 'bold' },
  subtitle: { fontSize: 16, fontWeight: '600', color: '#1e293b', marginBottom: 12 },
  card: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  habitName: { fontSize: 14, fontWeight: '500', color: '#1e293b' },
  badge: { backgroundColor: '#d1fae5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#065f46', fontSize: 12, fontWeight: 'bold' },
});