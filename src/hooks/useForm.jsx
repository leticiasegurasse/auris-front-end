import { useState } from "react";
import { getCardFlag } from "../utils/cardUtils";

export function useForm(initialValues, validations = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  function formatCPF(value) {
    return value
      .replace(/\D/g, "") // Remove tudo que não for número
      .replace(/(\d{3})(\d)/, "$1.$2") // Coloca um ponto após o terceiro dígito
      .replace(/(\d{3})(\d)/, "$1.$2") // Coloca um ponto após o sexto dígito
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2") // Coloca um hífen antes dos últimos dois dígitos
      .slice(0, 14); // Garante que o CPF não tenha mais de 14 caracteres
  }

  function formatPhone(value) {
    return value
      .replace(/\D/g, "") // Remove tudo que não for número
      .replace(/(\d{2})(\d)/, "($1) $2") // Coloca os parênteses no DDD
      .replace(/(\d{5})(\d)/, "$1-$2") // Coloca o hífen no meio do número
      .slice(0, 15); // Garante que o telefone não tenha mais de 15 caracteres
  }
  

  function formatCEP(value) {
    return value
      .replace(/\D/g, "") // Remove tudo que não for número
      .replace(/(\d{5})(\d)/, "$1-$2") // Insere o hífen após os primeiros 5 números
      .slice(0, 9); // Garante que o CEP tenha no máximo 9 caracteres
  }

  function formatCardNumber(value) {
    return value
      .replace(/\D/g, "") // Remove tudo que não for número
      .replace(/(\d{4})(?=\d)/g, "$1 ") // Adiciona um espaço a cada 4 números
      .trim() // Remove espaços extras no final
      .slice(0, 19); // Garante que o número não passe de 19 caracteres (16 números + 3 espaços)
  }

  function formatValidade(value) {
      return value
        .replace(/\D/g, "") // Remove tudo que não for número
        .replace(/(\d{2})(\d)/, "$1/$2") // Coloca a barra entre MM e AA
        .slice(0, 5); // Limita a 5 caracteres (MM/AA)
  }


  function formatCVV(value) {
    return value
      .replace(/\D/g, "") // Remove tudo que não for número
      .slice(0, 3); // Limita a 3 caracteres
  }

  function isValidCPF(cpf) {
    cpf = cpf.replace(/\D/g, ""); // Remove caracteres não numéricos

    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false; // Verifica se todos os números são iguais

    let sum = 0;
    let remainder;

    // Calcula o primeiro dígito verificador
    for (let i = 1; i <= 9; i++) sum += parseInt(cpf[i - 1]) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf[9])) return false;

    sum = 0;
    // Calcula o segundo dígito verificador
    for (let i = 1; i <= 10; i++) sum += parseInt(cpf[i - 1]) * (12 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf[10])) return false;

    return true;
  }

  function isValidPhone(phone) {
    phone = phone.replace(/\D/g, ""); // Remove caracteres não numéricos
    return /^(\d{2})9?\d{8}$/.test(phone); // Valida telefones com 10 ou 11 dígitos
  }

  function isValidValidade(validade) {
    return /^(0[1-9]|1[0-2])\/\d{2}$/.test(validade); // Verifica se a validade está no formato MM/AA
  }

  function isValidCVV(cvv) {
    return /^\d{3}$/.test(cvv); // Verifica se o CVV tem exatamente 3 dígitos
  }

  // Manipula mudanças nos inputs
  function handleChange(event) {
    const { name, value } = event.target;

    let formattedValue = value;
    if (name === "cpf" || name === "card_cpf") formattedValue = formatCPF(value);
    if (name === "phone" || name === "card_phone" || name === "whatsapp" || name === "phone_number") formattedValue = formatPhone(value);
    if (name === "cep") formattedValue = formatCEP(value);
    if (name === "card_number") formattedValue = formatCardNumber(value);
    if (name === "validade") formattedValue = formatValidade(value);
    if (name === "cvv") formattedValue = formatCVV(value);

    if (name === "card_number") {
      const cardImage = getCardFlag(value);
      setValues((prevValues) => ({
        ...prevValues,
        card_number: formattedValue,
        card_flag: cardImage, // Agora armazena o caminho da imagem
      }));
      return;
    }

    setValues((prevValues) => ({
      ...prevValues,
      [name]: formattedValue,
    }));

    if (validations[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: validations[name](formattedValue),
      }));
    }
  }

  // Reseta os valores do formulário
  function resetForm() {
    setValues(initialValues);
    setErrors({});
  }

  // Valida todos os campos antes do envio
  function validateForm() {
    let valid = true;
    const newErrors = {};

    for (const field in validations) {
      const error = validations[field](values[field]);
      if (error) {
        newErrors[field] = error;
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  }

  return {
    values,
    errors,
    handleChange,
    resetForm,
    validateForm,
    setValues,
    isValidCPF,
    isValidPhone,
    isValidValidade,
    isValidCVV,
  };
}
