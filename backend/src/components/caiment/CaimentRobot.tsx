interface CaimentRobotProps {
  size?: number;
  pose?: 'wave' | 'point' | 'heart';
  className?: string;
}

/**
 * Mascote da Caiment — corpo em lilás bem claro com contorno roxo, viseira
 * preta arredondada com dois olhos ovais brancos e sorriso, antenas
 * roxas, emblema circular roxo no peito. Reproduz o personagem usado nas
 * telas de autenticação e onboarding do Figma.
 */
export function CaimentRobot({ size = 160, pose = 'wave', className }: CaimentRobotProps) {
  const body = '#F1ECFB';
  const stroke = '#B9A4E8';
  const accent = '#6E42D1';

  return (
    <svg
      width={size}
      height={size * 1.15}
      viewBox="0 0 200 230"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* fundo circular suave para dar contraste */}
      <circle cx="100" cy="110" r="98" fill="#6E42D1" opacity="0.06" />
      {/* sombra de contato */}
      <ellipse cx="100" cy="219" rx="46" ry="8" fill="#341A6E" opacity="0.1" />

      {/* orelhas / antenas */}
      <circle cx="46" cy="75" r="12" fill={accent} />
      <circle cx="154" cy="75" r="12" fill={accent} />

      {/* braço esquerdo (parado) */}
      <path d="M64 150 C46 156 37 170 40 188" stroke={body} strokeWidth="20" strokeLinecap="round" />
      <path d="M64 150 C46 156 37 170 40 188" stroke={stroke} strokeWidth="20" strokeLinecap="round" opacity="0.5" />
      <circle cx="40" cy="190" r="12" fill={body} stroke={stroke} strokeWidth="2" />

      {/* braço direito (gesto conforme pose) */}
      {pose === 'wave' && (
        <>
          <path d="M138 148 C160 137 171 110 162 85" stroke={body} strokeWidth="20" strokeLinecap="round" />
          <path
            d="M138 148 C160 137 171 110 162 85"
            stroke={stroke}
            strokeWidth="20"
            strokeLinecap="round"
            opacity="0.4"
          />
          <g transform="translate(163,78) rotate(-8)">
            <circle r="14" fill={body} stroke={stroke} strokeWidth="2" />
            <path d="M-5 -15 L-5 -2 M2 -17 L2 -2 M9 -15 L9 -3" stroke={accent} strokeWidth="3.4" strokeLinecap="round" />
          </g>
        </>
      )}
      {pose === 'point' && (
        <>
          <path d="M138 150 C162 145 175 127 172 106" stroke={body} strokeWidth="20" strokeLinecap="round" />
          <path
            d="M138 150 C162 145 175 127 172 106"
            stroke={stroke}
            strokeWidth="20"
            strokeLinecap="round"
            opacity="0.4"
          />
          <circle cx="173" cy="102" r="13" fill={body} stroke={stroke} strokeWidth="2" />
          <circle cx="173" cy="82" r="17" fill="#E7E0FA" stroke={accent} strokeWidth="2.2" />
          <path
            d="M165 87 L182 76 M165 78 L182 78 M165 84 L174 84"
            stroke={accent}
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        </>
      )}
      {pose === 'heart' && (
        <>
          <path d="M138 148 C157 139 165 119 158 100" stroke={body} strokeWidth="20" strokeLinecap="round" />
          <path
            d="M138 148 C157 139 165 119 158 100"
            stroke={stroke}
            strokeWidth="20"
            strokeLinecap="round"
            opacity="0.4"
          />
          <circle cx="158" cy="96" r="13" fill={body} stroke={stroke} strokeWidth="2" />
          <path
            d="M173 73c-3-5-10-5-12 0-2-5-9-5-12 0-3 6 2 12 12 19 10-7 15-13 12-19z"
            fill={accent}
          />
        </>
      )}

      {/* corpo */}
      <rect x="50" y="130" width="100" height="82" rx="36" fill={body} stroke={stroke} strokeWidth="2.5" />
      {/* emblema no peito */}
      <circle cx="100" cy="169" r="17" fill="#FFFFFF" stroke={accent} strokeWidth="2.6" />
      <text x="100" y="175" textAnchor="middle" fontSize="16" fontFamily="Fraunces, serif" fill={accent}>
        C
      </text>

      {/* pescoço */}
      <rect x="86" y="112" width="28" height="20" rx="9" fill={body} stroke={stroke} strokeWidth="2" />

      {/* cabeça */}
      <rect x="32" y="28" width="136" height="98" rx="44" fill={body} stroke={stroke} strokeWidth="2.5" />
      {/* viseira */}
      <rect x="52" y="49" width="96" height="60" rx="30" fill="#221B33" />
      {/* brilho na viseira */}
      <path d="M58 58c10-8 22-11 34-11" stroke="#3A3050" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
      {/* olhos */}
      <ellipse cx="82" cy="80" rx="9" ry="11" fill="#FFFFFF" />
      <ellipse cx="118" cy="80" rx="9" ry="11" fill="#FFFFFF" />
      {/* sorriso */}
      <path d="M86 96c5 6 23 6 28 0" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" fill="none" />
    </svg>
  );
}
