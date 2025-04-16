import {ImageBackground, Text, View} from 'react-native';
import React, {StrictMode} from 'react';
import {useTranslation} from 'react-i18next';
import { styles } from '../styles/HomePageStyle.ts';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
const HomePage = ()=> {
    let { t } = useTranslation();
    return (
        <StrictMode>
            <ImageBackground
                source={require('./../assets/images/sample_1920×1280.png')}
                resizeMode="cover"
            >
        <View style={styles.container}>
            <View style={styles.topContainer} >

                <MaskedView
                    maskElement={
                        <LinearGradient
                            style={styles.mask}
                            colors={['rgba(0,0,0,1)', 'rgba(0,0,0,0.0)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            locations={[0, 1]}
                        />
                    }
                >
                    <Text style={styles.temperatureMain}>10°C</Text>
                </MaskedView>
            </View>
           <View style={styles.detailsGrid}>
               <View style={styles.row}>
                    <View style={styles.cell}>
                        <View style={styles.detailsPanel} />
                    </View>
                    <View style={styles.cell}>
                        <View style={styles.detailsPanel} />
                    </View>
                </View>
               <View style={styles.row}>
                    <View style={styles.cell}>
                        <View style={styles.detailsPanel} />
                    </View>
                    <View style={styles.cell}>
                        <View style={styles.detailsPanel} />
                    </View>
                </View>
               <View style={styles.row}>
                   <View style={styles.cell}>
                       <View style={styles.detailsPanel} />
                   </View>
                   <View style={styles.cell}>
                       <View style={styles.detailsPanel} />
                   </View>
               </View>
               <View style={styles.row}>
                   <View style={styles.cell}>
                       <View style={styles.forecastPanel} />
                   </View>
               </View>
            </View>
        </View>
            </ImageBackground>
        </StrictMode>
    );
};
export default HomePage;
