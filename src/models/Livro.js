import mongoose from "mongoose";
import {autorSchema} from "./Autor.js";

const livroSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId },
  titulo: { type: String, required: [true, "O título do livro é obrigatório"] },
  editora: { type: String, enum: { 
    values: ["Alura", "Clássicos", "ETC"], 
    message: "A editora fornecida não é um valor permitido. Valores permitidos: 'Alura', 'Clássicos' ou 'ETC'"} 
  },
  preco: { type: Number},
  paginas: { 
    type: Number, 
    /*min: [10, "O número de páginas deve estar entre 10 e 5000. Valor fornecido: {VALUE}"], 
    max: [5000, "O número de páginas deve estar entre 10 e 5000. Valor fornecido: {VALUE}"] */
    validate: { // validação personalizada
      validator: (valor) => {
        return valor >= 10 && valor <= 5000;
      },
      message: "O número de páginas deve estar entre 10 e 5000. Valor fornecido: {VALUE}"
    }
  },
  autor: autorSchema
}, { versionKey: false });

const livro = mongoose.model("livros", livroSchema);

export default livro;