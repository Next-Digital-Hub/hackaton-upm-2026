import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('weather_logs')
export class WeatherLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Fecha y hora explícita en la que se guardó el log en DB
  @CreateDateColumn()
  savedAt: Date;

  @Column({ type: 'float', nullable: true })
  altitud: number | null = null;

  @Column({ type: 'varchar', nullable: true })
  dir: string | null = null;

  @Column({ type: 'varchar', nullable: true })
  fecha: string | null = null;

  @Column({ type: 'varchar', nullable: true })
  horaHrMax: string | null = null;

  @Column({ type: 'varchar', nullable: true })
  horaHrMin: string | null = null;

  @Column({ type: 'varchar', nullable: true })
  horaPresMax: string | null = null;

  @Column({ type: 'varchar', nullable: true })
  horaPresMin: string | null = null;

  @Column({ type: 'varchar', nullable: true })
  horaracha: string | null = null;

  @Column({ type: 'varchar', nullable: true })
  horatmax: string | null = null;

  @Column({ type: 'varchar', nullable: true })
  horatmin: string | null = null;

  @Column({ type: 'float', nullable: true })
  hrMax: number | null = null;

  @Column({ type: 'float', nullable: true })
  hrMedia: number | null = null;

  @Column({ type: 'float', nullable: true })
  hrMin: number | null = null;

  @Column({ type: 'varchar', nullable: true })
  indicativo: string | null = null;

  @Column({ type: 'varchar', nullable: true })
  nombre: string | null = null;

  @Column({ type: 'float', nullable: true })
  prec: number | null = null;

  @Column({ type: 'float', nullable: true })
  presMax: number | null = null;

  @Column({ type: 'float', nullable: true })
  presMin: number | null = null;

  @Column({ type: 'varchar', nullable: true })
  provincia: string | null = null;

  @Column({ type: 'float', nullable: true })
  racha: number | null = null;

  @Column({ type: 'float', nullable: true })
  sol: number | null = null;

  @Column({ type: 'float', nullable: true })
  tmax: number | null = null;

  @Column({ type: 'float', nullable: true })
  tmed: number | null = null;

  @Column({ type: 'float', nullable: true })
  tmin: number | null = null;

  @Column({ type: 'float', nullable: true })
  velmedia: number | null = null;
}