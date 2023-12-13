import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  Button,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  Linking,
} from 'react-native';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { MyInput, MyGap, MyButton } from '../../components';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import { storeData, getData, urlAPI } from '../../utils/localStorage';
import { showMessage } from 'react-native-flash-message';
import { Icon } from 'react-native-elements';


export default function Login({ navigation }) {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(true);
  const [show, setShow] = useState(true);
  const [token, setToken] = useState('');
  const [data, setData] = useState({
    telepon: '',
    password: '',
  });

  const [comp, setComp] = useState({});

  useEffect(() => {
    getData('token').then(res => {
      console.log('data token,', res);
      setToken(res.token);
    });

    axios.post(urlAPI + '/company.php').then(res => {
      setComp(res.data)
    })
  }, []);

  // login ok
  const masuk = () => {
    if (data.telepon.length === 0 && data.password.length === 0) {
      showMessage({
        message: 'Maaf telepon dan Password masih kosong !',
      });
    } else if (data.telepon.length === 0) {
      showMessage({
        message: 'Maaf telepon masih kosong !',
      });
    } else if (data.password.length === 0) {
      showMessage({
        message: 'Maaf Password masih kosong !',
      });
    } else {
      setLoading(true);
      console.log(data);
      setTimeout(() => {
        axios
          .post(urlAPI + '/login.php', data)
          .then(res => {
            console.log(res.data);
            setLoading(false);
            if (res.data.kode == 50) {
              showMessage({
                type: 'danger',
                message: res.data.msg,
              });
            } else {
              storeData('user', res.data);
              axios
                .post(urlAPI + '/update_token.php', {
                  id_member: res.data.id,
                  token: token,
                })
                .then(res => {
                  console.log('update token', res);
                });

              navigation.replace('MainApp');
            }
          });
      }, 1200);
    }
  };
  return (
    <ImageBackground style={styles.page}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          marginTop: 20,
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../../assets/logo.png')}
            style={{
              width: 200,
              height: 200,
            }}
          />
          <Text
            style={{
              fontFamily: fonts.secondary[600],
              fontStyle: 'italic',
              fontSize: windowWidth / 20,
              color: colors.black,
              textAlign: 'center',
            }}>
            Cita Rasa Khas
          </Text>
          <Text
            style={{
              fontFamily: fonts.secondary[600],
              fontSize: windowWidth / 15,
              color: colors.danger,
              textAlign: 'center',
            }}>
            Lereng Bromo
          </Text>

        </View>
        <View style={styles.page}>


          <MyGap jarak={20} />
          <MyInput
            placeholder="Masukan nomor telepon"
            keyboardType='phone-pad'
            label="Telepon"
            iconname="call"
            value={data.telepon}
            onChangeText={value =>
              setData({
                ...data,
                telepon: value,
              })
            }
          />

          <MyGap jarak={20} />
          <MyInput
            label="Password"
            placeholder="*******"
            iconname="key"
            secureTextEntry={show}
            onChangeText={value =>
              setData({
                ...data,
                password: value,
              })
            }
          />

          <TouchableOpacity onPress={() => {
            Linking.openURL('https://wa.me/' + comp.tlp)
          }} style={{
            paddingHorizontal: 5,
            paddingVertical: 10,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            flexDirection: 'row'
          }}>
            <Text style={{
              left: 5,
              color: colors.danger,
              fontFamily: fonts.secondary[600],
              fontSize: windowWidth / 30
            }}>Lupa Password ?</Text>
          </TouchableOpacity>


          <MyGap jarak={40} />
          {valid && (
            <MyButton
              warna={colors.primary}
              title="Masuk"
              Icons="log-in"
              onPress={masuk}
            />
          )}

          <TouchableOpacity onPress={() => {
            navigation.navigate('Register');
          }} style={{
            paddingHorizontal: 5,
            paddingVertical: 10,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row'
          }}>
            <Text style={{
              left: 5,
              fontFamily: fonts.secondary[600],
              fontSize: windowWidth / 30
            }}>Tidak Memiliki Akun ? <Text style={{
              color: colors.danger,
            }}>Daftar</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {
        loading && (
          <LottieView
            source={require('../../assets/animation.json')}
            autoPlay
            loop
            style={{ backgroundColor: colors.primary }}
          />
        )
      }
    </ImageBackground >
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 10,
  },
  image: {
    aspectRatio: 1.5,
    resizeMode: 'contain',
  },
});
