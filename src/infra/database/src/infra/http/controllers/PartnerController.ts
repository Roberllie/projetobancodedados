import { Request, Response } from 'express';
import { AppDataSource } from '../../database/typeorm.config';
import { Partner } from '../../../domain/entities/Partner';

export class PartnerController {
  private repository = AppDataSource.getRepository(Partner);

  // 1.1 Criar Parceiro
  async create(req: Request, res: Response) {
    try {
      const partner = this.repository.create(req.body);
      await this.repository.save(partner);
      return res.status(201).json(partner);
    } catch (error: any) {
      // Tratamento básico de erro de duplicidade
      if (error.code === '23505') {
        return res.status(409).json({ message: 'Duplicate ID or Document' });
      }
      return res.status(500).json({ message: error.message });
    }
  }

  // 1.2 Carregar pelo ID
  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const partner = await this.repository.findOneBy({ id });
    
    if (!partner) return res.status(404).json({ message: 'Partner not found' });
    
    return res.json(partner);
  }

  // 1.3 Buscar Parceiro Mais Próximo (A Lógica Principal)
  async searchNearest(req: Request, res: Response) {
    const { long, lat } = req.query;

    if (!long || !lat) {
      return res.status(400).json({ message: 'Missing long or lat parameters' });
    }

    /* EXPLICAÇÃO TÉCNICA:
      1. ST_MakePoint(long, lat): Cria um ponto geométrico.
      2. ST_SetSRID(..., 4326): Define que estamos usando coordenadas GPS mundiais.
      3. ST_Intersects: Filtra APENAS quem cobre a área (Onde o ponto está DENTRO do Polígono).
      4. ST_Distance: Calcula a distância para ordenação.
    */
    
    const origin = `ST_SetSRID(ST_MakePoint(${long}, ${lat}), 4326)`;

    const nearestPartner = await this.repository
      .createQueryBuilder('partner')
      .where(`ST_Intersects(partner.coverageArea, ${origin})`) // Filtro de Cobertura
      .orderBy(`ST_Distance(partner.address, ${origin})`, 'ASC') // Filtro de Proximidade
      .limit(1)
      .getOne();

    if (!nearestPartner) {
      return res.status(404).json({ message: 'No partner available in this area' });
    }

    return res.json(nearestPartner);
  }
}
