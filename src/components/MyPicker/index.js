import React from 'react';
import { StyleSheet, Text, View, Picker } from 'react-native';
import { Icon, ListItem, Button } from 'react-native-elements';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';

export default function MyPicker({
  label,
  iconname,
  onValueChange,
  onChangeText,
  value,
  keyboardType,
  secureTextEntry,
  styleInput,
  placeholder,
  label2,
  styleLabel,
  colorIcon = colors.primary,
  data = [],
}) {
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 0,
        }}>
        <Icon type="ionicon" name={iconname} color={colors.black} size={16} />
        <Text
          style={{
            fontFamily: fonts.secondary[600],
            color: colors.black,
            left: 10,
            fontSize: 14,
            ...styleLabel,
          }}>
          {label}
        </Text>
      </View>

      <View style={{
        borderWidth: 1,
        backgroundColor: colors.white,
        borderRadius: 10,
        marginTop: 5,
        fontFamily: fonts.secondary[600],
        borderColor: colors.primary,
      }}>
        <Picker style={{ height: 48, transform: [{ scale: 0.9 }] }}
          selectedValue={value} onValueChange={onValueChange}>
          {data.map(item => {
            return <Picker.Item textStyle={{ fontSize: 12 }} value={item.value} label={item.label} />;
          })}
        </Picker>
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
