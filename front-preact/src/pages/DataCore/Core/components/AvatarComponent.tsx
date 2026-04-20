interface Props {
    name: string;
}

function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
}

export default function AvatarComponent({ name }: Props) {
    return (
        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#cc8b3c] text-[11px] font-bold text-white">
            {getInitials(name)}
        </div>
    );
}