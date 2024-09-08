import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';

const { width, height } = Dimensions.get('window');

const PrivacySettings = () => {
  // State variables for privacy settings
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [shareSessionHistory, setShareSessionHistory] = useState(false);
  const [allowContactByTutors, setAllowContactByTutors] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);

  const handleSavePrivacySettings = () => {
    // Save the privacy settings (this would typically be saved to a backend or local storage)
    console.log('Privacy settings saved:', {
      profileVisibility,
      shareSessionHistory,
      allowContactByTutors,
      dataSharing,
    });
    alert('Your privacy settings have been saved!');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Privacy Settings</Text>

      <View style={styles.settingRow}>
        <Text style={styles.settingText}>Profile Visibility</Text>
        <Switch
          value={profileVisibility}
          onValueChange={setProfileVisibility}
          trackColor={{ false: '#ccc', true: '#007BFF' }}
        />
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.settingText}>Share Session History with Tutors</Text>
        <Switch
          value={shareSessionHistory}
          onValueChange={setShareSessionHistory}
          trackColor={{ false: '#ccc', true: '#007BFF' }}
        />
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.settingText}>Allow Contact by Tutors</Text>
        <Switch
          value={allowContactByTutors}
          onValueChange={setAllowContactByTutors}
          trackColor={{ false: '#ccc', true: '#007BFF' }}
        />
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.settingText}>Allow Data Sharing with Partners</Text>
        <Switch
          value={dataSharing}
          onValueChange={setDataSharing}
          trackColor={{ false: '#ccc', true: '#007BFF' }}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSavePrivacySettings}>
        <Text style={styles.saveButtonText}>Save Privacy Settings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    top: height * 0.03,
    padding: 20,
    backgroundColor: '#f5f5f5',
    minHeight: height,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  settingText: {
    fontSize: 18,
    color: '#555',
  },
  saveButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 30,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default PrivacySettings;
