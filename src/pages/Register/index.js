import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  Button,
  View,
  Image,
  ScrollView,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Switch,
  SafeAreaView,
} from 'react-native';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { MyInput, MyGap, MyButton, MyPicker } from '../../components';
import axios from 'axios';
import { showMessage } from 'react-native-flash-message';
import LottieView from 'lottie-react-native';
import { urlAPI } from '../../utils/localStorage';
import { Icon } from 'react-native-elements';

export default function Register({ navigation }) {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [open, setOpen] = useState(false);
  const [kota, setKota] = useState([]);
  const [show, setShow] = useState(true);
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const validate = text => {
    // console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      // console.log('Email is Not Correct');
      setData({ ...data, email: text });
      setValid(false);
      return false;
    } else {
      setData({ ...data, email: text });
      setValid(true);
      // console.log('Email is Correct');
    }
  };

  const [data, setData] = useState({
    nama_lengkap: '',
    nip: '',
    email: '',
    password: '',
    telepon: '',
    kota: ''
  });
  const [oke, setOKE] = useState(false)

  const simpan = () => {
    if (!oke) {
      showMessage({
        message: 'syarat & ketentuan dan kebijakan privasi wajib di centang',
      });
    } else if (
      data.nama_lengkap.length === 0 &&
      data.password.length === 0 &&
      data.telepon.length === 0 &&
      data.kota.length === 0
    ) {
      showMessage({
        message: 'Maaf Semua Field Harus Di isi !',
      });
    } else if (data.nama_lengkap.length === 0) {
      showMessage({
        message: 'Maaf Nama Lengkap masih kosong !',
      });
    } else if (data.kota.length === 0) {
      showMessage({
        message: 'Maaf Kota  - provinsi masih kosong !',
      });
    } else if (data.telepon.length === 0) {
      showMessage({
        message: 'Maaf Telepon masih kosong !',
      });
    } else if (data.password.length === 0) {
      showMessage({
        message: 'Maaf Password masih kosong !',
      });
    } else {
      setLoading(true);
      console.log(data);
      axios
        .post(urlAPI + '/register.php', data)
        .then(res => {
          console.warn(res.data);
          let err = res.data.split('#');

          // console.log(err[0]);
          if (err[0] == 50) {
            setTimeout(() => {
              setLoading(false);
              showMessage({
                message: err[1],
                type: 'danger',
              });
            }, 1200);
          } else {
            setTimeout(() => {
              navigation.replace('Success', {
                messege: res.data,
              });
            }, 1200);
          }
        });
    }
  };




  return (
    <ImageBackground
      style={{
        flex: 1,
        color: colors.white,

      }}>
      {/* <Switch onValueChange={toggleSwitch} value={isEnabled} /> */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.page}>
        <Image
          source={require('../../assets/logo.png')}
          style={{
            width: 100,
            height: 100,
            alignSelf: 'center'
          }}
        />

        <Text
          style={{
            fontFamily: fonts.secondary[600],
            fontStyle: 'italic',
            fontSize: windowWidth / 22,
            color: colors.black,
            textAlign: 'center',
          }}>
          Cita Rasa Khas
        </Text>
        <Text
          style={{
            fontFamily: fonts.secondary[600],
            fontSize: windowWidth / 20,
            color: colors.danger,
            textAlign: 'center',
          }}>
          Lereng Bromo
        </Text>


        <MyGap jarak={10} />
        <MyInput
          label="Nama Lengkap *"
          iconname="person"
          value={data.nama_lengkap}
          onChangeText={value =>
            setData({
              ...data,
              nama_lengkap: value,
            })
          }
        />





        <MyGap jarak={10} />
        <MyInput
          label="Telepon *"
          iconname="call"
          keyboardType="phone-pad"
          value={data.telepon}
          onChangeText={value =>
            setData({
              ...data,
              telepon: value,
            })
          }
        />
        <MyGap jarak={10} />
        <MyInput
          label="Kota - Provinsi *"
          iconname="location"
          value={data.kota}
          onChangeText={value => {
            setData({
              ...data,
              kota: value,
            })
            if (value.length > 0) {
              axios.post(urlAPI + '/1kota.php', {
                key: value
              }).then(res => {
                setOpen(true);
                console.warn('get user', res.data);
                setKota(res.data);
              })
            }
          }
          }
        />
        <MyGap jarak={10} />
        {open && <ScrollView showsVerticalScrollIndicator={false} style={{
          backgroundColor: colors.border
        }}>

          <TouchableOpacity onPress={() => setOpen(false)} style={{
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'flex-end',
            paddingRight: 10,
          }}>
            <Icon name='close' type='ionicon' color={colors.white} />
          </TouchableOpacity>

          {kota.map(i => {
            return (
              <TouchableOpacity onPress={() => {
                setData({
                  ...data,
                  fid_kota: i.id,
                  kota: i.kota
                });
                setOpen(false);
              }} style={{
                padding: 10,
                backgroundColor: colors.white,
                marginVertical: 1,
              }}>
                <Text>{i.kota}</Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>}
        <MyGap jarak={10} />
        <MyInput
          label="Alamat lengkap *"
          iconname="map"
          value={data.alamat}
          onChangeText={value =>
            setData({
              ...data,
              alamat: value,
            })
          }
        />




        <MyGap jarak={10} />
        <MyInput
          label="Password"
          iconname="key"
          secureTextEntry={show}
          value={data.password}
          onChangeText={value =>
            setData({
              ...data,
              password: value,
            })
          }
        />


        <MyGap jarak={20} />

        <TouchableOpacity onPress={() => setOKE(!oke)} style={{
          flexDirection: 'row',
          paddingHorizontal: 5,
          alignItems: 'center',
          marginBottom: 10,
        }}>
          <Icon type='ionicon' size={20} name={oke ? 'checkbox' : 'checkbox-outline'} />
          <Text style={{
            fontFamily: fonts.secondary[400],
            fontSize: 12,
            left: 10,
          }}>Dengan masuk atau mendaftar, anda menyetujui syarat & ketentuan dan kebijakan privasi</Text>
        </TouchableOpacity>

        <MyButton
          warna={colors.primary}
          title="REGISTER"
          Icons="log-in"
          onPress={simpan}
        />

        <MyGap jarak={20} />
      </ScrollView>
      {loading && (
        <LottieView
          source={require('../../assets/animation.json')}
          autoPlay
          loop
          style={{
            flex: 1,
            backgroundColor: colors.primary,
          }}
        />
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: 10,
  },
  image: {
    width: 620 / 4,
    height: 160 / 4,
  },
});
