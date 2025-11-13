// Comprehensive form validation utilities with security measures
class FormValidator {
  constructor(options = {}) {
    this.options = {
      sanitize: true,
      validateOnBlur: true,
      validateOnChange: false,
      showErrors: true,
      ...options
    };
    
    this.rules = new Map();
    this.customValidators = new Map();
    this.errorMessages = new Map();
    
    this.initializeDefaultRules();
  }

  // Default validation rules
  initializeDefaultRules() {
    this.addRule('required', (value) => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string') return value.trim().length > 0;
      if (Array.isArray(value)) return value.length > 0;
      return true;
    }, 'Este campo es obligatorio');

    this.addRule('email', (value) => {
      if (!value) return true; // Skip if empty (use required for mandatory)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(String(value).toLowerCase());
    }, 'Por favor ingresa un email válido');

    this.addRule('minLength', (value, param) => {
      if (!value) return true;
      return String(value).length >= param;
    }, (param) => `Mínimo ${param} caracteres requeridos`);

    this.addRule('maxLength', (value, param) => {
      if (!value) return true;
      return String(value).length <= param;
    }, (param) => `Máximo ${param} caracteres permitidos`);

    this.addRule('numeric', (value) => {
      if (!value) return true;
      return !isNaN(parseFloat(value)) && isFinite(value);
    }, 'Debe ser un número válido');

    this.addRule('url', (value) => {
      if (!value) return true;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    }, 'Por favor ingresa una URL válida');

    this.addRule('alpha', (value) => {
      if (!value) return true;
      return /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/.test(value);
    }, 'Solo se permiten letras y espacios');

    this.addRule('alphaNumeric', (value) => {
      if (!value) return true;
      return /^[A-Za-z0-9ÁáÉéÍíÓóÚúÑñ\s]+$/.test(value);
    }, 'Solo se permiten letras, números y espacios');
  }

  // Add custom validation rule
  addRule(name, validator, message) {
    this.rules.set(name, validator);
    this.errorMessages.set(name, message);
  }

  // Add custom validator function
  addCustomValidator(name, validator) {
    this.customValidators.set(name, validator);
  }

  // Sanitize input to prevent XSS and injection attacks
  sanitize(input) {
    if (input === null || input === undefined) return '';
    
    const stringValue = String(input);
    
    // Remove potentially dangerous characters
    return stringValue
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  // Validate single field
  validateField(fieldName, value, rules) {
    const errors = [];
    
    if (!rules || rules.length === 0) return errors;

    for (const rule of rules) {
      const [ruleName, param] = rule.split(':');
      
      if (this.rules.has(ruleName)) {
        const validator = this.rules.get(ruleName);
        const isValid = validator(value, param);
        
        if (!isValid) {
          let message = this.errorMessages.get(ruleName);
          if (typeof message === 'function') {
            message = message(param);
          }
          errors.push(message);
        }
      } else if (this.customValidators.has(ruleName)) {
        const validator = this.customValidators.get(ruleName);
        const result = validator(value, param);
        if (result !== true) {
          errors.push(result || `Validation failed for ${ruleName}`);
        }
      }
    }

    return errors;
  }

  // Validate entire form
  validateForm(formData, validationSchema) {
    const errors = {};
    let isValid = true;

    for (const [fieldName, rules] of Object.entries(validationSchema)) {
      const value = formData[fieldName];
      const fieldErrors = this.validateField(fieldName, value, rules);
      
      if (fieldErrors.length > 0) {
        errors[fieldName] = fieldErrors;
        isValid = false;
      }
    }

    return { isValid, errors };
  }

  // Create React hook for form validation
  createValidationHook(validationSchema) {
    return (initialData = {}) => {
      const [formData, setFormData] = React.useState(initialData);
      const [errors, setErrors] = React.useState({});
      const [touched, setTouched] = React.useState({});

      const validate = React.useCallback((data = formData) => {
        return this.validateForm(data, validationSchema);
      }, [formData]);

      const handleChange = React.useCallback((field, value) => {
        const sanitizedValue = this.options.sanitize ? this.sanitize(value) : value;
        
        setFormData(prev => ({
          ...prev,
          [field]: sanitizedValue
        }));

        if (this.options.validateOnChange) {
          const { errors: newErrors } = validate({ ...formData, [field]: sanitizedValue });
          setErrors(newErrors);
        }

        // Clear error when user starts typing
        if (errors[field]) {
          setErrors(prev => ({
            ...prev,
            [field]: []
          }));
        }
      }, [formData, validate, errors]);

      const handleBlur = React.useCallback((field) => {
        setTouched(prev => ({
          ...prev,
          [field]: true
        }));

        if (this.options.validateOnBlur) {
          const { errors: newErrors } = validate();
          setErrors(newErrors);
        }
      }, [validate]);

      const handleSubmit = React.useCallback((onSubmit) => {
        return (e) => {
          if (e) e.preventDefault();
          
          const { isValid, errors: validationErrors } = validate();
          setErrors(validationErrors);
          
          // Mark all fields as touched
          const allTouched = Object.keys(validationSchema).reduce((acc, key) => {
            acc[key] = true;
            return acc;
          }, {});
          setTouched(allTouched);

          if (isValid && onSubmit) {
            onSubmit(formData);
          }
        };
      }, [formData, validate, validationSchema]);

      const resetForm = React.useCallback((newData = {}) => {
        setFormData(newData);
        setErrors({});
        setTouched({});
      }, []);

      const setFieldError = React.useCallback((field, message) => {
        setErrors(prev => ({
          ...prev,
          [field]: [message]
        }));
      }, []);

      return {
        formData,
        errors,
        touched,
        isValid: Object.keys(errors).length === 0,
        handleChange,
        handleBlur,
        handleSubmit,
        resetForm,
        setFieldError,
        setFormData,
        validate: () => validate(formData)
      };
    };
  }

  // Static method for quick validation
  static validate(value, rules) {
    const validator = new FormValidator();
    return validator.validateField('field', value, rules);
  }

  // Static method for quick form validation
  static validateForm(formData, validationSchema) {
    const validator = new FormValidator();
    return validator.validateForm(formData, validationSchema);
  }

  // Common validation schemas
  static get Schemas() {
    return {
      USER_PROFILE: {
        name: ['required', 'minLength:2', 'maxLength:50', 'alpha'],
        email: ['required', 'email', 'maxLength:100'],
        bio: ['maxLength:500'],
        role: ['required', 'maxLength:100']
      },
      AUDIO_TRACK: {
        title: ['required', 'minLength:1', 'maxLength:200'],
        artist: ['required', 'maxLength:100'],
        genre: ['required', 'maxLength:50'],
        audioUrl: ['required', 'url'],
        description: ['maxLength:1000']
      },
      CONTACT_FORM: {
        name: ['required', 'minLength:2', 'maxLength:100'],
        email: ['required', 'email'],
        message: ['required', 'minLength:10', 'maxLength:1000']
      }
    };
  }
}

// Export for both module and browser environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FormValidator;
} else {
  window.FormValidator = FormValidator;
}

export default FormValidator;
