import { useState } from 'react';
import { Alert, FlatList, Platform, Pressable, Share, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Habit = {
  id: string;
  name: string;
};

export default function HomeScreen() {
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', name: 'Read 20 pages' },
    { id: '2', name: '30 min exercise' },
  ]);
  const [newHabit, setNewHabit] = useState('');

  function addHabit() {
    const name = newHabit.trim();
    if (!name) return;

    setHabits((currentHabits) => [...currentHabits, { id: Date.now().toString(), name }]);
    setNewHabit('');
  }

  async function shareHabits() {
    const message = `My habits: ${habits.map((habit) => habit.name).join(', ')}`;

    if (Platform.OS === 'web' && typeof navigator.share === 'function') {
      await navigator.share({ title: 'Habit Tracker', text: message });
      return;
    }

    if (Platform.OS === 'web') {
      Alert.alert('Sharing unavailable', 'Sharing is not supported by this browser.');
      return;
    }

    await Share.share({ message });
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>DAILY ROUTINE</Text>
          <Text style={styles.title}>Habit Tracker</Text>
        </View>
        <Pressable accessibilityRole="button" style={styles.shareButton} onPress={shareHabits}>
          <Text style={styles.shareText}>Share</Text>
        </Pressable>
      </View>

      <View style={styles.form}>
        <TextInput
          accessibilityLabel="New habit"
          placeholder="Add a new habit"
          placeholderTextColor="#94a3b8"
          value={newHabit}
          onChangeText={setNewHabit}
          onSubmitEditing={addHabit}
          returnKeyType="done"
          style={styles.input}
        />
        <Pressable accessibilityRole="button" style={styles.addButton} onPress={addHabit}>
          <Text style={styles.addText}>Add</Text>
        </Pressable>
      </View>
      <Text style={styles.sectionTitle}>Your habits</Text>
      <FlatList
        data={habits}
        keyExtractor={(habit) => habit.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.habitName}>{item.name}</Text>
            <Text style={styles.status}>SYNCED</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  eyebrow: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  title: {
    color: '#0f172a',
    fontSize: 30,
    fontWeight: '800',
    marginTop: 4,
  },
  shareButton: {
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  shareText: {
    color: '#334155',
    fontWeight: '700',
  },
  form: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 30,
  },
  input: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderColor: '#cbd5e1',
    borderRadius: 8,
    borderWidth: 1,
    color: '#0f172a',
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  addText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  sectionTitle: {
    color: '#1e293b',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  list: {
    gap: 10,
  },
  card: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  habitName: {
    color: '#1e293b',
    fontSize: 16,
    fontWeight: '600',
  },
  status: {
    color: '#047857',
    fontSize: 11,
    fontWeight: '800',
  },
});
