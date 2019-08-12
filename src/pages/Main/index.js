/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Image, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../../services/api';

import logo from '../../assets/logo.png';
import like from '../../assets/like.png';
import dislike from '../../assets/dislike.png';
import styles from './styles';

function Main({ navigation }) {
  const dev = navigation.getParam('dev');

  const [devs, setDevs] = useState([]);

  useEffect(() => {
    async function loadUsers() {
      try {
        const {
          data: { success, data },
        } = await api.get('/devs', {
          headers: { user: dev },
        });

        if (success) {
          setDevs(data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    loadUsers();
  }, [dev]);

  async function handleLike() {
    try {
      const [{ _id }, ...rest] = devs;

      const {
        data: { success },
      } = await api.post(`/devs/${_id}/like`, null, {
        headers: { user: dev },
      });

      if (success) {
        setDevs(rest);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDislike() {
    try {
      const [{ _id }, ...rest] = devs;

      const {
        data: { success },
      } = await api.post(`/devs/${_id}/dislike`, null, {
        headers: { user: dev },
      });

      if (success) {
        setDevs(rest);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleLogout() {
    await AsyncStorage.clear();
    navigation.navigate('Login');
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleLogout}>
        <Image source={logo} style={styles.logo} />
      </TouchableOpacity>
      {devs.length > 0 && (
        <>
          <View style={styles.cardsContainer}>
            {devs.map((devItem, index) => (
              <View key={devItem._id} style={[styles.card, { zIndex: devs.length - index }]}>
                <Image style={styles.avatar} source={{ uri: devItem.avatar }} />
                <View style={styles.footer}>
                  <Text style={styles.name}>{devItem.name}</Text>
                  <Text style={styles.bio} numberOfLines={2}>
                    {devItem.bio}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={handleDislike} style={styles.button}>
              <Image source={dislike} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLike} style={styles.button}>
              <Image source={like} />
            </TouchableOpacity>
          </View>
        </>
      )}
      {devs.length === 0 && (
        <View style={styles.emptyWrapper}>
          <Text style={styles.empty}>Acabou :(</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

export default Main;
