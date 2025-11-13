import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Lock, CreditCard, Phone, MapPin, Users, ChevronRight, ChevronLeft } from 'lucide-react';

const RegisterForm = ({ onSwitchToLogin }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Paso 1: Datos básicos
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    cedula: '',
    
    // Paso 2: Información de contacto
    phone: '',
    city: '',
    
    // Paso 3: Perfil cultural (opcional)
    ethnicGroup: '',
    musicalKnowledge: '',
    interests: [],
    
    // Consentimientos
    acceptTerms: false,
    acceptPrivacy: false,
    acceptEthnicData: false,
    acceptCommunications: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp } = useAuth();

  // Validaciones
  const validateStep1 = () => {
    if (!formData.email.includes('@')) {
      setError('Por favor ingresa un email válido');
      return false;
    }
    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    if (!formData.fullName.trim()) {
      setError('El nombre completo es obligatorio');
      return false;
    }
    if (!formData.cedula.trim()) {
      setError('El número de cédula es obligatorio');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.phone.trim()) {
      setError('El teléfono de contacto es obligatorio');
      return false;
    }
    if (!formData.city.trim()) {
      setError('La ciudad/municipio es obligatorio');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setError('');
    
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setError('');
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.acceptTerms || !formData.acceptPrivacy) {
      setError('Debes aceptar los términos y condiciones y política de privacidad');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        full_name: formData.fullName,
        cedula: formData.cedula,
        phone: formData.phone,
        city: formData.city,
        ethnic_group: formData.acceptEthnicData ? formData.ethnicGroup : null,
        musical_knowledge: formData.musicalKnowledge,
        interests: formData.interests,
        accept_communications: formData.acceptCommunications
      };

      const { data, error } = await signUp(formData.email, formData.password, userData);

      if (error) throw error;
      
      if (data?.user) {
        alert('🎉 Registro exitoso! Por favor verifica tu email antes de iniciar sesión.');
        onSwitchToLogin?.();
      }
    } catch (error) {
      console.error('Error en registro:', error);
      setError(error.message || 'Error al crear la cuenta. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  // Progress steps
  const steps = [
    { number: 1, title: 'Datos Básicos' },
    { number: 2, title: 'Información de Contacto' },
    { number: 3, title: 'Perfil Cultural' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-4 md:p-8 lg:p-12">
      {/* Progress Bar - Mejorado para responsive */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 mb-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex flex-col items-center flex-1 mx-2">
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 ${
                currentStep >= step.number 
                  ? 'bg-colonial-yellow border-colonial-yellow text-colonial-blue' 
                  : 'border-gray-300 text-gray-400'
              } font-semibold text-sm md:text-base`}>
                {step.number}
              </div>
              <span className={`text-xs md:text-sm mt-2 text-center ${
                currentStep >= step.number ? 'text-colonial-blue font-medium' : 'text-gray-400'
              }`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
        <div className="flex bg-gray-200 rounded-full h-2">
          <div 
            className="bg-colonial-yellow rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-2xl md:text-3xl lg:text-4xl font-traditional text-colonial-blue text-center mb-6 md:mb-8">
        Crear Cuenta ODAM
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 md:mb-6 text-sm md:text-base">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Paso 1: Datos Básicos */}
        {currentStep === 1 && (
          <div className="space-y-3 md:space-y-4 animate-fade-in">
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <User className="h-4 w-4 md:h-5 md:w-5 text-colonial-blue flex-shrink-0" />
              <input
                type="text"
                name="fullName"
                placeholder="Nombre completo *"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="flex-1 outline-none text-sm md:text-base text-gray-900""
              />
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-colonial-blue flex-shrink-0" />
              <input
                type="text"
                name="cedula"
                placeholder="Número de cédula *"
                value={formData.cedula}
                onChange={handleChange}
                required
                className="flex-1 outline-none text-sm md:text-base text-gray-900""
              />
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Mail className="h-4 w-4 md:h-5 md:w-5 text-colonial-blue flex-shrink-0" />
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico *"
                value={formData.email}
                onChange={handleChange}
                required
                className="flex-1 outline-none text-sm md:text-base text-gray-900""
              />
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Lock className="h-4 w-4 md:h-5 md:w-5 text-colonial-blue flex-shrink-0" />
              <input
                type="password"
                name="password"
                placeholder="Contraseña (mínimo 8 caracteres) *"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="8"
                className="flex-1 outline-none text-sm md:text-base text-gray-900""
              />
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Lock className="h-4 w-4 md:h-5 md:w-5 text-colonial-blue flex-shrink-0" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmar contraseña *"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength="8"
                className="flex-1 outline-none text-sm md:text-base text-gray-900""
              />
            </div>
          </div>
        )}

        {/* Paso 2: Información de Contacto */}
        {currentStep === 2 && (
          <div className="space-y-3 md:space-y-4 animate-fade-in">
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Phone className="h-4 w-4 md:h-5 md:w-5 text-colonial-blue flex-shrink-0" />
              <input
                type="tel"
                name="phone"
                placeholder="Teléfono de contacto *"
                value={formData.phone}
                onChange={handleChange}
                required
                className="flex-1 outline-none text-sm md:text-base text-gray-900""
              />
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <MapPin className="h-4 w-4 md:h-5 md:w-5 text-colonial-blue flex-shrink-0" />
              <input
                type="text"
                name="city"
                placeholder="Ciudad/Municipio *"
                value={formData.city}
                onChange={handleChange}
                required
                className="flex-1 outline-none text-sm md:text-base text-gray-900""
              />
            </div>
          </div>
        )}

        {/* Paso 3: Perfil Cultural */}
        {currentStep === 3 && (
          <div className="space-y-4 md:space-y-6 animate-fade-in">
            <div className="space-y-2 md:space-y-3">
              <label className="block text-xs md:text-sm font-medium text-gray-700">
                Grupo Étnico (Opcional)
              </label>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Users className="h-4 w-4 md:h-5 md:w-5 text-colonial-blue flex-shrink-0" />
                <select
                  name="ethnicGroup"
                  value={formData.ethnicGroup}
                  onChange={handleChange}
                  className="flex-1 outline-none bg-white text-sm md:text-base"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="afro">Afrodescendiente</option>
                  <option value="indigena">Indígena</option>
                  <option value="raizal">Raizal</option>
                  <option value="palenquero">Palenquero</option>
                  <option value="gitano">Gitano/Rom</option>
                  <option value="ninguno">Prefiero no decir</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 md:space-y-3">
              <label className="block text-xs md:text-sm font-medium text-gray-700">
                Nivel de Conocimiento Musical
              </label>
              <select
                name="musicalKnowledge"
                value={formData.musicalKnowledge}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg outline-none text-sm md:text-base"
              >
                <option value="">Selecciona tu nivel</option>
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
                <option value="experto">Experto/Maestro</option>
              </select>
            </div>

            <div className="space-y-2 md:space-y-3">
              <label className="block text-xs md:text-sm font-medium text-gray-700">
                Intereses Musicales (Puedes seleccionar varios)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['Bullerengue', 'Chandé', 'Mapalé', 'Cumbia', 'Porro', 'Vallenato', 'Gaitas', 'Tambores'].map(interest => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`p-2 border rounded-lg text-xs md:text-sm transition-colors ${
                      formData.interests.includes(interest)
                        ? 'bg-colonial-yellow border-colonial-yellow text-colonial-blue'
                        : 'border-gray-300 text-gray-700 hover:border-colonial-blue'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* Consentimientos */}
            <div className="space-y-3 md:space-y-4 border-t pt-4 md:pt-6">
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  name="acceptEthnicData"
                  checked={formData.acceptEthnicData}
                  onChange={handleChange}
                  className="mt-1 flex-shrink-0"
                />
                <label className="text-xs md:text-sm text-gray-600">
                  Autorizo el tratamiento de datos étnicos para fines estadísticos y de preservación cultural
                </label>
              </div>

              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  name="acceptCommunications"
                  checked={formData.acceptCommunications}
                  onChange={handleChange}
                  className="mt-1 flex-shrink-0"
                />
                <label className="text-xs md:text-sm text-gray-600">
                  Deseo recibir información sobre nuevos cursos y actividades culturales
                </label>
              </div>

              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  required
                  className="mt-1 flex-shrink-0"
                />
                <label className="text-xs md:text-sm text-gray-600">
                  Acepto los <a href="/terminos" className="text-colonial-blue underline">términos y condiciones</a>
                </label>
              </div>

              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  name="acceptPrivacy"
                  checked={formData.acceptPrivacy}
                  onChange={handleChange}
                  required
                  className="mt-1 flex-shrink-0"
                />
                <label className="text-xs md:text-sm text-gray-600">
                  Acepto la <a href="/privacidad" className="text-colonial-blue underline">política de privacidad</a>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Botones de Navegación - Mejorados para responsive */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-center space-y-4 md:space-y-0 space-y-reverse mt-6 md:mt-8">
          <div className="w-full md:w-auto">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="w-full md:w-auto flex items-center justify-center space-x-2 px-4 md:px-6 py-3 border border-colonial-blue text-colonial-blue rounded-lg font-caribbean hover:bg-colonial-blue hover:text-white transition-colors text-sm md:text-base"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Anterior</span>
              </button>
            ) : (
              <div></div>
            )}
          </div>

          <div className="w-full md:w-auto">
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full md:w-auto flex items-center justify-center space-x-2 bg-colonial-yellow text-colonial-blue px-4 md:px-6 py-3 rounded-lg font-caribbean font-semibold hover:bg-yellow-500 transition-colors text-sm md:text-base"
              >
                <span>Siguiente</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto bg-colonial-yellow text-colonial-blue px-4 md:px-6 py-3 rounded-lg font-caribbean font-semibold hover:bg-yellow-500 transition-colors disabled:opacity-50 text-sm md:text-base"
              >
                {loading ? 'Creando cuenta...' : 'Completar Registro'}
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="text-center mt-4 md:mt-6 pt-4 md:pt-6 border-t">
        <button
          onClick={onSwitchToLogin}
          className="text-colonial-blue hover:underline text-sm md:text-base"
        >
          ¿Ya tienes cuenta? Inicia sesión aquí
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
