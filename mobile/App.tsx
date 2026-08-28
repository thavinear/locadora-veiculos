import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const API_BASE_URL = 'https://locadora-veiculos-l5ss.onrender.com/api';

type Categoria = {
  id: number;
  nome: string;
  valorDiaria: number;
};

type Veiculo = {
  id: number;
  modelo: string;
  placa: string;
  ano: number;
  status?: string;
};

export default function App() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        setError(null);

        const categoriasResponse = await fetch(
          `${API_BASE_URL}/categorias`
        );

        if (!categoriasResponse.ok) {
          throw new Error(
            `Categorias: HTTP ${categoriasResponse.status}`
          );
        }

        const categoriasData = await categoriasResponse.json();

        const veiculosResponse = await fetch(
          `${API_BASE_URL}/veiculos`
        );

        if (!veiculosResponse.ok) {
          throw new Error(
            `Veículos: HTTP ${veiculosResponse.status}`
          );
        }

        const veiculosData = await veiculosResponse.json();

        setCategorias(
          Array.isArray(categoriasData) ? categoriasData : []
        );

        setVeiculos(
          Array.isArray(veiculosData) ? veiculosData : []
        );
      } catch (e) {
        console.error('ERRO API:', e);

        setError(
          e instanceof Error
            ? e.message
            : 'Failed to fetch'
        );
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.title}>RodaViva</Text>
        <Text style={styles.subtitle}>Locadora de Veículos</Text>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Categorias</Text>
          <Text style={styles.cardValue}>{categorias.length}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Veículos</Text>
          <Text style={styles.cardValue}>{veiculos.length}</Text>
        </View>
      </View>

      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#f4b942" />
          <Text style={styles.loadingText}>
            Conectando ao servidor...
          </Text>
        </View>
      )}

      {!loading && error && (
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>
            Erro de conexão
          </Text>

          <Text style={styles.errorText}>
            {error}
          </Text>

          <Text style={styles.apiText}>
            API:
          </Text>

          <Text style={styles.apiUrl}>
            {API_BASE_URL}
          </Text>
        </View>
      )}

      {!loading && !error && (
        <FlatList
          data={categorias}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemTitle}>
                {item.nome}
              </Text>

              <Text style={styles.itemMeta}>
                R$ {Number(item.valorDiaria).toFixed(2)} / dia
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Nenhuma categoria encontrada.
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#101828',
  },

  header: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 18,
  },

  title: {
    color: '#f4b942',
    fontSize: 32,
    fontWeight: '700',
  },

  subtitle: {
    color: '#e5e7eb',
    fontSize: 18,
    marginTop: 6,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 18,
    gap: 12,
  },

  card: {
    flex: 1,
    backgroundColor: '#1d4ed8',
    borderRadius: 14,
    padding: 16,
  },

  cardLabel: {
    color: '#dbeafe',
    fontSize: 12,
    marginBottom: 10,
    textTransform: 'uppercase',
  },

  cardValue: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  loadingText: {
    marginTop: 12,
    color: '#e5e7eb',
    fontSize: 16,
  },

  errorTitle: {
    color: '#fca5a5',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },

  errorText: {
    color: '#fca5a5',
    fontSize: 16,
    textAlign: 'center',
  },

  apiText: {
    marginTop: 20,
    color: '#94a3b8',
    fontSize: 12,
  },

  apiUrl: {
    marginTop: 4,
    color: '#e5e7eb',
    fontSize: 12,
    textAlign: 'center',
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },

  item: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },

  itemTitle: {
    color: '#f9fafb',
    fontSize: 18,
    fontWeight: '600',
  },

  itemMeta: {
    marginTop: 6,
    color: '#cbd5e1',
    fontSize: 14,
  },

  emptyText: {
    color: '#e5e7eb',
    textAlign: 'center',
    marginTop: 18,
  },
});

