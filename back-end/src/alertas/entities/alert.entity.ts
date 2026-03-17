import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string; // e.g., 'Olla de calor', 'Incendio forestal'

  @Column()
  severity: string; // e.g., 'Rojo', 'Naranja', 'Amarillo'

  @Column('text')
  description: string;

  @Column()
  location: string;

  @CreateDateColumn()
  timestamp: Date;
}
