import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processDataRow } from '../src/utils/importData/dataProcessor';
import type { ProcessingContext } from '../src/utils/importData/types';

vi.mock('../src/integrations/supabase/client', () => {
  const mockFrom = vi.fn((table: string) => {
    if (table === 'sindicatos') {
      return {
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn(async () => ({ data: { id: 'sind1' }, error: null }))
          }))
        })),
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(async () => ({ data: { id: 'sind1' }, error: null }))
          }))
        }))
      } as any;
    }
    if (table === 'convenios') {
      return {
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(async () => ({ data: { id: 'conv1' }, error: null }))
          }))
        }))
      } as any;
    }
    if (table === 'cargos') {
      return {
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(async () => ({ data: { id: 'cargo1' }, error: null }))
          }))
        })),
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            limit: vi.fn(async () => ({ data: [{ id: 'cargo1' }], error: null }))
          }))
        }))
      } as any;
    }
    if (['piso_salarial', 'valores_hora', 'particularidades'].includes(table)) {
      return {
        insert: vi.fn(async () => ({ data: null, error: null }))
      } as any;
    }
    return {} as any;
  });

  return { supabase: { from: mockFrom } };
});

const context: ProcessingContext = { fileName: 'f.xlsx', importId: 'imp1' };

describe('processDataRow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns empty result when SINDICATO is missing', async () => {
    const row: any = { CARGO: 'X' };
    const res = await processDataRow(row, context);
    expect(res.convention).toBeNull();
    expect(res.pisosSalariais).toEqual([]);
    expect(res.particularidades).toEqual([]);
  });

  it('processes valid rows', async () => {
    const row: any = {
      'SINDICATO': 'Sind A',
      'ESTADO': 'SP',
      'CARGO': 'Atendente',
      'CARGA HORÁRIA': '44',
      'PISO SALARIAL': '1000',
      'VALOR HORA NORMAL': '10',
      'VALOR HORA EXTRA 50%': '15',
      'VALOR HORA EXTRA 100%': '20',
      'PARTICULARIDADE': 'Uma, Duas'
    };
    const res = await processDataRow(row, context);
    expect(res.convention).toEqual({
      titulo: 'CONVENÇÃO COLETIVA SP - Sind A',
      tipo: 'CCT',
      estado: 'SP',
      data_base: null,
      vigencia_inicio: null,
      vigencia_fim: null,
      vale_refeicao: null,
      vale_refeicao_valor: null,
      assistencia_medica: false,
      seguro_vida: false,
      uniforme: false,
      adicional_noturno: null,
      sindicato_id: 'sind1'
    });
    expect(res.pisosSalariais).toEqual([
      {
        convenio_id: 'conv1',
        cargo: 'Atendente',
        carga_horaria: '44',
        piso_salarial: 1000,
        valor_hora_normal: 10,
        valor_hora_extra_50: 15,
        valor_hora_extra_100: 20
      }
    ]);
    expect(res.particularidades).toEqual([
      { cargo_id: 'cargo1', conteudo: 'Uma', categoria: 'Geral' },
      { cargo_id: 'cargo1', conteudo: 'Duas', categoria: 'Geral' }
    ]);
  });
});
