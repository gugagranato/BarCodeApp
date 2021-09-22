import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [information, setInformation] = useState(false);
  const [text, setText] = useState()

  const bd = [
    {
      ean: 7898901646051,
      name: 'Água mineral Karisa',
      price: 'R$ 10,00'
    },
    {
      ean: 7896048606938,
      name: 'Creme de ureia',
      price: 'R$ 11,00'
    },
    {
      ean: 7298901641231,
      name: 'Mostarda',
      price: 'R$ 12,00'
    }
  ]

  const bdMarket = [
    {
      ean: 7898901646051,
      name: 'Água mineral Karisa',
      price: 'R$ 10,00'
    },
    {
      ean: 7896048606938,
      name: 'Creme de ureia',
      price: 'R$ 13,00'
    },
    {
      ean: 7298901641231,
      name: 'Mostarda',
      price: 'R$ 12,00'
    }
  ]

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })()
  }

  // Request Camera Permission
  useEffect(() => {
    askForCameraPermission();
  }, []);

  // What happens when we scan the bar code
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    const filterDataMarket = bdMarket.filter((item) => item.ean === +data)
    const filterData = bd.filter((item) => item.ean === +data)
    if(filterData[0].price !== filterDataMarket[0].price) {
      setInformation(true)
      setText(filterDataMarket)
    }
    setText(filterDataMarket)
  };

  // Check permissions and return the screens
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>)
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>No access to camera</Text>
        <Button title={'Allow Camera'} onPress={() => askForCameraPermission()} />
      </View>)
  }

  const handleScanAgain = () => {
    setScanned(false)
    setInformation(false)
    setText()
  }
  // useEffect(() => {
  //   text && console.log(text, 'obj')
  // }, [])
  // Return the View
  return (
    <View style={styles.container}>
      <View style={styles.barcodebox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ height: 400, width: 400 }} />
      </View>
      {information ? (
        <>
          <Text style={styles.maintext}>EAN: {text[0].ean} </Text>
          <Text style={styles.maintext}>Nome: {text[0].name} </Text>
          
          <Text style={styles.maintext}>Atenção: houve alteração no preço.</Text>
          <Text style={styles.maintextbold}>O novo valor é {text[0].price}</Text>
          <TouchableOpacity>
            <Text style={{fontSize: 22, fontWeight: '600', marginBottom: 20}}>Atualizar</Text>
          </TouchableOpacity>
        </>
      ): text ? (
        <>
          <Text style={styles.maintext}>EAN: {text[0].ean} </Text>
          <Text style={styles.maintext}>Nome: {text[0].name} </Text>
          <Text style={styles.maintext}>Preço: {text[0].price} </Text>
        </>
      ) : <Text>Nenhum produto escaneado</Text>}

      {scanned && <Button title={'Scan again?'} onPress={() => handleScanAgain()} color='blue' />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  maintext: {
    fontSize: 16,
    margin: 20,
  },
  maintextbold: {
    fontSize: 16,
    margin: 20,
    fontWeight: '700'
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: 'red'
  }
});
