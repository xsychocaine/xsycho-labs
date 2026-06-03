/** Small rotary knob for SSL-style strips */
function Knob({
  cx,
  cy,
  r = 6,
  accent = false,
}: {
  cx: number;
  cy: number;
  r?: number;
  accent?: boolean;
}) {
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="#0e0e12"
        stroke={accent ? "#a855f7" : "#ffffff"}
        strokeOpacity={accent ? 0.2 : 0.07}
        strokeWidth="1"
      />
      <circle cx={cx} cy={cy} r={r * 0.35} fill="#1a1a20" />
      <line
        x1={cx}
        y1={cy}
        x2={cx}
        y2={cy - r * 0.55}
        stroke="#ffffff"
        strokeOpacity="0.12"
        strokeWidth="0.75"
      />
    </g>
  );
}

/** SSL channel strip module */
function SslChannelStrip({ offsetX = 0 }: { offsetX?: number }) {
  const knobRows = [34, 50, 66, 82, 98, 114];
  const knobCols = [26, 52, 78];

  return (
    <g transform={`translate(${offsetX}, 0)`}>
      <rect width="118" height="560" fill="#050505" />
      <rect
        x="6"
        y="8"
        width="106"
        height="544"
        rx="1"
        fill="#0c0c0f"
        stroke="#ffffff"
        strokeOpacity="0.05"
      />
      <line
        x1="117"
        y1="0"
        x2="117"
        y2="560"
        stroke="#ffffff"
        strokeOpacity="0.06"
      />

      <text
        x="59"
        y="28"
        textAnchor="middle"
        fill="#ffffff"
        fillOpacity="0.1"
        fontSize="8"
        fontFamily="ui-monospace, monospace"
      >
        CH
      </text>

      {knobRows.map((cy) =>
        knobCols.map((cx) => (
          <Knob
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r={cy > 100 ? 5 : 5.5}
            accent={cx === 52 && cy === 66}
          />
        )),
      )}

      <rect
        x="54"
        y="138"
        width="10"
        height="210"
        rx="2"
        fill="#070709"
        stroke="#ffffff"
        strokeOpacity="0.05"
      />
      <rect x="55" y="142" width="8" height="202" rx="1" fill="#121218" />
      <rect
        x="52"
        y="218"
        width="14"
        height="26"
        rx="1"
        fill="url(#fader-knob)"
        stroke="#ffffff"
        strokeOpacity="0.08"
      />
      <line
        x1="59"
        y1="150"
        x2="59"
        y2="336"
        stroke="#a855f7"
        strokeOpacity="0.1"
        strokeWidth="0.75"
      />

      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={`btn-${i}`}
          x={20 + i * 16}
          y="368"
          width="11"
          height="7"
          rx="1"
          fill="#14141a"
          stroke="#ffffff"
          strokeOpacity="0.06"
        />
      ))}

      <rect
        x="92"
        y="138"
        width="6"
        height="210"
        rx="1"
        fill="#060608"
        stroke="#ffffff"
        strokeOpacity="0.04"
      />
      {Array.from({ length: 16 }).map((_, i) => (
        <rect
          key={`led-${i}`}
          x="93"
          y={340 - i * 13}
          width="4"
          height="7"
          rx="0.5"
          fill="url(#meter-led)"
          opacity={0.12 + (i / 16) * 0.28}
        />
      ))}

      <rect
        x="16"
        y="130"
        width="86"
        height="1"
        fill="#ffffff"
        fillOpacity="0.05"
      />
      <rect
        x="16"
        y="360"
        width="86"
        height="1"
        fill="#ffffff"
        fillOpacity="0.05"
      />
    </g>
  );
}

/** LA-2A inspired compressor face */
function La2aModule({ offsetX = 0 }: { offsetX?: number }) {
  return (
    <g transform={`translate(${offsetX}, 0)`}>
      <rect width="132" height="560" fill="#050505" />
      <rect
        x="8"
        y="12"
        width="116"
        height="536"
        rx="2"
        fill="#0e0e11"
        stroke="#ffffff"
        strokeOpacity="0.05"
      />

      <text
        x="66"
        y="36"
        textAnchor="middle"
        fill="#ffffff"
        fillOpacity="0.09"
        fontSize="7"
        fontFamily="ui-monospace, monospace"
        letterSpacing="0.12em"
      >
        COMP
      </text>

      {/* VU meter window */}
      <rect
        x="38"
        y="48"
        width="56"
        height="100"
        rx="2"
        fill="#040406"
        stroke="#ffffff"
        strokeOpacity="0.06"
      />
      <rect x="42" y="52" width="48" height="92" rx="1" fill="#08080c" />
      {Array.from({ length: 9 }).map((_, i) => (
        <line
          key={`vu-h-${i}`}
          x1="44"
          y1={58 + i * 10}
          x2="88"
          y2={58 + i * 10}
          stroke="#ffffff"
          strokeOpacity={0.04 + (i / 9) * 0.06}
          strokeWidth="0.5"
        />
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <line
          key={`vu-v-${i}`}
          x1={48 + i * 10}
          y1="56"
          x2={48 + i * 10}
          y2="140"
          stroke="#ffffff"
          strokeOpacity="0.03"
          strokeWidth="0.5"
        />
      ))}
      <path
        d="M 52 130 Q 66 95 80 130"
        fill="none"
        stroke="#a855f7"
        strokeOpacity="0.12"
        strokeWidth="1"
      />

      {/* Large LA-2A style knobs */}
      <Knob cx={40} cy={200} r={12} accent />
      <text
        x="40"
        y="222"
        textAnchor="middle"
        fill="#ffffff"
        fillOpacity="0.08"
        fontSize="5"
        fontFamily="ui-monospace, monospace"
      >
        GR
      </text>

      <Knob cx={92} cy={200} r={12} />
      <text
        x="92"
        y="222"
        textAnchor="middle"
        fill="#ffffff"
        fillOpacity="0.08"
        fontSize="5"
        fontFamily="ui-monospace, monospace"
      >
        GAIN
      </text>

      <Knob cx={66} cy={268} r={9} />
      <Knob cx={40} cy={310} r={7} />
      <Knob cx={92} cy={310} r={7} />

      {/* Toggle switches */}
      {[0, 1, 2].map((i) => (
        <g key={`sw-${i}`}>
          <rect
            x={28 + i * 28}
            y="340"
            width="18"
            height="10"
            rx="1"
            fill="#121218"
            stroke="#ffffff"
            strokeOpacity="0.06"
          />
          <rect
            x={32 + i * 28}
            y="342"
            width="10"
            height="6"
            rx="0.5"
            fill="#1e1e26"
          />
        </g>
      ))}

      <rect
        x="24"
        y="380"
        width="84"
        height="140"
        rx="1"
        fill="#08080a"
        stroke="#ffffff"
        strokeOpacity="0.03"
      />
      {Array.from({ length: 8 }).map((_, i) => (
        <rect
          key={`gr-led-${i}`}
          x="100"
          y={390 + i * 16}
          width="3"
          height="10"
          rx="0.5"
          fill="url(#meter-led)"
          opacity={0.1 + (i / 8) * 0.2}
        />
      ))}
    </g>
  );
}

export function ChannelStripBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#050505]"
    >
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.5]"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="fader-knob" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a2a30" />
            <stop offset="100%" stopColor="#141418" />
          </linearGradient>
          <linearGradient id="meter-led" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#3b0764" stopOpacity="0.1" />
            <stop offset="60%" stopColor="#9333ea" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.28" />
          </linearGradient>
          <pattern
            id="studio-rack"
            width="250"
            height="560"
            patternUnits="userSpaceOnUse"
          >
            <SslChannelStrip offsetX={0} />
            <La2aModule offsetX={118} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#studio-rack)" />
      </svg>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-10%,rgba(168,85,247,0.1),transparent_60%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/45 via-[#050505]/72 to-[#050505]" />
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}
