import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  Image,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { color, asin } from 'react-native-reanimated';
import { getData, storeData } from '../../utils/localStorage';
import { PermissionsAndroid } from 'react-native';
import LottieView from 'lottie-react-native';
import axios from 'axios';

export default function Splash({ navigation }) {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const scaleBottom = new Animated.Value(0.4);

  Animated.timing(scaleBottom, {
    toValue: 0.3,
    duration: 1000,
  }).start();



  useEffect(() => {

    const unsubscribe = getData('user').then(res => {
      // console.log(res);
      if (!res) {
        // console.log('beum login');

        setTimeout(() => {
          navigation.replace('Login');
        }, 1500);
      } else {
        console.log('sudah login logon');

        setTimeout(() => {
          navigation.replace('MainApp');
        }, 1500);
      }
    });
  }, []);

  return (
    <ImageBackground source={require('../../assets/utama.png')} style={styles.page}>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
        }}>


        <Animated.View style={{
          flex: scaleBottom,
          padding: 20,
        }}>
          <View style={{
            flexDirection: 'row',
          }}>
            <Text style={{
              fontFamily: fonts.secondary[400],
              fontSize: windowWidth / 12,
              color: colors.white
            }}>Welcome to </Text>
            <Image source={require('../../assets/hallo.png')} style={{
              width: 40,
              height: 40,
              resizeMode: 'contain'
            }} />
          </View>
          <Text style={{
            marginTop: 10,
            fontFamily: fonts.secondary[600],
            fontSize: windowWidth / 7,
            color: colors.white
          }}>KALLWA</Text>
          <Text style={{
            marginTop: 20,
            fontFamily: fonts.secondary[400],
            fontSize: windowWidth / 25,
            color: colors.white
          }}>Tulis cerita Anda sendiri dengan setiap{'\n'}
            cangkir kopi yang Anda nikmati.</Text>

        </Animated.View>



      </View>
    </ImageBackground >
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.white,
    flex: 1,
  },
  image: {
    aspectRatio: 1,
    width: 250,
    height: 250,
  },
});
