export const Lily = ({ size = 120 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100" aria-hidden="true">
    <defs><radialGradient id="lg" cx="50%" cy="85%" r="90%"><stop offset="0" stopColor="#E8B9C2" /><stop offset=".55" stopColor="#FFF8F3" /><stop offset="1" stopColor="#FFFCFA" /></radialGradient></defs>
    {[0, 60, 120, 180, 240, 300].map(a => <path key={a} transform={`rotate(${a})`} d="M0 0C-15-12-13-36 0-47 13-36 15-12 0 0Z" fill="url(#lg)" stroke="#D6B477" strokeOpacity=".55" strokeWidth=".6" />)}
    {[20, 80, 140, 200, 260, 320].map(a => <g key={a} transform={`rotate(${a})`}><line y2="-20" stroke="#D6B477" strokeWidth=".7" /><circle cy="-21" r="1.8" fill="#C98F9C" /></g>)}
  </svg>
)
