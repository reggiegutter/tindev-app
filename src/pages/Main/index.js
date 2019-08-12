import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Image, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import io from 'socket.io-client';

import api from '../../services/api';
import logo from '../../assets/logo.png';
import like from '../../assets/like.png';
import dislike from '../../assets/dislike.png';
import itsamatch from '../../assets/itsamatch.png';
import styles from './styles';

function Main({ navigation }) {
  const dev = navigation.getParam('dev');

  const [devs, setDevs] = useState([]);
  const [matchDev, setMatchDev] = useState(null);

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

  useEffect(() => {
    const socket = io('http://10.0.2.2:3333', {
      query: { dev },
    });

    socket.on('match', ioDev => {
      setMatchDev(ioDev);
    });
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
      {!!matchDev && (
        <View style={styles.matchContainer}>
          <Image source={itsamatch} style={styles.matchImage} />
          <Image source={{ uri: matchDev.avatar }} style={styles.matchAvatar} />
          <Text style={styles.matchName}>{matchDev.name}</Text>
          <Text style={styles.matchBio}>{matchDev.bio}</Text>
          <TouchableOpacity onPress={() => setMatchDev(null)}>
            <Text style={styles.matchClose}>FECHAR</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

export default Main;
