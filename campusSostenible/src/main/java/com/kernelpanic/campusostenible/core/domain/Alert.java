package com.kernelpanic.campusostenible.core.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "alerts")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Alert {
    @Id
    @Column(nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String date;

    @Column(nullable = false)
    private String province;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private AlertLevel alertLevel;
}