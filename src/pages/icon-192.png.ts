import type { APIRoute } from 'astro';
import { iconSvg, svgToPng } from '../lib/og';
export const GET: APIRoute = () => new Response(svgToPng(iconSvg(192), 192), { headers: { 'Content-Type': 'image/png' } });
