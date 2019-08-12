import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Image, TextInput, TouchableOpacity, Text, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../../services/api';

import logo from '../../assets/logo.png';
import styles from './styles';

function Login({ navigation }) {
  const [dev, setDev] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('dev').then(storageDev => {
      if (storageDev) {
        navigation.navigate('Main', { dev: storageDev });
      }
    });
  }, [navigation]);

  async function handleLogin() {
    try {
      const {
        data: { success, data },
      } = await api.post('/devs', {
        username: dev,
      });

      console.log(data);

      if (success) {
        const { _id } = data;
        await AsyncStorage.setItem('dev', _id);
        navigation.navigate('Main', { dev: _id });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <KeyboardAvoidingView behavior="padding" enabled={Platform.OS === 'ios'} style={styles.container}>
      <Image source={logo} />
      <TextInput
        placeholder="Digite seu usuário no Github"
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor="#999"
        value={dev}
        onChangeText={setDev}
        style={styles.input}
      />
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

export default Login;
