import * as Location from 'expo-location';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Button, Linking, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  async function descobrirLocalizacao() {
    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      alert('Permissão de localização negada');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});

    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);
  }

  function abrirMapa() {
    if (latitude !== null && longitude !== null) {
      Linking.openURL(
        `https://www.google.com/maps?q=${latitude},${longitude}`
      );
    }
  }

  return (
    <View style={styles.container}>

      <View style={styles.topo}>
        <Text style={styles.logo}>ϟ STRAVA</Text>

        <Text>Painel</Text>
        <Text>Treinamento</Text>

        <Link href="/detalhes">
          <Text>Mapas</Text>
        </Link>

        <Text>Desafios</Text>
      </View>

      <View style={styles.conteudo}>

        <View style={styles.perfil}>
          <Text style={styles.foto}>P</Text>
          <Text style={styles.nome}>Pedro Gross</Text>

          <Text>Seguindo: 1</Text>
          <Text>Seguidores: 6.7B</Text>
          <Text>Atividades: 6.756</Text>
        </View>

        <View style={styles.localizacao}>
          <Text style={styles.titulo}>Minha localização</Text>

          <Button
            title="Descobrir localização"
            onPress={descobrirLocalizacao}
          />

          {latitude !== null && longitude !== null && (
            <>
              <Text style={styles.resultado}>
                Latitude: {latitude}
              </Text>

              <Text style={styles.resultado}>
                Longitude: {longitude}
              </Text>

              <Button
                title="Abrir no Google Maps"
                onPress={abrirMapa}
              />
            </>
          )}
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  topo: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 25,
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },

  logo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginRight: 20,
  },

  conteudo: {
    flex: 1,
    flexDirection: 'row',
    padding: 30,
    gap: 50,
  },

  perfil: {
    width: 250,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    gap: 10,
  },

  foto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ddd',
    textAlign: 'center',
    paddingTop: 15,
    fontSize: 24,
    fontWeight: 'bold',
  },

  nome: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  localizacao: {
    padding: 20,
    gap: 15,
  },

  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  resultado: {
    fontSize: 16,
  },
});