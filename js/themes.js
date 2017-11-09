import {StyleSheet} from 'react-native';
import theme from 'react-native-theme';

const colors = {
  darkBG1: '#233446',
  darkBG2: '#1b2936',
  darkBG3: '#141d26',
  lightColor1: '#FFFFFF',
  lightColor2: '#8698a6',
}

theme.add({
  headerStyle: {
    backgroundColor: "#FFFFFF",
  },
  headerTitleStyle: {
    color: "#000000"
  },
  listRow: {
    backgroundColor: '#ffffff',
  },
  title: {
    color: '#222222',
  },
  'tab.activeTintColor': {
    color: '#20A0FF'
   },
   'tab.inactiveTintColor': {
    color: '#8492A6'
   },
   'tab.backgroundColor': {
      color: '#FFFFFF'
   }
})


const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: colors.darkBG1,
  },
  headerTitleStyle: {
    color: colors.lightColor1
  },
  settingRow: {
    backgroundColor: colors.darkBG1,
  },
  darkBG: {
    backgroundColor: colors.darkBG2,
  }
});

export default styles;



