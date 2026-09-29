import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>

      {/* TOPO */}
      <View style={styles.topo}>
        <Text style={styles.logo}>ϟ STRAVA</Text>

        <Text>Painel</Text>
        <Text>Treinamento</Text>

        <Link href="/detalhes">
          <Text style={styles.mapa}>Mapas</Text>
        </Link>



        <Text>Desafios</Text>
      </View>


      {/* CONTEÚDO */}
      <View style={styles.conteudo}>

        {/* PERFIL */}
        <View style={styles.card}>

          <View style={styles.foto}>
            <Text style={styles.fotoTexto}>P</Text>
          </View>

          <Text style={styles.nome}>Pedro Gross</Text>

          <View style={styles.numeros}>
            <Text>Seguindo{'\n'}1</Text>
            <Text>Seguidores{'\n'}6.7B</Text>
            <Text>Atividades{'\n'}6.756</Text>
          </View>

          <Text style={styles.titulo}>Atividade mais recente</Text>

          <Text style={styles.atividade}>
            Caminhada vespertina
          </Text>

          <Text>3 de abr de 2026</Text>

          <Text style={styles.titulo}>Sua sequência</Text>

          <Text>🔥 1 Semana</Text>

          <Text style={styles.texto}>
            Registre uma atividade no app Strava
            ou carregue uma manualmente aqui.
          </Text>

        </View>


        {/* CENTRO */}
        <View style={styles.centro}>

          <View style={styles.filtro}>
            <Text>Seguindo ▼</Text>
          </View>

          <Text style={styles.semAtividade}>
            Nenhuma atividade recente disponível.
          </Text>

          <Text>
            Para ver seu histórico completo de atividades,
            visite seu Perfil.
          </Text>

        </View>


        {/* DIREITA */}
        <View style={styles.direita}>

          <Text style={styles.tituloDireita}>
            Desafios
          </Text>

          <Text>
            Participe de desafios de corrida ou ciclismo.
          </Text>

          <Text style={styles.link}>
            Ver todos os desafios
          </Text>


          <Text style={styles.tituloDireita}>
            Clubes
          </Text>

          <Text>
            Entre ou crie um Clube.
          </Text>

          <Text style={styles.link}>
            Ver todos os clubes
          </Text>


          <Text style={styles.tituloDireita}>
            Amigos sugeridos
          </Text>

          <Text style={styles.amigo}>
            👤 João Pedro
          </Text>

          <Text style={styles.amigo}>
            👤 Raquel Pierim
          </Text>

        </View>

      </View>

    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },

  topo: {
    height: 60,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 25,
    paddingHorizontal: 30,
  },

  logo: {
    color: '#fc4c02',
    fontSize: 24,
    fontWeight: 'bold',
  },

  mapa: {
    color: '#fc4c02',
    fontWeight: 'bold',
  },

  conteudo: {
    flexDirection: 'row',
    gap: 40,
    padding: 40,
  },

  card: {
    width: 280,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 5,
  },

  foto: {
    width: 65,
    height: 65,
    borderRadius: 40,
    backgroundColor: '#8e2bd1',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },

  fotoTexto: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
  },

  nome: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 15,
  },

  numeros: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    paddingBottom: 15,
  },

  titulo: {
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 8,
  },

  atividade: {
    fontWeight: 'bold',
    marginBottom: 5,
  },

  texto: {
    marginTop: 10,
    color: '#555',
  },

  centro: {
    flex: 1,
    alignItems: 'center',
  },

  filtro: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    width: 180,
  },

  semAtividade: {
    marginTop: 80,
    marginBottom: 10,
    fontWeight: 'bold',
  },

  direita: {
    width: 260,
  },

  tituloDireita: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },

  link: {
    color: '#fc4c02',
    fontWeight: 'bold',
    marginTop: 10,
  },

  amigo: {
    marginTop: 15,
    fontSize: 15,
  },

});