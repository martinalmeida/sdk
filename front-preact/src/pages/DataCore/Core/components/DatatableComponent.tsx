import { ComponentChildren } from 'preact';
import { useState, useMemo } from 'preact/hooks';
import { Search, ChevronLeft, ChevronRight } from 'lucide-preact';

interface Column {
    key: string;
    label: string;
    align?: 'left' | 'right' | 'center';
    className?: string;
}

interface Props {
    columns: Column[];
    data: Record<string, ComponentChildren>[];
    pageSize?: number;
    searchKeys?: string[];
}

export default function DataTableComponent({ columns, data, pageSize = 10, searchKeys }: Props) {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        if (!search.trim()) return data;
        const q = search.toLowerCase();
        const keys = searchKeys ?? columns.map(c => c.key);
        return data.filter(row =>
            keys.some(k => String(row[k] ?? '').toLowerCase().includes(q))
        );
    }, [data, search, searchKeys, columns]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const currentPage = Math.min(page, totalPages);
    const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handleSearch = (val: string) => {
        setSearch(val);
        setPage(1);
    };

    const alignClass = { left: 'text-left', right: 'text-right', center: 'text-center' };

    return (
        <div class="flex flex-col gap-3">

            {/* Búsqueda */}
            <div class="relative w-full max-w-xs">
                <Search size={13} class="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={search}
                    onInput={e => handleSearch((e.target as HTMLInputElement).value)}
                    class="w-full rounded-lg border border-stone-200 bg-white py-1.5 pl-8 pr-3 text-[13px] text-stone-700 placeholder:text-stone-400 focus:border-[#cc8b3c] focus:outline-none focus:ring-1 focus:ring-[#cc8b3c]/30"
                />
            </div>

            {/* Tabla */}
            <div class="overflow-x-auto rounded-xl border border-stone-200">
                <table class="min-w-full w-full border-collapse text-[13.5px]">
                    <thead class="bg-stone-50 text-[11.5px] uppercase tracking-[.05em] text-stone-400">
                        <tr>
                            {columns.map(col => (
                                <th
                                    key={col.key}
                                    class={`px-3 py-2 font-semibold ${alignClass[col.align ?? 'left']} ${col.className ?? ''}`}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-stone-200">
                        {paginated.length === 0 ? (
                            <tr>
                                <td
                                    colspan={columns.length}
                                    class="px-3 py-8 text-center text-[13px] text-stone-400"
                                >
                                    Sin resultados
                                </td>
                            </tr>
                        ) : (
                            paginated.map((row, i) => (
                                <tr key={i} class="hover:bg-stone-50">
                                    {columns.map(col => (
                                        <td
                                            key={col.key}
                                            class={`px-3 py-2 ${alignClass[col.align ?? 'left']} ${col.className ?? ''}`}
                                        >
                                            {row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Paginado */}
            <div class="flex items-center justify-between text-[12px] text-stone-400">
                <span>
                    {filtered.length === 0
                        ? 'Sin resultados'
                        : `${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, filtered.length)} de ${filtered.length}`}
                </span>
                <div class="flex items-center gap-1">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        class="inline-flex h-7 w-7 items-center justify-center rounded-md border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={13} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                        .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                            if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...');
                            acc.push(p);
                            return acc;
                        }, [])
                        .map((p, i) =>
                            p === '...' ? (
                                <span key={`ellipsis-${i}`} class="px-1">…</span>
                            ) : (
                                <button
                                    key={p}
                                    onClick={() => setPage(p as number)}
                                    class={`inline-flex h-7 w-7 items-center justify-center rounded-md border text-[12px] font-medium transition-colors ${
                                        currentPage === p
                                            ? 'border-[#cc8b3c] bg-[#cc8b3c] text-white'
                                            : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                                    }`}
                                >
                                    {p}
                                </button>
                            )
                        )}

                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        class="inline-flex h-7 w-7 items-center justify-center rounded-md border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={13} />
                    </button>
                </div>
            </div>
        </div>
    );
}