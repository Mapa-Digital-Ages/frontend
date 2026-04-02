import Button from '@mui/material/Button';

// 3 parametros:
// tamanho (small/medium/large)
// color
// text
// falta ajustar passar o mouse em cima
// Definindo o que o botao aceita de parametro(props)

interface ButtonProps {
  tamanho: 'small' | 'medium' | 'large';
  cor: string; // Aceita 'nomedacor', 'hexadecimanl', 'codigo 0,0,0'
  texto: string;
}

export default function ComponentButton({ tamanho, cor, texto }: ButtonProps) {
  return (
    <Button 
      size={tamanho}
      variant="contained"
      // O 'sx' é pra usar CSS direto no componente
      sx={{ 
  backgroundColor: cor, 
  color: 'white', 
  transition: '0.2s',
  borderRadius: '8px',

  // Altura e Largura
  padding: 
    tamanho === 'small' ? '2px 8px' : 
    tamanho === 'medium' ? '10px 24px' : 
    tamanho === 'large' ? '20px 44px' : '44px 60px',
     

  // Tamanho da fonte
  fontSize: 
    tamanho === 'small' ? '0.9rem' : 
    tamanho === 'medium' ? '1.2rem' : 
    '1.5rem',

  '&:hover': {
    // cor do fundo quando passar o mouse
    backgroundColor: cor, 
    filter: 'brightness(0.85)',
  }
}}
      >
      {texto}
    </Button>
  );
}