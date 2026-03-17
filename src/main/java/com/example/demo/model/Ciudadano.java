package com.example.demo.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("CIUDADANO")
public class Ciudadano extends User{
}
