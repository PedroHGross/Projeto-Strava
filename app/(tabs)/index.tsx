import * as Location from 'expo-location';
import { Link } from 'expo-router';
import { useState } from 'react';
import {
  Button,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function HomeScreen() {
  // Estados do CEP
  const [cep, setCep] = useState('');
  const [erro, setErro] = useState('');
  const [endereco, setEndereco] = useState<any>(null);
  const [carregando, setCarregando] = useState(false);

  // Estados da localização
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // Buscar CEP
  async function buscarCep() {
    setErro('');
    setEndereco(null);

    if (cep.length !== 8) {
      setErro('Digite um CEP com 8 números.');
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch(
        `https://viacep.com.br/ws/${cep}/json/`
      );

      const dados = await resposta.json();

      if (dados.erro) {
        setErro('CEP não encontrado.');
        return;
      }

      setEndereco(dados);
    } catch (erro) {
      setErro('Não foi possível consultar o CEP.');
    } finally {
      setCarregando(false);
    }
  }

  // Descobrir localização
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

  // Abrir Google Maps
  function abrirMapa() {
    if (latitude !== null && longitude !== null) {
      Linking.openURL(
        `https://www.google.com/maps?q=${latitude},${longitude}`
      );
    }
  }

  return (
    <View style={styles.container}>

      {/* MENU */}
      <View style={styles.topo}>
        <Text style={styles.logo}>ϟ STRAVA</Text>

        <Text>Painel</Text>
        <Text>Treinamento</Text>

        <Link href="/detalhes">
          <Text>Mapas</Text>
        </Link>

        <Text>Desafios</Text>
      </View>

      {/* CONTEÚDO */}
      <View style={styles.conteudo}>

        {/* PERFIL */}
        <View style={styles.perfil}>
          <Text style={styles.foto}>P</Text>

          <Text style={styles.nome}>Pedro Gross</Text>

          <Text>Seguindo: 1</Text>
          <Text>Seguidores: 6.7B</Text>
          <Text>Atividades: 6.756</Text>
        </View>

        {/* LOCALIZAÇÃO */}
        <View style={styles.localizacao}>
          <Text style={styles.titulo}>
            Minha localização
          </Text>

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

          {/* BUSCAR CEP */}
          <Text style={styles.titulo}>
            Buscar endereço
          </Text>

          <Text>
            Digite um CEP para consultar o endereço:
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Ex: 93380000"
            keyboardType="numeric"
            value={cep}
            onChangeText={setCep}
            maxLength={8}
          />

          <Button
            title={carregando ? 'Buscando...' : 'Buscar CEP'}
            onPress={buscarCep}
            disabled={carregando}
          />

          {erro !== '' && (
            <Text style={styles.error}>
              {erro}
            </Text>
          )}

          {endereco && (
            <View style={styles.resultadoCep}>
              <Text style={styles.subtitle}>
                Endereço encontrado:
              </Text>

              <Text>CEP: {endereco.cep}</Text>
              <Text>Rua: {endereco.logradouro}</Text>
              <Text>Bairro: {endereco.bairro}</Text>
              <Text>Cidade: {endereco.localidade}</Text>
              <Text>Estado: {endereco.uf}</Text>
            </View>
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
    width: 400,
  },

  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  resultado: {
    fontSize: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },

  error: {
    color: 'red',
    fontSize: 16,
  },

  resultadoCep: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    gap: 5,
  },

  subtitle: {
    fontSize: 17,
    fontWeight: 'bold',
  },
});