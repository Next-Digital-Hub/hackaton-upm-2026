package com.kernelpanic.campusostenible.core.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "back_office")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BackOffice {

    @Id
    @Column(nullable = false, unique = true)
    private String id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;
}