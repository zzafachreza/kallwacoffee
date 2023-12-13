import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Dimensions,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ImageBackground,
} from 'react-native';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { storeData, getData, urlAPI } from '../../utils/localStorage';
import { Icon } from 'react-native-elements';
import MyCarouser from '../../components/MyCarouser';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import 'intl';
import 'intl/locale-data/jsonp/en';
import LottieView from 'lottie-react-native';
import { useIsFocused } from '@react-navigation/native';
import { MyGap } from '../../components';

export default function Home({ navigation }) {
  const [user, setUser] = useState({});
  const [kategori, setKategori] = useState([]);
  const [cart, setCart] = useState(0);
  const [token, setToken] = useState('');

  const isFocused = useIsFocused();

  useEffect(() => {

    const unsubscribe = messaging().onMessage(async remoteMessage => {

      const json = JSON.stringify(remoteMessage);
      const obj = JSON.parse(json);

      alert(remoteMessage)

      // console.log(obj);

      // alert(obj.notification.title)



      PushNotification.localNotification({
        /* Android Only Properties */
        channelId: 'kallwacoffee', // (required) channelId, if the channel doesn't exist, notification will not trigger.
        title: obj.notification.title, // (optional)
        message: obj.notification.body, // (required)
      });
    });

    getDataKategori();

    if (isFocused) {
      __getDataUserInfo();
    }
    return unsubscribe;
  }, [isFocused]);

  const [buka, setBuka] = useState({
    a: false,
    b: false,
    c: false

  })


  const getDataKategori = () => {
    axios.post(urlAPI + '/1data_barang.php').then(res => {
      console.log('barang', res.data);

      setKategori(res.data);
    })
  }


  const __getDataUserInfo = () => {
    getData('user').then(users => {
      console.log(users);
      setUser(users);
      axios.post(urlAPI + '/1_cart.php', {
        fid_user: users.id
      }).then(res => {
        console.log('cart', res.data);

        setCart(parseFloat(res.data))
      })
      getData('token').then(res => {
        console.log('data token,', res);
        setToken(res.token);
        axios
          .post(urlAPI + '/update_token.php', {
            id: users.id,
            token: res.token,
          })
          .then(res => {
            console.error('update token', res.data);
          });
      });
    });
  }

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const ratio = 192 / 108;


  const __renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Pinjam', item);
      }}
      style={{
        flex: 1,
        margin: 5,

      }}>
      <Image source={{
        uri: item.image
      }} style={{
        alignSelf: 'center',
        // resizeMode: 'contain',
        width: '100%',
        borderRadius: 10,
        height: 200,

      }} />

      {item.diskon > 0 &&
        <Text
          style={{
            fontSize: windowWidth / 30,
            color: colors.black,
            textAlign: 'right',
            marginRight: 2,
            textDecorationLine: 'line-through',
            textDecorationStyle: 'solid',
            fontFamily: fonts.secondary[600],
          }}>
          Rp. {new Intl.NumberFormat().format(item.harga_dasar)}
        </Text>
      }
      {item.diskon > 0 && <Text
        style={{
          fontSize: windowWidth / 35,
          padding: 5,
          maxWidth: '40%',
          margin: 2,
          borderRadius: 5,
          textAlign: 'center',
          alignSelf: 'flex-end',
          color: colors.white,
          backgroundColor: colors.tertiary,
          fontFamily: fonts.secondary[600],
        }}>
        Disc {new Intl.NumberFormat().format(item.diskon)}%
      </Text>}



      {item.diskon == 0 &&
        <Text
          style={{
            fontSize: windowWidth / 30,
            color: colors.zavalabs,
            textAlign: 'right',
            marginLeft: 5,
            textDecorationLine: 'line-through',
            textDecorationStyle: 'solid',
            fontFamily: fonts.secondary[600],
          }}>

        </Text>
      }
      {item.diskon == 0 && <Text
        style={{
          fontSize: windowWidth / 35,
          padding: 5,
          maxWidth: '40%',
          margin: 2,
          borderRadius: 5,
          textAlign: 'center',
          alignSelf: 'flex-end',
          color: colors.primary,

          fontFamily: fonts.secondary[600],
        }}>

      </Text>}



      <Text
        style={{
          paddingLeft: 5,
          fontSize: windowWidth / 25,
          color: colors.primary,
          fontFamily: fonts.secondary[600],
        }}>
        Rp. {new Intl.NumberFormat().format(item.harga_barang)}
      </Text>
      {/* <Text
        style={{
          padding: 5,
          backgroundColor: colors.primary,
          fontSize: windowWidth / 35,
          color: colors.white, borderRadius: 2,
          fontFamily: fonts.secondary[400],
        }}>
        {item.nama_kategori}
      </Text> */}
      <Text
        style={{
          padding: 5,
          height: 50,
          fontSize: windowWidth / 30,
          color: colors.black, borderRadius: 2,
          fontFamily: fonts.secondary[400],
        }}>
        {item.nama_barang}
      </Text>






    </TouchableOpacity>
  );


  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>

      <View
        style={{
          height: windowHeight / 10,
          padding: 10,
          backgroundColor: colors.white,
        }}>


        <View style={{
          flexDirection: 'row'
        }}>
          <View style={{
            flex: 1,
          }}>
            <Text style={{
              fontFamily: fonts.secondary[600],
              fontSize: 15
            }}>Selamat datang,</Text>
            <Text style={{
              fontFamily: fonts.secondary[800],
              fontSize: 15
            }}>{user.nama_lengkap}</Text>
          </View>



          <TouchableOpacity
            onPress={() => navigation.navigate('Cart')}
            style={{
              position: 'relative',
              width: 50,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center'


            }}>
            <Icon type='ionicon' name="cart-outline" color={colors.primary} />
            <Text style={{
              position: 'absolute', top: 2, right: 2, bottom: 5, backgroundColor: colors.black, width: 18,
              textAlign: 'center',
              height: 18, borderRadius: 10, color: colors.white
            }} >{cart}</Text>

          </TouchableOpacity>
        </View>


      </View>

      <ScrollView>
        <MyGap jarak={10} />
        <MyCarouser />



        <View style={{
          flex: 1,
          padding: 20,
          borderTopWidth: 3,
          borderTopColor: colors.border,
          marginTop: 20,
        }}>
          <View style={{
            flexDirection: 'row',
            flex: 1,
            marginVertical: 10,
            alignItems: 'center'
          }}>
            <Icon type='ionicon' name="grid" color={colors.black} size={20} />
            <Text style={{
              left: 10,
              color: colors.black,
              fontFamily: fonts.secondary[600],
              fontSize: windowWidth / 30,
            }}>Menu Produk Kami</Text>
          </View>
          <TouchableWithoutFeedback onPress={() => navigation.navigate('Barang', {
            key: 0,
            id_user: user.id
          })}>

            <ImageBackground source={require('../../assets/btn.png')} style={{
              height: 80,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 20,
              width: '100%'
            }}>
              <Text style={{
                fontFamily: fonts.secondary[400],
                color: colors.white,
                textAlign: 'center',
                fontSize: windowWidth / 15
              }}>Klik Disini</Text>
            </ImageBackground>

          </TouchableWithoutFeedback>
        </View>

        <View style={{
          flex: 1,
          padding: 20,
          borderTopWidth: 3,
          borderTopColor: colors.border,
          marginTop: 20,
        }}>
          <View style={{
            flexDirection: 'row',
            flex: 1,
            marginVertical: 10,
            alignItems: 'center'
          }}>
            <Icon type='ionicon' name="help-circle" color={colors.black} size={20} />
            <Text style={{
              left: 10,
              color: colors.black,
              fontFamily: fonts.secondary[600],
              fontSize: windowWidth / 30,
            }}>FAQ</Text>
          </View>

          {/* FAQ1 */}
          <TouchableWithoutFeedback onPress={() => {
            setBuka({
              ...buka,
              a: !buka.a
            })
          }}>
            <View style={{
              borderWidth: 1,
              padding: 10,
              zIndex: 10,
              backgroundColor: colors.white,
              borderRadius: 50,
              borderColor: colors.border
            }}>
              <Text style={{
                fontFamily: fonts.secondary[400],
                fontSize: 12
              }}>Bagaimana cara saya membuat akun di KALLWA? </Text>
            </View>
          </TouchableWithoutFeedback>
          {buka.a && <View style={{
            padding: 10,
            marginTop: -5,
            borderColor: colors.border,
            borderWidth: 1,
            marginHorizontal: 10,
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
          }}>
            <View style={{
              flexDirection: 'row'
            }}>
              <Text style={{
                fontFamily: fonts.secondary[400],
                fontSize: 12
              }}>1. </Text>
              <Text style={{
                fontFamily: fonts.secondary[400],
                fontSize: 12
              }}>Isi formulir pendaftaran dengan informasi pribadi Anda, nama, alamat email, nomor telepon,
                dan kata sandi. </Text>
            </View>
            <View style={{
              flexDirection: 'row'
            }}>
              <Text style={{
                fontFamily: fonts.secondary[400],
                fontSize: 12
              }}>2. </Text>
              <Text style={{
                fontFamily: fonts.secondary[400],
                fontSize: 12
              }}>Pastikan untuk mengikuti panduan keamanan yang disarankan,menggunakan
                kata sandi yang kuat.
              </Text>
            </View>
            <View style={{
              flexDirection: 'row'
            }}>
              <Text style={{
                fontFamily: fonts.secondary[400],
                fontSize: 12
              }}>3. </Text>
              <Text style={{
                fontFamily: fonts.secondary[400],
                fontSize: 12
              }}>ikuti petunjuk selanjutnya yang mungkin termasuk verifikasi email atau nomor telepon Anda. </Text>
            </View>
          </View>}


          {/* FAQ2 */}
          <TouchableWithoutFeedback onPress={() => {
            setBuka({
              ...buka,
              b: !buka.b
            })
          }}>
            <View style={{
              marginTop: 20,
              borderWidth: 1,
              padding: 10,
              zIndex: 10,
              backgroundColor: colors.white,
              borderRadius: 50,
              borderColor: colors.border
            }}>
              <Text style={{
                fontFamily: fonts.secondary[400],
                fontSize: 12
              }}>Bagaimana cara saya melacak pesanan saya? </Text>
            </View>
          </TouchableWithoutFeedback>
          {buka.b && <View style={{
            padding: 10,
            marginTop: -5,
            borderColor: colors.border,
            borderWidth: 1,
            marginHorizontal: 10,
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
          }}>
            <View style={{
              flexDirection: 'row'
            }}>
              <Text style={{
                fontFamily: fonts.secondary[400],
                fontSize: 12
              }}>1. </Text>
              <Text style={{
                fontFamily: fonts.secondary[400],
                fontSize: 12
              }}>Cek Email atau Konfirmasi Pesanan. </Text>
            </View>
            <View style={{
              flexDirection: 'row'
            }}>
              <Text style={{
                fontFamily: fonts.secondary[400],
                fontSize: 12
              }}>2. </Text>
              <Text style={{
                fontFamily: fonts.secondary[400],
                fontSize: 12
              }}>Gunakan Situs Web Pelacakan Pengiriman.
              </Text>
            </View>
            <View style={{
              flexDirection: 'row'
            }}>
              <Text style={{
                fontFamily: fonts.secondary[400],
                fontSize: 12
              }}>3. </Text>
              <Text style={{
                fontFamily: fonts.secondary[400],
                fontSize: 12
              }}>Hubungi Layanan Pelanggan.
              </Text>
            </View>
          </View>}


          {/* FAQ3 */}
          <TouchableWithoutFeedback onPress={() => {
            setBuka({
              ...buka,
              c: !buka.c
            })
          }}>
            <View style={{
              marginTop: 20,
              borderWidth: 1,
              padding: 10,
              zIndex: 10,
              backgroundColor: colors.white,
              borderRadius: 50,
              borderColor: colors.border
            }}>
              <Text style={{
                fontFamily: fonts.secondary[400],
                fontSize: 12
              }}>Apakah saya dapat mengganti atau membatalkan pesanan saya? </Text>
            </View>
          </TouchableWithoutFeedback>
          {buka.c && <View style={{
            padding: 10,
            marginTop: -5,
            borderColor: colors.border,
            borderWidth: 1,
            marginHorizontal: 10,
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
          }}>
            <View style={{
              flexDirection: 'row'
            }}>
              <Text style={{
                fontFamily: fonts.secondary[400],
                fontSize: 12
              }}>1. </Text>
              <Text style={{
                fontFamily: fonts.secondary[400],
                fontSize: 12
              }}>periksa kebijakan pembatalan dan pengembalian dari KALLWA COFFEE ini. </Text>
            </View>
            <View style={{
              flexDirection: 'row'
            }}>
              <Text style={{
                fontFamily: fonts.secondary[400],
                fontSize: 12
              }}>2. </Text>
              <Text style={{
                fontFamily: fonts.secondary[400],
                fontSize: 12
              }}> Jika Anda ingin mengganti atau membatalkan pesanan, segera hubungi layanan kami.

              </Text>
            </View>
            <View style={{
              flexDirection: 'row'
            }}>
              <Text style={{
                fontFamily: fonts.secondary[400],
                fontSize: 12
              }}>3. </Text>
              <Text style={{
                fontFamily: fonts.secondary[400],
                fontSize: 12
              }}>Periksa status pesanan Anda untuk memastikan bahwa pesanan belum dikirim atau diproses .
              </Text>
            </View>
          </View>}

        </View>
      </ScrollView>

    </SafeAreaView>
  );
}
