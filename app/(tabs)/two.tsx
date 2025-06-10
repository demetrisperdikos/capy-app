import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View } from '@/components/Themed';
import { getMoodColor } from '@/utils/moodColors';

interface Entry {
  stress: number;
  happiness: number;
  energy: number;
  note?: string;
}

export default function CalendarScreen() {
  const [entries, setEntries] = useState<Record<string, Entry>>({});

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem('moodEntries');
      setEntries(raw ? JSON.parse(raw) : {});
    })();
  }, []);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const data = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const entry = entries[key];
    let color = '#ddd';
    if (entry) {
      const avg = (entry.stress + entry.happiness + entry.energy) / 3;
      color = getMoodColor(avg);
    }
    return { key, day, color };
  });

  const counts = { Blue: 0, Yellow: 0, Green: 0 };
  Object.values(entries).forEach((e) => {
    const avg = (e.stress + e.happiness + e.energy) / 3;
    if (avg <= 3) counts.Blue += 1;
    else if (avg <= 6) counts.Yellow += 1;
    else counts.Green += 1;
  });
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'None';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>This Month</Text>
      <FlatList
        data={data}
        numColumns={7}
        renderItem={({ item }) => (
          <View style={[styles.day, { backgroundColor: item.color }]}> 
            <Text>{item.day}</Text>
          </View>
        )}
      />
      <Text style={styles.summary}>Most common mood color: {top}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 10 },
  day: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    borderRadius: 4,
  },
  summary: { textAlign: 'center', marginTop: 10 },
});
