import { Entity, Column, PrimaryColumn, Index } from 'typeorm';

// Interfaces para tipagem do GeoJSON
export interface MultiPolygon {
  type: 'MultiPolygon';
  coordinates: number[][][][];
}

export interface Point {
  type: 'Point';
  coordinates: number[];
}

@Entity('partners')
export class Partner {
  @PrimaryColumn() // O desafio diz que id pode não ser inteiro, então não usamos autoincrement
  id: string;

  @Column()
  tradingName: string;

  @Column()
  ownerName: string;

  @Column({ unique: true }) // Requisito: Documento único
  document: string;

  @Index({ spatial: true }) // CRUCIAL: Índice espacial para performance
  @Column({
    type: 'geometry',
    spatialFeatureType: 'MultiPolygon',
    srid: 4326 // Padrão GPS (Lat/Long)
  })
  coverageArea: MultiPolygon;

  @Index({ spatial: true })
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326
  })
  address: Point;
}
