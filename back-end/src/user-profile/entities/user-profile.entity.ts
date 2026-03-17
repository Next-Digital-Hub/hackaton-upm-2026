import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryColumn('varchar')
  userId: string;

  @Column('varchar', { nullable: true })
  username: string;

  @Column('varchar', { nullable: true })
  fullName: string;

  // Ubicación y vivienda
  @Column('varchar', { nullable: true })
  province: string;

  @Column('enum', { enum: ['sotano', 'planta_baja', 'piso_alto', 'casa_campo'], nullable: true })
  housingType: string;

  // Composición del hogar
  @Column('boolean', { default: false })
  livesAlone: boolean;

  @Column('int', { nullable: true, default: 0 })
  dependentsCount: number;

  @Column('varchar', { nullable: true })
  dependentsDescription: string;

  // Movilidad
  @Column('boolean', { default: false })
  hasWheelchair: boolean;

  @Column('varchar', { nullable: true })
  mobilityDescription: string;

  // Mascotas
  @Column('boolean', { default: false })
  hasPets: boolean;

  @Column('varchar', { nullable: true })
  petsDescription: string;

  // Necesidades médicas
  @Column('varchar', { nullable: true })
  medicalNeeds: string;

  @Column('text', { nullable: true })
  specialNeeds: string;

  // Datos de contacto de emergencia
  @Column('varchar', { nullable: true })
  emergencyContactName: string;

  @Column('varchar', { nullable: true })
  emergencyContactPhone: string;

  // Alertas
  @Column('boolean', { default: true })
  enableAlerts: boolean;

  @Column('varchar', { nullable: true, default: 'all' })
  alertLevel: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
