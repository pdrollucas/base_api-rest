import NaoEncontrado from "../erros/NaoEncontrado.js";
import { autor, livro } from "../models/index.js";

class LivroController{

  static async listarLivros(req, res, next){
    try{
      const buscaLivros = livro.find();
      req.resultado = buscaLivros;
      next();
    } catch(erro){
      next(erro);
    }
  }

  static async listarLivroPorId(req, res, next){
    try{
      const id = req.params.id;
      const livroEncontrado = await livro.findById(id);
      if(livroEncontrado !== null){
        res.status(200).json(livroEncontrado);
      } else{
        next(new NaoEncontrado("ID do livro não enocntrado"));
      }
    } catch(erro){
      next(erro);
    }
  }

  static async cadastrarLivro (req, res, next){
    const novoLivro = req.body;
    try{
      const autorEncontrado = await autor.findById(novoLivro.autor);
      const livroCompleto = { ...novoLivro, autor: { ...autorEncontrado._doc } };
      const livroCriado = await livro.create(livroCompleto);
      res.status(201).json({ message: "criado com sucesso", livro: livroCriado });
    } catch(erro){
      //res.status(500).json({ message: `${erro.message} - falha ao cadastrar livro` });
      next(erro);
    }
  }

  static async atualizarLivro(req, res, next){
    try{
      const id = req.params.id;
      const livroBuscado = await livro.findByIdAndUpdate(id, req.body);
      if(livroBuscado !== null){
        res.status(200).json({ message: "Livro atualizado" });
      } else {
        next(new NaoEncontrado("ID do livro não encontrado"));
      }
    } catch(erro){
      next(erro);
    }
  }

  static async excluirLivro(req, res, next){
    try{
      const id = req.params.id;
      const livroBuscado = await livro.findByIdAndDelete(id);
      if(livroBuscado !== null){
        res.status(200).json({ message: "Livro excluído com sucesso" });
      } else {
        next(new NaoEncontrado("ID do livro não encontrado"));
      }
    } catch(erro){
      next(erro);
    }
  }

  static async listarLivrosPorFiltro(req, res, next){
    //exemplo: http://localhost:3000/livros/busca?autor=Rick Riordan&ordenacao=titulo:-1
    try{
      const busca = processaBusca(req.query);
      if(busca !== null){
        const livrosResultado = livro.find(busca);
        req.resultado = livrosResultado;
        next();
      } else {
        res.status(200).send([]);
      }
    } catch (erro){
      next(erro);
    }
  }

}

function processaBusca(parametros){
  const {editora, titulo, minPaginas, maxPaginas, autor} = parametros;

  let busca = {};

  if(editora) busca.editora = editora;
  if(titulo) busca.titulo = { $regex: titulo, $options: "i" };

  if(minPaginas || maxPaginas) busca.paginas = {};

  if(minPaginas) busca.paginas.$gte = minPaginas;
  if(maxPaginas) busca.paginas.$lte = maxPaginas;

  if(autor !== null){
    busca["autor.nome"] = { $regex: autor, $options: "i" };
  } else {
    busca = null;
  }

  return busca;
}

export default LivroController;