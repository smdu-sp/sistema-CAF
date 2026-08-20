'use client';

import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';

/**
 * QR Code apontando para a URL de detalhe do equipamento. Ao escanear, abre a
 * ficha completa (hardware, software, histórico, patrimônio). Serve de etiqueta.
 */
export default function QrEquipamento({
	equipamentoId,
	titulo,
}: {
	equipamentoId: number;
	titulo: string;
}) {
	const [url, setUrl] = useState('');

	useEffect(() => {
		setUrl(`${window.location.origin}/helpdesk/inventario/${equipamentoId}`);
	}, [equipamentoId]);

	function imprimir() {
		const svg = document.getElementById('qr-equipamento')?.outerHTML;
		if (!svg) return;
		const win = window.open('', '_blank', 'width=400,height=480');
		if (!win) return;
		win.document.write(`
			<html>
				<head><title>Etiqueta ${titulo}</title></head>
				<body style="font-family: sans-serif; text-align: center; padding: 24px;">
					${svg}
					<p style="margin-top: 12px; font-size: 14px; font-weight: 600;">${titulo}</p>
					<p style="font-size: 12px; color: #555;">Inventário de TI · #${equipamentoId}</p>
					<script>window.onload = () => { window.print(); }</script>
				</body>
			</html>
		`);
		win.document.close();
	}

	return (
		<div className="flex flex-col items-center gap-3">
			{url ? (
				<QRCodeSVG id="qr-equipamento" value={url} size={148} level="M" includeMargin />
			) : (
				<div className="h-[148px] w-[148px] animate-pulse rounded bg-muted" />
			)}
			<Button size="sm" variant="outline" onClick={imprimir} disabled={!url}>
				<Printer size={16} /> Imprimir etiqueta
			</Button>
		</div>
	);
}
