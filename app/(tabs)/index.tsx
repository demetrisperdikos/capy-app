import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, Image } from 'react-native';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View } from '@/components/Themed';
import { getMoodColor } from '@/utils/moodColors';

export default function LogScreen() {
  const [stress, setStress] = useState(5);
  const [happiness, setHappiness] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  const avg = (stress + happiness + energy) / 3;

  async function save() {
    const date = new Date().toISOString().split('T')[0];
    const entriesRaw = await AsyncStorage.getItem('moodEntries');
    const entries = entriesRaw ? JSON.parse(entriesRaw) : {};
    entries[date] = { stress, happiness, energy, note };
    await AsyncStorage.setItem('moodEntries', JSON.stringify(entries));
    setSaved(true);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you today?</Text>
      <View style={[styles.tile, { backgroundColor: getMoodColor(avg) }]} />

      <Text>Stress: {stress}</Text>
      <Slider
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={stress}
        onValueChange={setStress}
        minimumTrackTintColor={getMoodColor(stress)}
        maximumTrackTintColor="#ccc"
      />
      <Text>Happiness: {happiness}</Text>
      <Slider
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={happiness}
        onValueChange={setHappiness}
        minimumTrackTintColor={getMoodColor(happiness)}
        maximumTrackTintColor="#ccc"
      />
      <Text>Energy: {energy}</Text>
      <Slider
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={energy}
        onValueChange={setEnergy}
        minimumTrackTintColor={getMoodColor(energy)}
        maximumTrackTintColor="#ccc"
      />
      <TextInput
        style={styles.input}
        placeholder="Optional note"
        value={note}
        onChangeText={setNote}
      />
      <Button title="Save" onPress={save} />
      {saved && (
        <Text style={styles.capy}>🦫 The capybara is proud of you!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  tile: {
    height: 80,
    marginVertical: 10,
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginVertical: 10,
  },
  capy: {
    marginTop: 10,
    textAlign: 'center',
  },
});
