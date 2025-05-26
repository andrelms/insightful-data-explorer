import { read } from 'xlsx';
import { supabase } from '@/integrations/supabase/client';

export const uploadFile = async (file: File) => {
  const file_name = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from('excel-files')
    .upload(file_name, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Erro ao fazer upload do arquivo:', error);
    return null;
  }

  return { path: data.path, fullPath: `https://lovcode.supabase.co/storage/objects/${data.fullPath}` };
};

export const importExcelData = async (file: File) => {
  const workbook = read(await file.arrayBuffer(), { type: 'array' });
  
  const uploadedFile = await uploadFile(file);

  if (!uploadedFile) {
    console.error('Erro ao fazer upload do arquivo.');
    return;
  }

  const file_size = file.size;
  const file_type = file.type;
  const filename = file.name;
  const file_path = uploadedFile.path;

  try {
    const { data: uploadedFileData, error: uploadedFileError } = await supabase
      .from('uploaded_files')
      .insert([
        {
          filename,
          file_size,
          file_type,
          file_path,
          uploaded_at: new Date().toISOString(),
          processed: false
        }
      ])
      .select()

    if (uploadedFileError) {
      console.error('Erro ao salvar informações do arquivo:', uploadedFileError);
      throw uploadedFileError;
    }

    const uploadedFileId = uploadedFileData[0].id;

    const sheetName = workbook.SheetNames[0];
    const jsonData = workbook.Sheets[sheetName];

    // Extrair dados do sindicato
    const sindicatoNome = jsonData['B2']?.v || null;
    const sindicatoCNPJ = jsonData['B3']?.v || null;
    const sindicatoSite = jsonData['B4']?.v || null;
    const sindicatoDataBase = jsonData['B5']?.v || null;
    const sindicatoEstado = jsonData['B6']?.v || null;

    // Verificar se o sindicato já existe pelo nome
    let sindicato;
    if (sindicatoNome) {
      const { data: existingSindicato, error: sindicatoError } = await supabase
        .from('sindicatos')
        .select('*')
        .eq('nome', sindicatoNome)
        .single();

      if (sindicatoError) {
        console.error('Erro ao buscar sindicato existente:', sindicatoError);
        throw sindicatoError;
      }

      if (existingSindicato) {
        sindicato = existingSindicato;
      } else {
        // Criar novo sindicato
        const { data: newSindicato, error: newSindicatoError } = await supabase
          .from('sindicatos')
          .insert([
            {
              nome: sindicatoNome,
              cnpj: sindicatoCNPJ,
              site: sindicatoSite,
              data_base: sindicatoDataBase,
              estado: sindicatoEstado,
              file_id: uploadedFile.id
            }
          ])
          .select()
          .single();

        if (newSindicatoError) {
          console.error('Erro ao criar sindicato:', newSindicatoError);
          throw newSindicatoError;
        }

        sindicato = newSindicato;
      }
    }

    // Criar convenio
    const { data: convenioData, error: convenioError } = await supabase
      .from('convenios')
      .insert([
        {
          sindicato_id: sindicato?.id || null,
          descricao: 'Importação via Excel',
          file_id: uploadedFile.id
        }
      ])
      .select()
      .single();

    if (convenioError) {
      console.error('Erro ao criar convenio:', convenioError);
      throw convenioError;
    }

    const convenio = convenioData;

    // Extrair dados dos cargos
    const cargos: { cargo: string; carga_horaria: string; cbo: string }[] = [];
    let i = 9;
    while (jsonData[`A${i}`]?.v) {
      cargos.push({
        cargo: jsonData[`A${i}`]?.v || null,
        carga_horaria: jsonData[`B${i}`]?.v || null,
        cbo: jsonData[`C${i}`]?.v || null
      });
      i++;
    }

    // Salvar cargos
    if (cargos.length > 0) {
      const cargosData = cargos.map(cargo => ({
        convenio_id: convenio?.id || null,
        cargo: cargo.cargo,
        carga_horaria: cargo.carga_horaria,
        cbo: cargo.cbo,
        file_id: uploadedFile.id
      }));

      const { error: cargosError } = await supabase
        .from('cargos')
        .insert(cargosData);

      if (cargosError) {
        console.error('Erro ao salvar cargos:', cargosError);
        throw cargosError;
      }
    }

    // Extrair dados dos pisos salariais
    const pisosSalariais: { cargo: string; valor: string; descricao: string }[] = [];
    i = 9;
    while (jsonData[`D${i}`]?.v) {
      pisosSalariais.push({
        cargo: jsonData[`A${i}`]?.v || null,
        valor: jsonData[`D${i}`]?.v || null,
        descricao: jsonData[`E${i}`]?.v || null
      });
      i++;
    }

    // Salvar pisos salariais
    if (pisosSalariais.length > 0) {
      // Buscar IDs dos cargos correspondentes
      const cargosDoConvenio = await supabase
        .from('cargos')
        .select('id, cargo')
        .eq('convenio_id', convenio?.id);

      if (cargosDoConvenio.error) {
        console.error('Erro ao buscar cargos do convenio:', cargosDoConvenio.error);
        throw cargosDoConvenio.error;
      }

      // Mapear pisos salariais para incluir cargo_id
      const pisosSalariaisComCargoId = pisosSalariais.map(piso => {
        const cargoCorrespondente = cargosDoConvenio.data?.find(
          cargo => cargo.cargo === piso.cargo
        );
        return {
          ...piso,
          cargo_id: cargoCorrespondente ? cargoCorrespondente.id : null
        };
      });

      // Inserir pisos salariais com cargo_id
      const { error: pisosSalariaisError } = await supabase
        .from('piso_salarial')
        .insert(
          pisosSalariaisComCargoId.map(piso => ({
            cargo_id: piso.cargo_id,
            valor: piso.valor,
            descricao: piso.descricao,
            file_id: uploadedFile.id
          }))
        );

      if (pisosSalariaisError) {
        console.error('Erro ao salvar pisos salariais:', pisosSalariaisError);
        throw pisosSalariaisError;
      }
    }

    // Extrair dados dos valores de hora
    const valoresHora: { cargo: string; tipo: string; valor: string }[] = [];
    i = 9;
    while (jsonData[`F${i}`]?.v) {
      valoresHora.push({
        cargo: jsonData[`A${i}`]?.v || null,
        tipo: jsonData[`F${i}`]?.v || null,
        valor: jsonData[`G${i}`]?.v || null
      });
      i++;
    }

    // Salvar valores de hora
    if (valoresHora.length > 0) {
      // Buscar IDs dos cargos correspondentes
      const cargosDoConvenio = await supabase
        .from('cargos')
        .select('id, cargo')
        .eq('convenio_id', convenio?.id);

      if (cargosDoConvenio.error) {
        console.error('Erro ao buscar cargos do convenio:', cargosDoConvenio.error);
        throw cargosDoConvenio.error;
      }

      // Mapear valores de hora para incluir cargo_id
      const valoresHoraComCargoId = valoresHora.map(valorHora => {
        const cargoCorrespondente = cargosDoConvenio.data?.find(
          cargo => cargo.cargo === valorHora.cargo
        );
        return {
          ...valorHora,
          cargo_id: cargoCorrespondente ? cargoCorrespondente.id : null
        };
      });

      // Inserir valores de hora com cargo_id
      const { error: valoresHoraError } = await supabase
        .from('valores_hora')
        .insert(
          valoresHoraComCargoId.map(valorHora => ({
            cargo_id: valorHora.cargo_id,
            tipo: valorHora.tipo,
            valor: valorHora.valor,
            file_id: uploadedFile.id
          }))
        );

      if (valoresHoraError) {
        console.error('Erro ao salvar valores de hora:', valoresHoraError);
        throw valoresHoraError;
      }
    }

    // Extrair dados dos benefícios gerais
    const beneficios: { tipo: string; nome: string; valor: string; descricao: string }[] = [];
    i = 9;
    while (jsonData[`H${i}`]?.v) {
      beneficios.push({
        tipo: jsonData[`H${i}`]?.v || null,
        nome: jsonData[`I${i}`]?.v || null,
        valor: jsonData[`J${i}`]?.v || null,
        descricao: jsonData[`K${i}`]?.v || null
      });
      i++;
    }

    // Salvar benefícios gerais
    if (beneficios.length > 0) {
      const beneficiosData = beneficios.map(beneficio => ({
        convenio_id: convenio?.id || null,
        tipo: beneficio.tipo,
        nome: beneficio.nome,
        valor: beneficio.valor,
        descricao: beneficio.descricao,
        file_id: uploadedFile.id
      }));

      const { error: beneficiosError } = await supabase
        .from('beneficios_gerais')
        .insert(beneficiosData);

      if (beneficiosError) {
        console.error('Erro ao salvar benefícios gerais:', beneficiosError);
        throw beneficiosError;
      }
    }

    // Extrair dados das particularidades
    const particularidades: { cargo_id: string; conteudo: string; categoria: string }[] = [];
    i = 9;
    while (jsonData[`L${i}`]?.v) {
      particularidades.push({
        cargo_id: null, // Definir como null, já que você não está usando
        conteudo: jsonData[`L${i}`]?.v || null,
        categoria: jsonData[`M${i}`]?.v || null
      });
      i++;
    }

    // Processar particularidades
    if (particularidades.length > 0) {
      const particularidadesData = particularidades.map(part => ({
        cargo_id: part.cargo_id,
        conteudo: part.conteudo,
        categoria: part.categoria,
        file_id: uploadedFile.id, // Add required file_id
        convenio_id: convenio?.id || null
      }));

      const { error: particularidadesError } = await supabase
        .from('particularidades')
        .insert(particularidadesData);

      if (particularidadesError) {
        console.error('Erro ao salvar particularidades:', particularidadesError);
        throw particularidadesError;
      }
    }

    return { success: true, data: { sindicato, convenio } };
  } catch (error) {
    console.error('Erro durante a importação:', error);
    return { success: false, error: error };
  }
};
