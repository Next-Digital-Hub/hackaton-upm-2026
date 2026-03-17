import React, { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import './UserProfileConfig.css';

const UserProfileConfig = ({ onProfileUpdate, onClose }) => {
  const { keycloak } = useKeycloak();
  const [profile, setProfile] = useState({
    province: '',
    housingType: 'piso_alto',
    livesAlone: true,
    dependentsCount: 0,
    dependentsDescription: '',
    hasWheelchair: false,
    mobilityDescription: '',
    hasPets: false,
    petsDescription: '',
    medicalNeeds: '',
    specialNeeds: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/backend/user-profile', {
        headers: {
          'Authorization': `Bearer ${keycloak.token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/backend/user-profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setSaved(true);
        if (onProfileUpdate) {
          onProfileUpdate(updatedProfile);
        }
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-config-container">
      <div className="profile-config-header">
        <h2>Configurar Perfil de Seguridad</h2>
        {onClose && (
          <button className="close-button" onClick={onClose}>×</button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        {/* Ubicación */}
        <section className="form-section">
          <h3>📍 Ubicación y Vivienda</h3>
          
          <div className="form-group">
            <label htmlFor="province">Provincia/Región</label>
            <input
              id="province"
              type="text"
              name="province"
              value={profile.province}
              onChange={handleChange}
              placeholder="Ej: Madrid, Barcelona, Sevilla..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="housingType">Tipo de Vivienda</label>
            <select
              id="housingType"
              name="housingType"
              value={profile.housingType}
              onChange={handleChange}
              required
            >
              <option value="sotano">🏚️ Sótano</option>
              <option value="planta_baja">📍 Planta Baja</option>
              <option value="piso_alto">🏢 Piso Alto</option>
              <option value="casa_campo">🏡 Casa de Campo</option>
            </select>
          </div>
        </section>

        {/* Composición del Hogar */}
        <section className="form-section">
          <h3>👨‍👩‍👧‍👦 Composición del Hogar</h3>

          <div className="form-group checkbox">
            <label htmlFor="livesAlone">
              <input
                id="livesAlone"
                type="checkbox"
                name="livesAlone"
                checked={profile.livesAlone}
                onChange={handleChange}
              />
              Vivo solo/a
            </label>
          </div>

          {!profile.livesAlone && (
            <>
              <div className="form-group">
                <label htmlFor="dependentsCount">Número de dependientes (menores, adultos mayores, etc.)</label>
                <input
                  id="dependentsCount"
                  type="number"
                  name="dependentsCount"
                  value={profile.dependentsCount}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="dependentsDescription">Descripción de dependientes</label>
                <textarea
                  id="dependentsDescription"
                  name="dependentsDescription"
                  value={profile.dependentsDescription}
                  onChange={handleChange}
                  placeholder="Ej: 2 menores (5 y 8 años), 1 adulta mayor con demencia"
                  rows="3"
                />
              </div>
            </>
          )}
        </section>

        {/* Movilidad */}
        <section className="form-section">
          <h3>♿ Movilidad</h3>

          <div className="form-group checkbox">
            <label htmlFor="hasWheelchair">
              <input
                id="hasWheelchair"
                type="checkbox"
                name="hasWheelchair"
                checked={profile.hasWheelchair}
                onChange={handleChange}
              />
              Uso silla de ruedas
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="mobilityDescription">Otras limitaciones de movilidad</label>
            <textarea
              id="mobilityDescription"
              name="mobilityDescription"
              value={profile.mobilityDescription}
              onChange={handleChange}
              placeholder="Ej: Problemas de artritis, usa andador, persona mayor con mareos..."
              rows="2"
            />
          </div>
        </section>

        {/* Mascotas */}
        <section className="form-section">
          <h3>🐾 Mascotas</h3>

          <div className="form-group checkbox">
            <label htmlFor="hasPets">
              <input
                id="hasPets"
                type="checkbox"
                name="hasPets"
                checked={profile.hasPets}
                onChange={handleChange}
              />
              Tengo mascotas
            </label>
          </div>

          {profile.hasPets && (
            <div className="form-group">
              <label htmlFor="petsDescription">Descripción de mascotas</label>
              <textarea
                id="petsDescription"
                name="petsDescription"
                value={profile.petsDescription}
                onChange={handleChange}
                placeholder="Ej: 1 perro grande (Labrador), 2 gatos, pájaro en jaula..."
                rows="2"
              />
            </div>
          )}
        </section>

        {/* Necesidades Especiales */}
        <section className="form-section">
          <h3>⚕️ Necesidades Especiales</h3>

          <div className="form-group">
            <label htmlFor="medicalNeeds">Necesidades médicas críticas</label>
            <textarea
              id="medicalNeeds"
              name="medicalNeeds"
              value={profile.medicalNeeds}
              onChange={handleChange}
              placeholder="Ej: Diabetes (necesita refrigeración de insulina), oxígeno portátil, diálisis..."
              rows="2"
            />
          </div>

          <div className="form-group">
            <label htmlFor="specialNeeds">Otras necesidades especiales</label>
            <textarea
              id="specialNeeds"
              name="specialNeeds"
              value={profile.specialNeeds}
              onChange={handleChange}
              placeholder="Ej: Lenguaje de signos, intérprete necesario, alergias severas..."
              rows="2"
            />
          </div>
        </section>

        {/* Emergencia */}
        <section className="form-section">
          <h3>🚨 Contacto de Emergencia</h3>

          <div className="form-group">
            <label htmlFor="emergencyContactName">Nombre de contacto</label>
            <input
              id="emergencyContactName"
              type="text"
              name="emergencyContactName"
              value={profile.emergencyContactName}
              onChange={handleChange}
              placeholder="Ej: María García"
            />
          </div>

          <div className="form-group">
            <label htmlFor="emergencyContactPhone">Teléfono de contacto</label>
            <input
              id="emergencyContactPhone"
              type="tel"
              name="emergencyContactPhone"
              value={profile.emergencyContactPhone}
              onChange={handleChange}
              placeholder="Ej: +34 601 234 567"
            />
          </div>
        </section>

        {/* Botones */}
        <div className="form-actions">
          {saved && <p className="success-message">✓ Perfil guardado correctamente</p>}
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Guardando...' : 'Guardar Perfil de Seguridad'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfileConfig;
