
import NaoEncontrado from "../erros/NaoEncontrado.js";
import { autor } from "../models/index.js";

class AutorController{

  static async listarAutores(req, res, next){
    try{
      const listaAutores = autor.find({});
      req.resultado = listaAutores;
      next();
    } catch(erro){
      //res.status(500).json({ message: `${erro.message} - Falha na requisição` });
      next(erro);
    }
  }

  static async listarAutorPorId(req, res, next){
    try{
      const id = req.params.id;
      const autorEncontrado = await autor.findById(id);

      if(autorEncontrado !== null){
        res.status(200).send(autorEncontrado);
      } else {
        next(new NaoEncontrado("ID do autor não localizado"));
      }
    } catch(erro){
      next(erro);
    }
  }

  static async cadastrarAutor (req, res, next){
    try{
      const novoAutor = await autor.create(req.body);
      res.status(201).json({ message: "criado com sucesso", Autor: novoAutor });
    } catch(erro){
      next(erro);
    }
  }

  static async atualizarAutor(req, res, next){
    try{
      const id = req.params.id;
      const autorBuscado = await autor.findByIdAndUpdate(id, req.body);
      if(autorBuscado !== null){
        res.status(200).json({ message: "Autor atualizado" });
      } else {
        next(new NaoEncontrado("ID do autor não localizado"));
      }
    } catch(erro){
      next(erro);
    }
  }

  static async excluirAutor(req, res, next){
    try{
      const id = req.params.id;
      const autorBuscado = await autor.findByIdAndDelete(id);
      if(autorBuscado !== null){
        res.status(200).json({ message: "Autor excluído com sucesso" });
      } else {
        next(new NaoEncontrado("ID do autor não localizado"));
      }
    } catch(erro){
      next(erro);
    }
  }

}

export default AutorController;