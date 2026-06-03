'use client';

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Cell,
} from 'recharts';

type LocationItem = {
    name: string;
    value: number;
    color: string;
};

type Props = {
    topLocations: LocationItem[];
    barChartKey: number;
    locInView: boolean;
    shortLabel: (value: any, max?: number) => string;
};

const clamp = (n: number, min = 0, max = 255) =>
    Math.max(min, Math.min(max, n));

const shadeHex = (hex: string, percent: number) => {
    const h = hex.replace('#', '');
    const full =
        h.length === 3
            ? h
                  .split('')
                  .map((c) => c + c)
                  .join('')
            : h;
    const num = parseInt(full, 16);

    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;

    const t = percent / 100;

    const nr = clamp(Math.round(r + (255 - r) * t));
    const ng = clamp(Math.round(g + (255 - g) * t));
    const nb = clamp(Math.round(b + (255 - b) * t));

    const toHex = (v: number) => v.toString(16).padStart(2, '0');
    return `#${toHex(nr)}${toHex(ng)}${toHex(nb)}`;
};

const Bar3D = (props: any) => {
    const { x, y, width, height, fill, payload } = props;
    if (height <= 0 || width <= 0) return null;

    const d = Math.min(10, Math.max(6, Math.round(width * 0.18)));
    const front = fill || '#3B82F6';

    const right = shadeHex(front, -18);
    const top = shadeHex(front, 18);

    const frontTop = shadeHex(front, 22);
    const frontBottom = shadeHex(front, -4);

    const rightTop = shadeHex(right, 14);
    const rightBottom = shadeHex(right, -6);

    const topA = shadeHex(top, 25);
    const topB = shadeHex(top, -5);

    const fx = x;
    const fy = y;
    const fw = width;
    const fh = height;

    const topPts = `
    ${fx - 0.8},${fy}
    ${fx + d},${fy - d}
    ${fx + fw + d + 0.8},${fy - d}
    ${fx + fw + 0.8},${fy}
  `;

    const rightPts = `
    ${fx + fw},${fy}
    ${fx + fw + d},${fy - d}
    ${fx + fw + d},${fy + fh - d + 0.8}
    ${fx + fw},${fy + fh + 0.8}
  `;

    const key = payload?.name
        ? String(payload.name).replace(/\s+/g, '-')
        : `${fx}-${fy}`;
    const gidFront = `g-front-${key}`;
    const gidRight = `g-right-${key}`;
    const gidTop = `g-top-${key}`;

    return (
        <g>
            <defs>
                <linearGradient
                    id={gidFront}
                    x1="0"
                    y1={fy}
                    x2="0"
                    y2={fy + fh}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0%" stopColor={frontTop} />
                    <stop offset="100%" stopColor={frontBottom} />
                </linearGradient>

                <linearGradient
                    id={gidRight}
                    x1={fx + fw}
                    y1={fy}
                    x2={fx + fw}
                    y2={fy + fh}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0%" stopColor={rightTop} />
                    <stop offset="100%" stopColor={rightBottom} />
                </linearGradient>

                <linearGradient
                    id={gidTop}
                    x1={fx}
                    y1={fy - d}
                    x2={fx + fw + d}
                    y2={fy}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0%" stopColor={topA} />
                    <stop offset="100%" stopColor={topB} />
                </linearGradient>
            </defs>

            <path
                d={`M ${fx} ${fy + fh} L ${fx + fw} ${fy + fh} L ${fx + fw + d} ${fy + fh - d} L ${fx + d} ${fy + fh - d} Z`}
                fill="rgba(0,0,0,0.06)"
            />

            <polygon points={rightPts} fill={`url(#${gidRight})`} />
            <polygon points={topPts} fill={`url(#${gidTop})`} />

            <rect
                x={fx}
                y={fy}
                width={fw}
                height={fh}
                rx={0}
                ry={0}
                fill={`url(#${gidFront})`}
            />

            <rect
                x={fx + 1}
                y={fy + 1}
                width={Math.max(0, fw - 2)}
                height={Math.max(0, fh - 2)}
                fill="transparent"
                stroke="rgba(255,255,255,0.22)"
                strokeWidth="1"
            />
        </g>
    );
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-2xl border border-white/60 bg-white/90 px-4 py-2 shadow-xl">
            <p className="text-xs font-bold text-slate-900">{label}</p>
            <p className="text-xs text-slate-700">
                <span className="font-extrabold">{payload[0].value}</span>{' '}
                incidents
            </p>
        </div>
    );
};

export default function IRSLocationBarChart({
    topLocations,
    barChartKey,
    locInView,
    shortLabel,
}: Props) {
    return (
        <div className="h-[300px] sm:h-[330px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    key={barChartKey}
                    data={topLocations}
                    margin={{ top: 12, right: 0, left: 0, bottom: 18 }}
                    barCategoryGap="10%"
                    barGap={2}
                >
                    <CartesianGrid
                        strokeDasharray="4 4"
                        stroke="rgba(0,0,0,0.08)"
                    />

                    <XAxis
                        dataKey="name"
                        interval={0}
                        height={52}
                        tickLine={false}
                        axisLine={{ stroke: 'rgba(0,0,0,0.18)' }}
                        tick={{ fontSize: 12, fill: 'rgba(15,23,42,0.85)' }}
                        tickFormatter={(v) => shortLabel(v, 16)}
                        padding={{ left: 0, right: 0 }}
                    />

                    <YAxis allowDecimals={false} width={32} />

                    <Tooltip content={<CustomTooltip />} />

                    <Bar
                        dataKey="value"
                        shape={<Bar3D />}
                        maxBarSize={90}
                        isAnimationActive={locInView}
                        animationDuration={900}
                        animationEasing="ease-out"
                    >
                        {topLocations.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
