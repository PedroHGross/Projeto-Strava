import * as Location from 'expo-location';
import { Link } from 'expo-router';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../../firebaseConfig';

const TIPOS = ['Corrida', 'Ciclismo', 'Caminhada', 'Natação'];

interface Atividade {
  id: string;
  tipo: string;
  distancia: number;
  duracao: number;
  data: string;
  criadoEm: number;
}

function avisar(titulo: string, mensagem: string) {
  if (Platform.OS === 'web') {
    window.alert(`${titulo}\n${mensagem}`);
  } else {
    Alert.alert(titulo, mensagem);
  }
}

function confirmar(mensagem: string, aoConfirmar: () => void) {
  if (Platform.OS === 'web') {
    if (window.confirm(mensagem)) aoConfirmar();
  } else {
    Alert.alert('Confirmar exclusão', mensagem, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: aoConfirmar },
    ]);
  }
}

const paraNumero = (valor: string) => Number(valor.replace(',', '.'));

function formatarRitmo(distancia: number, duracao: number) {
  const minutosPorKm = duracao / distancia;
  let min = Math.floor(minutosPorKm);
  let seg = Math.round((minutosPorKm - min) * 60);

  if (seg === 60) {
    min += 1;
    seg = 0;
  }

  return `${min}:${String(seg).padStart(2, '0')} /km`;
}

function formatarVelocidade(distancia: number, duracao: number) {
  return `${(distancia / (duracao / 60)).toFixed(1)} km/h`;
}

export default function HomeScreen() {
  const [cep, setCep] = useState('');
  const [erro, setErro] = useState('');
  const [endereco, setEndereco] = useState<any>(null);
  const [carregando, setCarregando] = useState(false);

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [tipo, setTipo] = useState(TIPOS[0]);
  const [distancia, setDistancia] = useState('');
  const [duracao, setDuracao] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);

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
    } catch (e) {
      setErro('Não foi possível consultar o CEP.');
    } finally {
      setCarregando(false);
    }
  }

  // Localização
  async function descobrirLocalizacao() {
    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      avisar('Atenção', 'Permissão de localização negada');
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

  // Validar campos
  const validarCampos = () => {
    const dist = paraNumero(distancia);
    const dur = paraNumero(duracao);

    if (!distancia.trim() || !duracao.trim()) {
      avisar('Atenção', 'Preencha distância e duração');
      return null;
    }

    if (isNaN(dist) || isNaN(dur) || dist <= 0 || dur <= 0) {
      avisar(
        'Atenção',
        'Distância e duração devem ser números maiores que zero'
      );
      return null;
    }

    return { dist, dur };
  };

  // Listar atividades
  const listarAtividades = async () => {
    try {
      const q = query(
        collection(db, 'atividades'),
        orderBy('criadoEm', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const lista: Atividade[] = [];

      querySnapshot.forEach((documento) => {
        const dados = documento.data();

        lista.push({
          id: documento.id,
          tipo: dados.tipo,
          distancia: dados.distancia,
          duracao: dados.duracao,
          data: dados.data,
          criadoEm: dados.criadoEm,
        });
      });

      setAtividades(lista);
    } catch (error) {
      console.error('Erro ao listar:', error);
      avisar('Erro', 'Não foi possível carregar as atividades');
    }
  };

  // Adicionar atividade
  const adicionarAtividade = async () => {
    const valores = validarCampos();
    if (!valores) return;

    try {
      await addDoc(collection(db, 'atividades'), {
        tipo,
        distancia: valores.dist,
        duracao: valores.dur,
        data: new Date().toLocaleDateString('pt-BR'),
        criadoEm: Date.now(),
      });

      avisar('Sucesso', 'Atividade registrada!');
      limparCampos();
      listarAtividades();
    } catch (error) {
      console.error('Erro ao adicionar:', error);
      avisar('Erro', 'Não foi possível registrar a atividade');
    }
  };

  // Atualizar atividade
  const atualizarAtividade = async () => {
    if (!editandoId) return;

    const valores = validarCampos();
    if (!valores) return;

    try {
      await updateDoc(doc(db, 'atividades', editandoId), {
        tipo,
        distancia: valores.dist,
        duracao: valores.dur,
      });

      avisar('Sucesso', 'Atividade atualizada!');
      limparCampos();
      listarAtividades();
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      avisar('Erro', 'Não foi possível atualizar a atividade');
    }
  };

  // Excluir atividade
  const excluirAtividade = (item: Atividade) => {
    confirmar(
      `Deseja excluir a atividade de ${item.tipo} (${item.data})?`,
      async () => {
        try {
          await deleteDoc(doc(db, 'atividades', item.id));
          avisar('Sucesso', 'Atividade excluída!');
          listarAtividades();
        } catch (error) {
          console.error('Erro ao excluir:', error);
          avisar('Erro', 'Não foi possível excluir a atividade');
        }
      }
    );
  };

  // Limpar campos
  const limparCampos = () => {
    setTipo(TIPOS[0]);
    setDistancia('');
    setDuracao('');
    setEditandoId(null);
  };

  // Iniciar edição
  const iniciarEdicao = (item: Atividade) => {
    setTipo(item.tipo);
    setDistancia(String(item.distancia));
    setDuracao(String(item.duracao));
    setEditandoId(item.id);
  };

  useEffect(() => {
    listarAtividades();
  }, []);

  const totalKm = atividades.reduce(
    (soma, a) => soma + a.distancia,
    0
  );

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

          {/* BUSCAR CEP */}
          <Text style={styles.titulo}>Buscar endereço</Text>

          <Text>Digite um CEP para consultar o endereço:</Text>

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
            <Text style={styles.error}>{erro}</Text>
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

        {/* ATIVIDADES */}
        <View style={styles.atividadesBox}>
          <Text style={styles.titulo}>Minhas atividades</Text>

          <Text style={styles.rotulo}>Tipo</Text>

          <View style={styles.chips}>
            {TIPOS.map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.chip,
                  tipo === t && styles.chipAtivo,
                ]}
                onPress={() => setTipo(t)}
              >
                <Text
                  style={[
                    styles.chipTexto,
                    tipo === t && styles.chipTextoAtivo,
                  ]}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Distância (km)"
            value={distancia}
            onChangeText={setDistancia}
            keyboardType="decimal-pad"
          />

          <TextInput
            style={styles.input}
            placeholder="Duração (minutos)"
            value={duracao}
            onChangeText={setDuracao}
            keyboardType="decimal-pad"
          />

          {editandoId ? (
            <View>
              <Button
                title="Atualizar atividade"
                onPress={atualizarAtividade}
                color="#FC4C02"
              />

              <View style={{ height: 8 }} />

              <Button
                title="Cancelar edição"
                onPress={limparCampos}
                color="#888"
              />
            </View>
          ) : (
            <Button
              title="Registrar atividade"
              onPress={adicionarAtividade}
              color="#FC4C02"
            />
          )}

          <Text style={styles.subtitle}>
            {atividades.length} atividade
            {atividades.length === 1 ? '' : 's'} ·{' '}
            {totalKm.toFixed(1)} km no total
          </Text>

          <FlatList
            data={atividades}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <View style={styles.info}>
                  <Text style={styles.itemTipo}>
                    {item.tipo}
                  </Text>

                  <Text style={styles.itemDetalhe}>
                    {item.distancia} km em {item.duracao} min ·{' '}
                    {item.data}
                  </Text>

                  <Text style={styles.itemDetalhe}>
                    {formatarRitmo(
                      item.distancia,
                      item.duracao
                    )}{' '}
                    ·{' '}
                    {formatarVelocidade(
                      item.distancia,
                      item.duracao
                    )}
                  </Text>
                </View>

                <View style={styles.acoes}>
                  <TouchableOpacity
                    style={[styles.botao, styles.botaoEditar]}
                    onPress={() => iniciarEdicao(item)}
                  >
                    <Text style={styles.textoBotao}>
                      Editar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.botao, styles.botaoExcluir]}
                    onPress={() => excluirAtividade(item)}
                  >
                    <Text style={styles.textoBotao}>
                      Excluir
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.vazio}>
                Nenhuma atividade ainda. Registre a primeira acima.
              </Text>
            }
          />
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

  atividadesBox: {
    flex: 1,
    minWidth: 320,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },

  rotulo: {
    fontSize: 14,
    color: '#666',
  },

  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },

  chipAtivo: {
    backgroundColor: '#FC4C02',
    borderColor: '#FC4C02',
  },

  chipTexto: {
    fontSize: 14,
    color: '#333',
  },

  chipTextoAtivo: {
    color: '#fff',
    fontWeight: '600',
  },

  item: {
    backgroundColor: '#f7f7f7',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },

  info: {
    flex: 1,
    gap: 2,
  },

  itemTipo: {
    fontSize: 16,
    fontWeight: '600',
  },

  itemDetalhe: {
    fontSize: 14,
    color: '#666',
  },

  acoes: {
    flexDirection: 'row',
    gap: 8,
  },

  botao: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  botaoEditar: {
    backgroundColor: '#007AFF',
  },

  botaoExcluir: {
    backgroundColor: '#FF3B30',
  },

  textoBotao: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  vazio: {
    textAlign: 'center',
    marginTop: 30,
    color: '#999',
  },
});