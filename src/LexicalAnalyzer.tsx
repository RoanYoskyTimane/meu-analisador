import React, { useState } from 'react';

// Definição das interfaces para TypeScript
interface LexemeRow {
  lexeme: string;
  classification: string;
  line: number;
}

interface SymbolRow {
  name: string;
  category: string;
}

const LexicalAnalyzer: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [lexemes, setLexemes] = useState<LexemeRow[]>([]);
  const [symbols, setSymbols] = useState<SymbolRow[]>([]);

  // Configurações de padrões
  const keywords: string[] = ['public', 'class', 'if', 'else', 'return', 'static', 'void'];
  const types: string[] = ['int', 'boolean', 'char', 'long', 'float', 'double'];
  const operators: string[] = ['=', '>=', '<=', '>', '<', '==', '+', '-', '*', '/'];
  const delimiters: string[] = ['{', '}', '(', ')', ';', ','];

  const analyzeCode = (): void => {
    const lines = code.split('\n');
    let tempLexemes: LexemeRow[] = [];
    let tempSymbols = new Map<string, string>();

    lines.forEach((lineText, index) => {
      const lineNumber = index + 1;
      
      // Expressão regular para capturar palavras, números e operadores
      const tokens = lineText.match(/[a-zA-Z_]\w*|[0-9]+|>=|<=|==|[=+\-*/{}();,]/g) || [];

      tokens.forEach((token, i) => {
        let classification = '';

        if (keywords.includes(token)) {
          classification = 'Palavra reservada';
        } else if (types.includes(token)) {
          classification = 'Tipo primitivo';
        } else if (operators.includes(token)) {
          classification = 'Operador';
        } else if (delimiters.includes(token)) {
          classification = 'Delimitador';
        } else if (!isNaN(Number(token))) {
          classification = 'Constante numérica';
        } else {
          classification = 'Identificador';
          
          // Lógica básica de inferência de categoria
          let category = 'Identificador';
          const previousToken = tokens[i - 1];
          
          if (previousToken === 'class') category = 'Classe';
          else if (types.includes(previousToken)) category = 'Variável/Parâmetro';
          
          if (!tempSymbols.has(token)) {
            tempSymbols.set(token, category);
          }
        }

        tempLexemes.push({
          lexeme: token,
          classification,
          line: lineNumber
        });
      });
    });

    setLexemes(tempLexemes);
    setSymbols(
      Array.from(tempSymbols).map(([name, category]) => ({ name, category }))
    );
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Analisador Léxico & Tabela de Símbolos</h2>
      
      <textarea
        style={{
          width: '100%',
          height: '200px',
          padding: '10px',
          fontFamily: 'monospace',
          borderRadius: '4px',
          border: '1px solid #ccc'
        }}
        placeholder="Insira o código Java aqui..."
        value={code}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCode(e.target.value)}
      />

      <button 
        onClick={analyzeCode}
        style={{
          marginTop: '10px',
          padding: '10px 20px',
          backgroundColor: '#646cff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Processar Código
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
        {/* Tabela de Lexemas */}
        <section>
          <h3>Tabela de Lexemas</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ddd' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, background: '#f4f4f4' }}>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Lexema</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Classificação</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Linha</th>
                </tr>
              </thead>
              <tbody>
                {lexemes.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.lexeme}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.classification}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{item.line}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tabela de Símbolos */}
        <section>
          <h3>Tabela de Símbolos</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ddd' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, background: '#f4f4f4' }}>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Identificador</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Categoria</th>
                </tr>
              </thead>
              <tbody>
                {symbols.map((sym, idx) => (
                  <tr key={idx}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{sym.name}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{sym.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LexicalAnalyzer;