import { useReducer, useState } from 'react';

function tarefasReducer(estado, acao) {
  switch (acao.type) {
    case 'ADICIONAR':
      // Adiciona uma nova tarefa mantendo as anteriores (...estado)
      return [
        ...estado,
        { id: Date.now(), titulo: acao.payload, concluida: false }
      ];

    case 'REMOVER':
      // Filtra e mantém apenas as tarefas com ID diferente do enviado
      return estado.filter(tarefa => tarefa.id !== acao.payload);

    case 'ALTERNAR':
      // Inverte o estado 'concluida' apenas na tarefa clicada
      return estado.map(tarefa =>
        tarefa.id === acao.payload
          ? { ...tarefa, concluida: !tarefa.concluida }
          : tarefa
      );

    default:
      return estado;
  }
}

export default function App() {

  // 2. OS HOOKS DO REACT
  
  const [tarefas, dispatch] = useReducer(tarefasReducer, []);

  // useState: gere o texto do input e o filtro ativo ("todas" | "ativas" | "concluidas")
  const [texto, setTexto] = useState('');
  const [filtro, setFiltro] = useState('todas');

  // ADICIONAR 

  function adicionarTarefa(e) {
    e.preventDefault(); // Impede o navegador de recarregar a página ao submeter o formulário
    if (!texto.trim()) return; 

    // Envia a ordem (dispatch) para a função redutora
    dispatch({ type: 'ADICIONAR', payload: texto });
    setTexto(''); 
  }

  // 4. LÓGICA DE FILTRAGEM

  const tarefasFiltradas = tarefas.filter(tarefa => {
    if (filtro === 'ativas') return !tarefa.concluida;
    if (filtro === 'concluidas') return tarefa.concluida;
    return true; // Se for 'todas', exibe todas
  });

  // VISUAL
 
  return (
    <main style={{ maxWidth: '450px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Gerenciador de Tarefas</h2>

      {}
      <form onSubmit={adicionarTarefa} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input
          type="text"
          value={texto}
          onChange={e => setTexto(e.target.value)}
          placeholder="Digite o título da tarefa..."
          style={{ flex: 1, padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>Adicionar</button>
      </form>

      {}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={() => setFiltro('todas')}
          style={{ fontWeight: filtro === 'todas' ? 'bold' : 'normal' }}
        >
          Todas
        </button>
        <button
          onClick={() => setFiltro('ativas')}
          style={{ fontWeight: filtro === 'ativas' ? 'bold' : 'normal' }}
        >
          Ativas
        </button>
        <button
          onClick={() => setFiltro('concluidas')}
          style={{ fontWeight: filtro === 'concluidas' ? 'bold' : 'normal' }}
        >
          Concluídas
        </button>
      </div>

      <p style={{ fontSize: '14px', color: '#666' }}>
        Filtro ativo: <strong>{filtro}</strong>
      </p>

      {}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tarefasFiltradas.length === 0 && (
          <li style={{ color: '#888' }}>Nenhuma tarefa encontrada neste filtro.</li>
        )}

        {tarefasFiltradas.map(tarefa => (
          <li
            key={tarefa.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 0',
              borderBottom: '1px solid #ddd'
            }}
          >
            <span
              onClick={() => dispatch({ type: 'ALTERNAR', payload: tarefa.id })}
              style={{
                textDecoration: tarefa.concluida ? 'line-through' : 'none',
                color: tarefa.concluida ? '#888' : '#000',
                cursor: 'pointer'
              }}
            >
              {tarefa.concluida ? '✓ ' : '○ '}
              {tarefa.titulo}
            </span>

            <button
              onClick={() => dispatch({ type: 'REMOVER', payload: tarefa.id })}
              style={{ color: '#d32f2f', cursor: 'pointer' }}
            >
              Remover
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}