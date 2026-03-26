package com.kernelpanic.campusostenible.core.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "citizens")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Citizen {

    @Id
    @Column(nullable = false, unique = true)
    private String id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String province;

    @Column(nullable = false)
    private String villageType;

    @Column(nullable = false)
    private String specialNeeds;
}