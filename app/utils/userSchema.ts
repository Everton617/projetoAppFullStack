import * as yup from 'yup';

export const userSchema = yup.object().shape({
    name: yup.string().required('O nome é obrigatório').min(5, 'O nome deve ter pelo menos 5 caracteres'),
    email: yup.string().required('O email é obrigatório').email('Digite um email válido'),
});