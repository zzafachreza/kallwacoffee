import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fonts, windowWidth } from '../../utils/fonts';
import { colors } from '../../utils/colors';
import axios from 'axios';

export default function Akses({ navigation, route }) {

  console.log(route.params);

  const [open, setOpen] = useState(false)
  const [data, setData] = useState({});

  useEffect(() => {

    const dt = {
      api_key: '4c450715739fdfc443e4fce800bca3ac9a07162e84f6267a58589a4246137084',
      awb: route.params.nomor_resi,
      courier: route.params.kode_kurir,

    };

    axios.get('https://api.binderbyte.com/v1/track?api_key=4c450715739fdfc443e4fce800bca3ac9a07162e84f6267a58589a4246137084&courier=' + route.params.kode_kurir + '&awb=' + route.params.nomor_resi).then(resp => {
      console.log(resp.data.data);

      if (resp.data.status !== 200) {
        alert('Nomor resi tidak ditemukan !');
        navigation.goBack();
      } else {
        setData(resp.data.data);
        setOpen(true);
      }

    }).catch((error) => {
      alert('Nomor resi tidak ditemukan !');
      navigation.goBack();
    })



  }, [])

  const MyList = ({ judul, isi }) => {
    return (
      <View style={{
        flexDirection: 'row',
        padding: 10,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}>
        <View style={{
          flex: 1,
          justifyContent: 'center'
        }}>
          <Text style={{
            fontFamily: fonts.secondary[400],
            fontSize: windowWidth / 30,
            color: colors.black,

          }}>{judul}</Text>
        </View>
        <View style={{
          flex: 1.5,
          justifyContent: 'flex-start',
        }}>
          <Text style={{
            fontFamily: fonts.secondary[600],
            fontSize: windowWidth / 30,
            color: colors.black,

          }}>
            {isi}
          </Text>
        </View>
      </View>
    )
  }


  const MyList2 = ({ judul, isi, jam, kota }) => {
    return (
      <View style={{
        flexDirection: 'row',
        backgroundColor: colors.white,
      }}>
        <View style={{
          flex: 0.5,
          justifyContent: 'center',
          padding: 10,
        }}>
          <Text style={{
            fontFamily: fonts.secondary[400],
            fontSize: windowWidth / 30,
            color: colors.black,

          }}>{judul}</Text>
          <Text style={{
            fontFamily: fonts.secondary[400],
            fontSize: windowWidth / 30,
            color: colors.black,

          }}>{jam}</Text>
        </View>
        <View style={{
          width: 10,
          borderLeftWidth: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: colors.primary,
            width: 10,
            marginLeft: -10,
            height: 10,
            borderRadius: 5,
          }} />
        </View>
        <View style={{
          flex: 1.5,
          padding: 10,
          justifyContent: 'flex-start',
        }}>
          <Text style={{
            fontFamily: fonts.secondary[400],
            fontSize: windowWidth / 30,
            color: colors.black,

          }}>
            {isi}
          </Text>

        </View>
      </View>
    )
  }
  return (
    <SafeAreaView style={{
      flex: 1,
      padding: 10,
    }}>
      <View style={{
        backgroundColor: colors.white,
        marginVertical: 5,
      }}>


        {!open && <ActivityIndicator color={colors.primary} size="large" />}

        {open && <ScrollView showsVerticalScrollIndicator={false}>

          <Text style={{
            fontFamily: fonts.secondary[600],
            fontSize: windowWidth / 30,
            color: colors.danger,
            margin: 10,

          }}>Informasi Pengiriman</Text>

          <MyList judul="Nomor Resi" isi={data.summary.awb} />
          <MyList judul="Tanggal Pengiriman" isi={data.summary.date} />
          <MyList judul="Ekspedisi" isi={data.summary.courier} />
          <MyList judul="Status" isi={data.summary.status} />
          <MyList judul="Pengirim" isi={data.detail.shipper} />
          <MyList judul="Asal" isi={data.detail.origin} />
          <MyList judul="Penerima" isi={data.detail.receiver} />
          <MyList judul="Tujuan" isi={data.detail.destination} />

          <Text style={{
            fontFamily: fonts.secondary[600],
            fontSize: windowWidth / 30,
            color: colors.danger,
            margin: 10,

          }}>Riwayat Pengiriman</Text>


          {data.history.map(i => {
            return (
              <MyList2 judul={i.date} isi={i.desc} />
            )
          })}

        </ScrollView>}



      </View>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})