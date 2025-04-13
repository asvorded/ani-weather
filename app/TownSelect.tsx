import { Image, StyleSheet, Text, TextInput, View } from "react-native";

import { useTranslation } from "react-i18next";

const TownSelect = () => {
  let { t, i18n } = useTranslation()

  return (
    <View style={styles.screen}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={t("townSelect.textField.placeholder")}
          numberOfLines={1}
          />
        <Image
          style={styles.locationIcon}
          source={require("./../assets/logos/location.png")}
          />
      </View>
      <Text>{t("townSelect.popularCities")}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 10
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingHorizontal: 10,

    backgroundColor: "#f4f4f4",
    borderColor: "#b7b7b7",
    borderWidth: 1,
    borderRadius: 150
  },
  input: {
    flex: 1,
    fontSize: 16
  },
  locationIcon: {
    width: 28,
    height: 28
  }
})

export default TownSelect;