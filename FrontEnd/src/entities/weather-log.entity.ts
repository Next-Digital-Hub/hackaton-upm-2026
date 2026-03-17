import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('weather_logs')
export class WeatherLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Fecha y hora explícita en la que se guardó el log en DB
  @CreateDateColumn()
  savedAt: Date;

  @Column({ nullable: true })
  altitud: string;

  @Column({ nullable: true })
  dir: string;

  @Column({ nullable: true })
  fecha: string;

  @Column({ nullable: true })
  horaHrMax: string;

  @Column({ nullable: true })
  horaHrMin: string;

  @Column({ nullable: true })
  horaPresMax: string;

  @Column({ nullable: true })
  horaPresMin: string;

  @Column({ nullable: true })
  horaracha: string;

  @Column({ nullable: true })
  horatmax: string;

  @Column({ nullable: true })
  horatmin: string;

  @Column({ nullable: true })
  hrMax: string;

  @Column({ nullable: true })
  hrMedia: string;

  @Column({ nullable: true })
  hrMin: string;

  @Column({ nullable: true })
  indicativo: string;

  @Column({ nullable: true })
  nombre: string;

  @Column({ nullable: true })
  prec: string;

  @Column({ nullable: true })
  presMax: string;

  @Column({ nullable: true })
  presMin: string;

  @Column({ nullable: true })
  provincia: string;

  @Column({ nullable: true })
  racha: string;

  @Column({ nullable: true })
  sol: string;

  @Column({ nullable: true })
  tmax: string;

  @Column({ nullable: true })
  tmed: string;

  @Column({ nullable: true })
  tmin: string;

  @Column({ nullable: true })
  velmedia: string;
}