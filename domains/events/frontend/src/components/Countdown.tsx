export function Countdown() {
const items = [
{ label: 'Days', value: '342' },
{ label: 'Hours', value: '12' },
{ label: 'Mins', value: '45' },
];


return (
<div className="flex gap-6 mt-8 justify-center">
{items.map((i) => (
<div key={i.label} className="w-20 h-20 rounded-full border border-gray-600 flex flex-col items-center justify-center">
<span className="text-xl font-bold">{i.value}</span>
<span className="text-xs text-gray-400">{i.label}</span>
</div>
))}
</div>
);
}